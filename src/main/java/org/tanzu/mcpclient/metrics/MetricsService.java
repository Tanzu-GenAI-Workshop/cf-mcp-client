package org.tanzu.mcpclient.metrics;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.tanzu.mcpclient.a2a.A2AAgentService;
import org.tanzu.mcpclient.a2a.A2AConfiguration;
import org.tanzu.mcpclient.a2a.AgentCard;
import org.tanzu.mcpclient.mcp.McpClientFactory;
import org.tanzu.mcpclient.mcp.McpDiscoveryService;
import org.tanzu.mcpclient.mcp.McpServerService;
import org.tanzu.mcpclient.memory.MemoryPreferenceService;
import org.tanzu.mcpclient.model.ModelDiscoveryService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service that collects and provides platform metrics including models and MCP servers.
 * It dynamically evaluates the health of MCP servers and A2A agents on demand
 * to detect removed/unbound services without requiring an application restart.
 */
@Service
public class MetricsService {

    private static final Logger logger = LoggerFactory.getLogger(MetricsService.class);

    private final MemoryPreferenceService memoryPreferenceService;
    private final McpDiscoveryService mcpDiscoveryService;
    private final McpClientFactory mcpClientFactory;
    private final A2AConfiguration a2aConfiguration;
    private final ModelDiscoveryService modelDiscoveryService;
    private final VectorStore vectorStore;

    public MetricsService(MemoryPreferenceService memoryPreferenceService,
                          McpDiscoveryService mcpDiscoveryService,
                          McpClientFactory mcpClientFactory,
                          A2AConfiguration a2aConfiguration,
                          @Lazy ModelDiscoveryService modelDiscoveryService,
                          @Lazy VectorStore vectorStore) {
        this.memoryPreferenceService = memoryPreferenceService;
        this.mcpDiscoveryService = mcpDiscoveryService;
        this.mcpClientFactory = mcpClientFactory;
        this.a2aConfiguration = a2aConfiguration;
        this.modelDiscoveryService = modelDiscoveryService;
        this.vectorStore = vectorStore;
    }

    public Metrics getMetrics(String conversationId) {
        logger.debug("Retrieving dynamically-evaluated metrics for conversation: {}", conversationId);

        String chatModel = modelDiscoveryService.getChatModelName();
        String embeddingModel = modelDiscoveryService.getEmbeddingModelName();
        String currentVectorStoreName = vectorStore != null ? vectorStore.getName() : "";
        String memoryType = memoryPreferenceService.getPreference(conversationId).name();

        List<McpServer> mcpServersWithHealth = buildMcpServersList();
        List<A2AAgent> a2aAgents = buildA2AAgentsList();

        return new Metrics(
                conversationId,
                chatModel != null ? chatModel : "",
                embeddingModel != null ? embeddingModel : "",
                currentVectorStoreName != null ? currentVectorStoreName : "",
                mcpServersWithHealth.toArray(new McpServer[0]),
                a2aAgents,
                memoryType
        );
    }

    /**
     * Dynamically builds the list of MCP servers and evaluates their health.
     */
    private List<McpServer> buildMcpServersList() {
        List<McpServer> servers = new ArrayList<>();
        // Dynamically discover configured MCP services
        for (McpDiscoveryService.McpServiceConfiguration config : mcpDiscoveryService.getMcpServicesWithProtocol()) {
            McpServerService service = new McpServerService(
                    config.serviceName(),
                    config.serverUrl(),
                    config.protocol(),
                    config.headerSupplier(),
                    mcpClientFactory
            );
            // Health-check the service (this detects if it was removed/offline)
            McpServer mcpServer = service.getHealthyMcpServer();
            // We only include healthy servers so that if a service is removed, it disappears from the active tools list.
            if (mcpServer.healthy()) {
                servers.add(mcpServer);
            }
        }
        return servers;
    }

    /**
     * Dynamically builds the list of A2A agents from agent services and re-evaluates their health.
     */
    private List<A2AAgent> buildA2AAgentsList() {
        return a2aConfiguration.getAgentServices().stream()
                .map(service -> {
                    // Re-check health dynamically
                    boolean isHealthy = service.checkHealth();
                    AgentCard card = service.getAgentCard();
                    return new A2AAgent(
                            service.getServiceName(),
                            card != null ? card.name() : "Unknown",
                            card != null ? card.description() : "",
                            card != null ? card.version() : "",
                            service.getAgentCardUri(),
                            isHealthy,
                            service.getErrorMessage(),
                            card != null ? card.capabilities() : null
                    );
                })
                .collect(Collectors.toList());
    }

    public record Metrics(
            String conversationId,
            String chatModel,
            String embeddingModel,
            String vectorStoreName,
            McpServer[] mcpServers,
            List<A2AAgent> a2aAgents,
            String memoryType
    ) {}

    public record A2AAgent(
            String serviceName,
            String agentName,
            String description,
            String version,
            String agentCardUri,
            boolean healthy,
            String errorMessage,
            AgentCard.AgentCapabilities capabilities
    ) {}
}
package org.tanzu.mcpclient.chat;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.vectorstore.VectorStoreChatMemoryAdvisor;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.tanzu.mcpclient.mcp.McpClientFactory;
import org.tanzu.mcpclient.mcp.McpDiscoveryService;
import org.tanzu.mcpclient.memory.MemoryConfiguration;
import org.tanzu.mcpclient.memory.MemoryPreferenceService;
import org.tanzu.mcpclient.model.ModelDiscoveryService;

import java.util.List;
import java.util.Map;

@Configuration
public class ChatConfiguration {

    private static final Logger logger = LoggerFactory.getLogger(ChatConfiguration.class);

    private final String chatModel;
    private final List<String> agentServices;
    private final McpClientFactory mcpClientFactory;
    private final McpDiscoveryService mcpDiscoveryService;

    public ChatConfiguration(ModelDiscoveryService modelDiscoveryService, McpDiscoveryService mcpDiscoveryService,
                             ApplicationEventPublisher eventPublisher, McpClientFactory mcpClientFactory) {
        this.chatModel = modelDiscoveryService.getChatModelName();
        this.agentServices = mcpDiscoveryService.getMcpServiceNames();
        this.mcpClientFactory = mcpClientFactory;
        this.mcpDiscoveryService = mcpDiscoveryService;
    }

    @Bean
    public ChatService chatService(ChatClient.Builder chatClientBuilder,
                                   MessageChatMemoryAdvisor transientMemoryAdvisor,
                                   VectorStoreChatMemoryAdvisor persistentMemoryAdvisor,
                                   MemoryPreferenceService memoryPreferenceService,
                                   MemoryConfiguration memoryConfiguration,
                                   VectorStore vectorStore,
                                   ModelDiscoveryService modelDiscoveryService,
                                   McpDiscoveryService mcpDiscoveryService,
                                   McpClientFactory mcpClientFactory) {

        return new ChatService(
                chatClientBuilder,
                transientMemoryAdvisor,
                persistentMemoryAdvisor,
                memoryPreferenceService,
                memoryConfiguration,
                vectorStore,
                modelDiscoveryService,
                mcpDiscoveryService,
                mcpClientFactory
        );
    }

    public String getChatModel() {
        return chatModel;
    }

    public List<String> getAgentServices() {
        return List.copyOf(agentServices);
    }
}
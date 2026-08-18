package org.tanzu.mcpclient.scratch;

import org.tanzu.mcpclient.mcp.McpDiscoveryService;
import java.util.List;

public class TestDiscovery {
    public static void main(String[] args) {
        System.out.println("VCAP_SERVICES: " + System.getenv("VCAP_SERVICES"));
        McpDiscoveryService discovery = new McpDiscoveryService(null); // Spring dependency
        List<McpDiscoveryService.McpServiceConfiguration> configs = discovery.getMcpServicesWithProtocol();
        System.out.println("EXTRACTED CONFIGS: " + configs.size());
        for (McpDiscoveryService.McpServiceConfiguration c : configs) {
            System.out.println("Config: " + c.serviceName() + " URL: " + c.serverUrl() + " Protocol: " + c.protocol().displayName());
        }
    }
}

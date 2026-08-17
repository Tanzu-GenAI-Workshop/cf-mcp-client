import { Component, Input, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { SidenavService } from '../../services/sidenav.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { PlatformMetrics } from '../app.component';

@Component({
  selector: 'app-bottom-navigation',
  standalone: true,
  imports: [NgClass, MatIcon],
  templateUrl: './bottom-navigation.html',
  styleUrl: './bottom-navigation.css'
})
export class BottomNavigationComponent {
  @Input() metrics: PlatformMetrics = {
    conversationId: '',
    chatModel: '',
    embeddingModel: '',
    vectorStoreName: '',
    mcpServers: [],
    a2aAgents: [],
    memoryType: 'TRANSIENT'
  };

  private readonly authService = inject(AuthService);

  constructor(private sidenavService: SidenavService) {}

  // Bottom navigation items (same as navigation rail for consistency)
  /** Which panel is open; null means the default Chat view. */
  readonly activePanel = toSignal(inject(SidenavService).activePanel$, { initialValue: null });

  navigationItems = [
    {
      id: 'chat',
      icon: 'fp-chat',
      label: 'Chat',
      tooltip: 'Chat Model Status'
    },
    {
      id: 'document',
      icon: 'fp-docs',
      label: 'Docs',
      tooltip: 'Document Management'
    },
    {
      id: 'mcp-servers',
      icon: 'fp-mcp',
      label: 'MCP',
      tooltip: 'MCP Server Connections'
    },
    {
      id: 'agents',
      icon: 'fp-agents',
      label: 'Agents',
      tooltip: 'A2A Agent Connections'
    },
    {
      id: 'memory',
      icon: 'fp-memory',
      label: 'Memory',
      tooltip: 'Conversation Memory'
    }
  ];

  onNavItemClick(itemId: string): void {
    this.sidenavService.toggle(itemId);
  }

  // Helper method to get status indicator for each nav item
  getStatusIndicator(itemId: string): { show: boolean; color: string; icon: string } {
    switch (itemId) {
      case 'chat':
        return {
          show: true,
          color: this.metrics.chatModel ? 'status-green' : 'status-red',
          icon: this.metrics.chatModel ? 'fp-ready' : 'fp-offline'
        };
      case 'document':
        return {
          show: true,
          color: this.metrics.embeddingModel ? 'status-green' : 'status-red',
          icon: this.metrics.embeddingModel ? 'fp-ready' : 'fp-offline'
        };
      case 'agents':
        const healthyAgents = this.metrics.a2aAgents.filter(agent => agent.healthy).length;
        return {
          show: this.metrics.a2aAgents.length > 0,
          color: this.metrics.a2aAgents.length === 0 ? 'status-red' :
                 healthyAgents === this.metrics.a2aAgents.length ? 'status-green' :
                 healthyAgents > 0 ? 'status-orange' : 'status-red',
          icon: this.metrics.a2aAgents.length === 0 ? 'fp-offline' :
                healthyAgents === this.metrics.a2aAgents.length ? 'fp-ready' :
                healthyAgents > 0 ? 'fp-attention' : 'fp-offline'
        };
      case 'mcp-servers':
        const healthyServers = this.metrics.mcpServers.filter(server => server.healthy).length;
        return {
          show: this.metrics.mcpServers.length > 0,
          color: healthyServers === this.metrics.mcpServers.length ? 'status-green' :
                 healthyServers > 0 ? 'status-orange' : 'status-red',
          icon: healthyServers === this.metrics.mcpServers.length ? 'fp-ready' :
                healthyServers > 0 ? 'fp-attention' : 'fp-offline'
        };
      case 'memory':
        return {
          show: true,
          color: this.metrics.conversationId ? 'status-green' : 'status-red',
          icon: this.metrics.conversationId ? 'fp-ready' : 'fp-offline'
        };
      default:
        return { show: false, color: '', icon: '' };
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
}

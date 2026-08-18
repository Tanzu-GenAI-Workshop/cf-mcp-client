import { Component, Input, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { SidenavService } from '../../services/sidenav.service';
import { AuthService } from '../../services/auth.service';
import { PlatformMetrics } from '../app.component';

import { StatusChangeService } from '../../services/status-change.service';

@Component({
  selector: 'app-navigation-rail',
  standalone: true,
  imports: [NgClass, MatIcon, MatTooltip],
  templateUrl: './navigation-rail.component.html',
  styleUrl: './navigation-rail.component.css'
})
export class NavigationRailComponent {
  private readonly statusChanges = inject(StatusChangeService);

  /** True while this destination's status counts as recently changed. */
  statusChanged(key: string): boolean {
    return this.statusChanges.isChanged(key);
  }

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

  /** Which panel is open, so the rail can show the current destination. */
  readonly activePanel = toSignal(inject(SidenavService).activePanel$, { initialValue: null });

  constructor(private sidenavService: SidenavService) {}

  // Navigation rail items with proper Material Design structure
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

  // Helper method to get tooltip text (empty when panel is open)
  getTooltipText(item: any): string {
    return this.sidenavService.getActivePanel() ? '' : item.tooltip;
  }

  // Helper method to get status indicator for each nav item
  getStatusIndicator(itemId: string): { show: boolean; color: string; icon: string } {
    switch (itemId) {
      case 'chat':
        return {
          show: true,
          color: this.metrics.chatModel ? 'status-green' : 'status-red',
          icon: this.metrics.chatModel ? 'fp-badge-ready' : 'fp-badge-offline'
        };
      case 'document':
        return {
          show: true,
          color: this.metrics.embeddingModel ? 'status-green' : 'status-red',
          icon: this.metrics.embeddingModel ? 'fp-badge-ready' : 'fp-badge-offline'
        };
      case 'agents':
        const healthyAgents = this.metrics.a2aAgents.filter(agent => agent.healthy).length;
        return {
          show: true,
          color: this.metrics.a2aAgents.length === 0 ? 'status-red' :
                 healthyAgents === this.metrics.a2aAgents.length ? 'status-green' :
                 healthyAgents > 0 ? 'status-orange' : 'status-red',
          icon: this.metrics.a2aAgents.length === 0 ? 'fp-badge-offline' :
                healthyAgents === this.metrics.a2aAgents.length ? 'fp-badge-ready' :
                healthyAgents > 0 ? 'fp-badge-attention' : 'fp-badge-offline'
        };
      case 'mcp-servers':
        const healthyServers = this.metrics.mcpServers.filter(server => server.healthy).length;
        return {
          show: true,
          color: this.metrics.mcpServers.length === 0 ? 'status-red' :
                 healthyServers === this.metrics.mcpServers.length ? 'status-green' :
                 healthyServers > 0 ? 'status-orange' : 'status-red',
          icon: this.metrics.mcpServers.length === 0 ? 'fp-badge-offline' :
                healthyServers === this.metrics.mcpServers.length ? 'fp-badge-ready' :
                healthyServers > 0 ? 'fp-badge-attention' : 'fp-badge-offline'
        };
      case 'memory':
        return {
          show: true,
          color: this.metrics.conversationId ? 'status-green' : 'status-red',
          icon: this.metrics.conversationId ? 'fp-badge-ready' : 'fp-badge-offline'
        };
      default:
        return { show: false, color: '', icon: '' };
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
}

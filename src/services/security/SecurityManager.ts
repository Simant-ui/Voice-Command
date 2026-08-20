import { RiskLevel, ToolCall, AuditLog } from '../../types';

export class SecurityManager {
  private auditLogs: AuditLog[] = [];

  // Risk evaluation logic
  evaluateRisk(toolCall: ToolCall): RiskLevel {
    const { name, args } = toolCall;

    // High risk actions (Deletion, shell execution, shutdown, administrative operations)
    if (
      name.includes('delete') ||
      name.includes('remove') ||
      name.includes('shutdown') ||
      name.includes('restart') ||
      name.includes('format') ||
      (args.command && /rm -rf|del \/f|format|netsh|powershell -enc/i.test(args.command))
    ) {
      return 'HIGH';
    }

    // Medium risk actions (Creation, renaming, moving, process termination)
    if (
      name === 'close_application' ||
      name === 'create_file' ||
      name === 'create_folder' ||
      name === 'rename_file' ||
      name === 'move_file'
    ) {
      return 'MEDIUM';
    }

    // Default safe read-only or application launching actions
    return 'LOW';
  }

  logAction(toolCall: ToolCall, status: 'executed' | 'blocked' | 'cancelled', details: string): void {
    const log: AuditLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: Date.now(),
      actionName: toolCall.name,
      category: this.getCategory(toolCall.name),
      riskLevel: toolCall.riskLevel,
      status,
      details,
    };
    this.auditLogs.unshift(log);

    // Save to localStorage audit log cache
    try {
      localStorage.setItem('nova_audit_logs', JSON.stringify(this.auditLogs.slice(0, 100)));
    } catch {
      // ignore storage errors
    }
  }

  getAuditLogs(): AuditLog[] {
    if (this.auditLogs.length === 0) {
      try {
        const stored = localStorage.getItem('nova_audit_logs');
        if (stored) this.auditLogs = JSON.parse(stored);
      } catch {
        this.auditLogs = [];
      }
    }
    return this.auditLogs;
  }

  private getCategory(toolName: string): 'app' | 'filesystem' | 'system' | 'web' | 'media' {
    if (toolName.includes('app')) return 'app';
    if (toolName.includes('file') || toolName.includes('folder')) return 'filesystem';
    if (toolName.includes('web') || toolName.includes('site')) return 'web';
    return 'system';
  }
}

export const securityManager = new SecurityManager();

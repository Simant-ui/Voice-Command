export class CommandSanitizer {
  // Sanitize path inputs to prevent directory traversal attacks
  static sanitizeFilePath(pathInput: string): string {
    if (!pathInput) return '';

    // Block relative path traversal attempts
    let sanitized = pathInput.replace(/(\.\.[\/\\])+/g, '');

    // Trim trailing control chars
    sanitized = sanitized.replace(/[\r\n\t]/g, '').trim();

    return sanitized;
  }

  // Validate file path security
  static isPathSafe(filePath: string): boolean {
    if (!filePath) return false;
    
    // Check for explicit traversal patterns
    if (filePath.includes('../') || filePath.includes('..\\')) {
      return false;
    }

    // Check for dangerous Windows system directory modifications
    const normalized = filePath.toLowerCase();
    if (
      normalized.includes('c:\\windows\\system32') ||
      normalized.includes('c:/windows/system32') ||
      normalized.includes('/etc/shadow') ||
      normalized.includes('/etc/passwd')
    ) {
      return false;
    }

    return true;
  }

  // Sanitize shell command arguments
  static sanitizeCommandArg(arg: string): string {
    if (!arg) return '';
    // Strip dangerous shell metacharacters: ;, |, &, `, $, >, <
    return arg.replace(/[;&`$><|]/g, '').trim();
  }
}

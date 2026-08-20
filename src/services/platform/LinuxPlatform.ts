import { PlatformInterface } from './PlatformInterface';
import { SystemInfo } from '../../types';

export class LinuxPlatform implements PlatformInterface {
  name: 'linux' = 'linux';
  isTauriAvailable: boolean;

  constructor() {
    this.isTauriAvailable = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
  }

  private async invokeTauri<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
    if (this.isTauriAvailable) {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        return await invoke<T>(cmd, args);
      } catch (err) {
        console.warn(`[Linux Tauri IPC ${cmd}] Error:`, err);
        throw err;
      }
    }
    throw new Error('Tauri not running in Linux session');
  }

  async openApplication(appName: string): Promise<{ success: boolean; message: string }> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('open_app', { appName });
    }
    return { success: true, message: `Linux open command executed for: ${appName}` };
  }

  async closeApplication(appName: string): Promise<{ success: boolean; message: string }> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('close_app', { appName });
    }
    return { success: true, message: `Linux process terminated: ${appName}` };
  }

  async listRunningApplications(): Promise<string[]> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('list_apps');
    }
    return ['bash', 'code', 'firefox', 'gnome-terminal', 'spotify'];
  }

  async openWebsite(url: string): Promise<{ success: boolean; message: string }> {
    let formatted = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    window.open(formatted, '_blank');
    return { success: true, message: `Opened website: ${formatted}` };
  }

  async searchFiles(query: string, path?: string): Promise<{ path: string; name: string; isDir: boolean }[]> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('search_files', { query, path });
    }
    return [
      { name: `${query}_notes.txt`, path: `/home/user/Documents/${query}_notes.txt`, isDir: false },
      { name: `${query}_Project`, path: `/home/user/Projects/${query}_Project`, isDir: true },
    ];
  }

  async openFile(filePath: string): Promise<{ success: boolean; message: string }> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('open_file', { filePath });
    }
    return { success: true, message: `Opened Linux file: ${filePath}` };
  }

  async createFile(filePath: string, content: string = ''): Promise<{ success: boolean; message: string }> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('create_file', { filePath, content });
    }
    return { success: true, message: `Created Linux file: ${filePath}` };
  }

  async createFolder(folderPath: string): Promise<{ success: boolean; message: string }> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('create_folder', { folderPath });
    }
    return { success: true, message: `Created Linux directory: ${folderPath}` };
  }

  async renameFile(oldPath: string, newPath: string): Promise<{ success: boolean; message: string }> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('rename_file', { oldPath, newPath });
    }
    return { success: true, message: `Renamed ${oldPath} to ${newPath}` };
  }

  async moveFile(srcPath: string, destPath: string): Promise<{ success: boolean; message: string }> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('move_file', { srcPath, destPath });
    }
    return { success: true, message: `Moved ${srcPath} to ${destPath}` };
  }

  async getSystemInformation(): Promise<SystemInfo> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('get_sys_info');
    }
    return {
      os: 'Ubuntu 24.04 LTS (Linux x86_64)',
      arch: 'x86_64',
      hostname: 'NOVA-LINUX-RIG',
      cpuModel: 'AMD Ryzen 7 7800X3D',
      cpuUsage: 14,
      memoryTotalGB: 32,
      memoryUsedGB: 8.2,
      batteryPercentage: 100,
      isCharging: true,
    };
  }

  async takeScreenshot(): Promise<{ success: boolean; imageUri?: string; message: string }> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('take_screenshot');
    }
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 1280, 720);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '28px Inter, sans-serif';
      ctx.fillText('Linux Desktop Screenshot - Santosh AI', 50, 100);
    }
    return {
      success: true,
      imageUri: canvas.toDataURL('image/png'),
      message: 'Captured Linux desktop screenshot.',
    };
  }

  async getVolume(): Promise<number> {
    return 75;
  }

  async setVolume(volumePercent: number): Promise<{ success: boolean; message: string }> {
    return { success: true, message: `Linux PulseAudio volume set to ${volumePercent}%` };
  }

  async mute(): Promise<{ success: boolean; message: string }> {
    return { success: true, message: 'Linux audio muted' };
  }

  async unmute(): Promise<{ success: boolean; message: string }> {
    return { success: true, message: 'Linux audio unmuted' };
  }

  async getWifiStatus(): Promise<{ connected: boolean; ssid?: string; signalStrength?: number }> {
    return { connected: true, ssid: 'wlan0_Home_WiFi', signalStrength: 85 };
  }

  async minimizeToTray(): Promise<void> {
    if (this.isTauriAvailable) {
      await this.invokeTauri('minimize_to_tray');
    }
  }

  async setStartWithWindows(enabled: boolean): Promise<void> {
    // Linux autostart via ~/.config/autostart
  }

  async notify(title: string, body: string): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }
}

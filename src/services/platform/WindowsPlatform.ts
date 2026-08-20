import { PlatformInterface } from './PlatformInterface';
import { SystemInfo } from '../../types';

export class WindowsPlatform implements PlatformInterface {
  name: 'windows' = 'windows';
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
        console.warn(`[Tauri IPC ${cmd}] Fallback or Error:`, err);
        throw err;
      }
    }
    throw new Error('Tauri not running in current session');
  }

  async openApplication(appName: string): Promise<{ success: boolean; message: string }> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('open_app', { appName });
    }
    // Windows start fallback
    window.open(`https://www.google.com/search?q=${encodeURIComponent(appName)}`, '_blank');
    return { success: true, message: `Opened ${appName} in web browser.` };
  }

  async closeApplication(appName: string): Promise<{ success: boolean; message: string }> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('close_app', { appName });
    }
    return { success: true, message: `Simulated termination of process ${appName}` };
  }

  async listRunningApplications(): Promise<string[]> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('list_apps');
    }
    return ['chrome.exe', 'code.exe', 'explorer.exe', 'spotify.exe', 'cmd.exe'];
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
      { name: `${query}_notes.txt`, path: `C:\\Users\\User\\Documents\\${query}_notes.txt`, isDir: false },
      { name: `${query}_Project`, path: `C:\\Users\\User\\Desktop\\${query}_Project`, isDir: true },
      { name: `Assignment_${query}.pdf`, path: `C:\\Users\\User\\Downloads\\Assignment_${query}.pdf`, isDir: false }
    ];
  }

  async openFile(filePath: string): Promise<{ success: boolean; message: string }> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('open_file', { filePath });
    }
    return { success: true, message: `Opened file at ${filePath}` };
  }

  async createFile(filePath: string, content: string = ''): Promise<{ success: boolean; message: string }> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('create_file', { filePath, content });
    }
    return { success: true, message: `Created file: ${filePath}` };
  }

  async createFolder(folderPath: string): Promise<{ success: boolean; message: string }> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('create_folder', { folderPath });
    }
    return { success: true, message: `Created directory: ${folderPath}` };
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
      os: 'Windows 11 Pro 64-bit',
      arch: 'x86_64',
      hostname: 'NOVA-DESKTOP-WIN',
      cpuModel: 'Intel Core i7-13700K @ 3.40GHz',
      cpuUsage: Math.floor(Math.random() * 25 + 10),
      memoryTotalGB: 32,
      memoryUsedGB: 12.4,
      batteryPercentage: 94,
      isCharging: true,
    };
  }

  async takeScreenshot(): Promise<{ success: boolean; imageUri?: string; message: string }> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('take_screenshot');
    }
    // Canvas mock screenshot
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 1280, 720);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#0284c7');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1280, 720);
      ctx.fillStyle = '#ffffff';
      ctx.font = '32px Inter, sans-serif';
      ctx.fillText('Santosh AI Screenshot - ' + new Date().toLocaleString(), 50, 100);
    }
    return {
      success: true,
      imageUri: canvas.toDataURL('image/png'),
      message: 'Captured desktop screenshot successfully.'
    };
  }

  async getVolume(): Promise<number> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('get_volume');
    }
    return 65;
  }

  async setVolume(volumePercent: number): Promise<{ success: boolean; message: string }> {
    const clamped = Math.max(0, Math.min(100, volumePercent));
    if (this.isTauriAvailable) {
      return await this.invokeTauri('set_volume', { volume: clamped });
    }
    return { success: true, message: `Volume set to ${clamped}%` };
  }

  async mute(): Promise<{ success: boolean; message: string }> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('mute');
    }
    return { success: true, message: 'System audio muted' };
  }

  async unmute(): Promise<{ success: boolean; message: string }> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('unmute');
    }
    return { success: true, message: 'System audio unmuted' };
  }

  async getWifiStatus(): Promise<{ connected: boolean; ssid?: string; signalStrength?: number }> {
    if (this.isTauriAvailable) {
      return await this.invokeTauri('get_wifi_status');
    }
    return { connected: true, ssid: 'Nepal_FiberNet_5G', signalStrength: 88 };
  }

  async minimizeToTray(): Promise<void> {
    if (this.isTauriAvailable) {
      await this.invokeTauri('minimize_to_tray');
    } else {
      console.log('Minimized Nova AI to system tray.');
    }
  }

  async setStartWithWindows(enabled: boolean): Promise<void> {
    if (this.isTauriAvailable) {
      await this.invokeTauri('set_autostart', { enabled });
    } else {
      localStorage.setItem('nova_autostart', enabled ? 'true' : 'false');
    }
  }

  async notify(title: string, body: string): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/vite.svg' });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        new Notification(title, { body, icon: '/vite.svg' });
      }
    }
  }
}

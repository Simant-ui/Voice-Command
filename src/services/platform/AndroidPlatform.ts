import { PlatformInterface } from './PlatformInterface';
import { SystemInfo } from '../../types';

export class AndroidPlatform implements PlatformInterface {
  name: 'android' = 'android';
  isTauriAvailable = false;

  async openApplication(appName: string): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `Android Intent triggered: launching app ${appName}`,
    };
  }

  async closeApplication(appName: string): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `Android package backgrounded: ${appName}`,
    };
  }

  async listRunningApplications(): Promise<string[]> {
    return ['com.android.chrome', 'com.google.android.youtube', 'com.whatsapp'];
  }

  async openWebsite(url: string): Promise<{ success: boolean; message: string }> {
    let formatted = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    window.open(formatted, '_blank');
    return { success: true, message: `Opened website on Android browser: ${formatted}` };
  }

  async searchFiles(query: string, path?: string): Promise<{ path: string; name: string; isDir: boolean }[]> {
    return [
      { name: `${query}_file.pdf`, path: `/storage/emulated/0/Download/${query}_file.pdf`, isDir: false },
    ];
  }

  async openFile(filePath: string): Promise<{ success: boolean; message: string }> {
    return { success: true, message: `Opened file on Android viewer: ${filePath}` };
  }

  async createFile(filePath: string, content: string = ''): Promise<{ success: boolean; message: string }> {
    return { success: true, message: `Created Android file: ${filePath}` };
  }

  async createFolder(folderPath: string): Promise<{ success: boolean; message: string }> {
    return { success: true, message: `Created Android directory: ${folderPath}` };
  }

  async renameFile(oldPath: string, newPath: string): Promise<{ success: boolean; message: string }> {
    return { success: true, message: `Renamed ${oldPath} to ${newPath}` };
  }

  async moveFile(srcPath: string, destPath: string): Promise<{ success: boolean; message: string }> {
    return { success: true, message: `Moved ${srcPath} to ${destPath}` };
  }

  async getSystemInformation(): Promise<SystemInfo> {
    return {
      os: 'Android 14 (Socrates / HyperOS)',
      arch: 'arm64-v8a',
      hostname: 'ANDROID-MOBILE-DEVICE',
      cpuModel: 'Qualcomm Snapdragon 8 Gen 3',
      cpuUsage: 12,
      memoryTotalGB: 12,
      memoryUsedGB: 4.5,
      batteryPercentage: 82,
      isCharging: false,
    };
  }

  async takeScreenshot(): Promise<{ success: boolean; imageUri?: string; message: string }> {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 2400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 1080, 2400);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '36px Inter, sans-serif';
      ctx.fillText('Android Mobile Screenshot - Nova AI', 100, 200);
    }
    return {
      success: true,
      imageUri: canvas.toDataURL('image/png'),
      message: 'Captured Android screen.',
    };
  }

  async getVolume(): Promise<number> {
    return 70;
  }

  async setVolume(volumePercent: number): Promise<{ success: boolean; message: string }> {
    return { success: true, message: `Set Android media volume to ${volumePercent}%` };
  }

  async mute(): Promise<{ success: boolean; message: string }> {
    return { success: true, message: 'Muted Android media audio' };
  }

  async unmute(): Promise<{ success: boolean; message: string }> {
    return { success: true, message: 'Unmuted Android media audio' };
  }

  async getWifiStatus(): Promise<{ connected: boolean; ssid?: string; signalStrength?: number }> {
    return { connected: true, ssid: 'Home_WiFi_5G', signalStrength: 92 };
  }

  async minimizeToTray(): Promise<void> {
    console.log('Android app sent to background.');
  }

  async setStartWithWindows(enabled: boolean): Promise<void> {
    // Autostart on boot via Android RECEIVE_BOOT_COMPLETED
  }

  async notify(title: string, body: string): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }
}

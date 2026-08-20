import { platform } from './index';

export interface ComprehensiveDeviceContext {
  osName: string;
  isMobile: boolean;
  cpuUsage: number;
  cpuModel: string;
  ramUsedGB: number;
  ramTotalGB: number;
  batteryPercentage: number;
  isCharging: boolean;
  wifiSSID: string;
  wifiConnected: boolean;
  volumeLevel: number;
}

export class DeviceManager {
  async getLiveDeviceContext(): Promise<ComprehensiveDeviceContext> {
    const sysInfo = await platform.getSystemInformation();
    const wifi = await platform.getWifiStatus();
    const volume = await platform.getVolume();

    return {
      osName: sysInfo.os,
      isMobile: platform.name === 'android',
      cpuUsage: sysInfo.cpuUsage,
      cpuModel: sysInfo.cpuModel,
      ramUsedGB: sysInfo.memoryUsedGB,
      ramTotalGB: sysInfo.memoryTotalGB,
      batteryPercentage: sysInfo.batteryPercentage ?? 100,
      isCharging: sysInfo.isCharging ?? true,
      wifiSSID: wifi.ssid || 'Not Connected',
      wifiConnected: wifi.connected,
      volumeLevel: volume,
    };
  }

  formatContextPrompt(ctx: ComprehensiveDeviceContext): string {
    return `[CURRENT DEVICE CONTEXT]
OS: ${ctx.osName} (${ctx.isMobile ? 'Mobile' : 'Desktop'})
CPU: ${ctx.cpuModel} (${ctx.cpuUsage}% active)
RAM: ${ctx.ramUsedGB} GB used of ${ctx.ramTotalGB} GB total
Battery: ${ctx.batteryPercentage}% ${ctx.isCharging ? '(Plugged In)' : '(On Battery)'}
Wi-Fi: ${ctx.wifiSSID} (${ctx.wifiConnected ? 'Connected' : 'Disconnected'})
Volume Level: ${ctx.volumeLevel}%`;
  }
}

export const deviceManager = new DeviceManager();

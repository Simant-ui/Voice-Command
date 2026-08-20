import { SystemInfo } from '../../types';

export interface PlatformInterface {
  name: 'windows' | 'linux' | 'android' | 'web';
  isTauriAvailable: boolean;

  // Applications
  openApplication(appName: string): Promise<{ success: boolean; message: string }>;
  closeApplication(appName: string): Promise<{ success: boolean; message: string }>;
  listRunningApplications(): Promise<string[]>;

  // Websites & Web
  openWebsite(url: string): Promise<{ success: boolean; message: string }>;

  // Filesystem
  searchFiles(query: string, path?: string): Promise<{ path: string; name: string; isDir: boolean }[]>;
  openFile(filePath: string): Promise<{ success: boolean; message: string }>;
  createFile(filePath: string, content?: string): Promise<{ success: boolean; message: string }>;
  createFolder(folderPath: string): Promise<{ success: boolean; message: string }>;
  renameFile(oldPath: string, newPath: string): Promise<{ success: boolean; message: string }>;
  moveFile(srcPath: string, destPath: string): Promise<{ success: boolean; message: string }>;

  // System & Diagnostics
  getSystemInformation(): Promise<SystemInfo>;
  takeScreenshot(): Promise<{ success: boolean; imageUri?: string; message: string }>;

  // Audio Controls
  getVolume(): Promise<number>;
  setVolume(volumePercent: number): Promise<{ success: boolean; message: string }>;
  mute(): Promise<{ success: boolean; message: string }>;
  unmute(): Promise<{ success: boolean; message: string }>;

  // Network Controls
  getWifiStatus(): Promise<{ connected: boolean; ssid?: string; signalStrength?: number }>;

  // App & Tray controls
  minimizeToTray(): Promise<void>;
  setStartWithWindows(enabled: boolean): Promise<void>;
  notify(title: string, body: string): Promise<void>;
}

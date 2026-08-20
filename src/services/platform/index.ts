import { PlatformInterface } from './PlatformInterface';
import { WindowsPlatform } from './WindowsPlatform';
import { LinuxPlatform } from './LinuxPlatform';
import { AndroidPlatform } from './AndroidPlatform';

function detectPlatform(): PlatformInterface {
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('android')) {
      return new AndroidPlatform();
    }
    if (ua.includes('linux')) {
      return new LinuxPlatform();
    }
  }
  return new WindowsPlatform();
}

export const platform: PlatformInterface = detectPlatform();
export * from './PlatformInterface';
export * from './WindowsPlatform';
export * from './LinuxPlatform';
export * from './AndroidPlatform';

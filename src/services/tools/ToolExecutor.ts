import { SYSTEM_TOOLS } from './definitions';
import { platform } from '../platform';
import { ToolCall, RiskLevel } from '../../types';

export class ToolExecutor {
  getToolRiskLevel(toolName: string): RiskLevel {
    const tool = SYSTEM_TOOLS.find((t) => t.name === toolName);
    return tool ? tool.riskLevel : 'MEDIUM';
  }

  async execute(toolCall: ToolCall): Promise<{ success: boolean; output: any; message: string }> {
    const { name, args } = toolCall;

    try {
      switch (name) {
        case 'open_application': {
          const app = args.application || args.app || 'chrome';
          const res = await platform.openApplication(app);
          return { success: res.success, output: res, message: res.message };
        }

        case 'close_application': {
          const app = args.application || args.app;
          const res = await platform.closeApplication(app);
          return { success: res.success, output: res, message: res.message };
        }

        case 'list_running_applications': {
          const apps = await platform.listRunningApplications();
          return {
            success: true,
            output: apps,
            message: `Found ${apps.length} active process(es): ${apps.slice(0, 5).join(', ')}`,
          };
        }

        case 'open_website': {
          const url = args.url || 'https://google.com';
          const res = await platform.openWebsite(url);
          return { success: res.success, output: res, message: res.message };
        }

        case 'search_web': {
          const query = args.query || '';
          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
          const res = await platform.openWebsite(searchUrl);
          return { success: res.success, output: res, message: `Searched web for "${query}"` };
        }

        case 'search_files': {
          const query = args.query || '';
          const path = args.path;
          const files = await platform.searchFiles(query, path);
          return {
            success: true,
            output: files,
            message: `Found ${files.length} matching file(s) for "${query}".`,
          };
        }

        case 'open_file': {
          const filePath = args.filePath || args.path;
          const res = await platform.openFile(filePath);
          return { success: res.success, output: res, message: res.message };
        }

        case 'create_file': {
          const filePath = args.filePath;
          const content = args.content || '';
          const res = await platform.createFile(filePath, content);
          return { success: res.success, output: res, message: res.message };
        }

        case 'create_folder': {
          const folderPath = args.folderPath || args.path;
          const res = await platform.createFolder(folderPath);
          return { success: res.success, output: res, message: res.message };
        }

        case 'rename_file': {
          const res = await platform.renameFile(args.oldPath, args.newPath);
          return { success: res.success, output: res, message: res.message };
        }

        case 'move_file': {
          const res = await platform.moveFile(args.srcPath, args.destPath);
          return { success: res.success, output: res, message: res.message };
        }

        case 'get_system_information': {
          const info = await platform.getSystemInformation();
          return {
            success: true,
            output: info,
            message: `System Diagnostics: OS ${info.os}, CPU ${info.cpuUsage}%, RAM ${info.memoryUsedGB}GB / ${info.memoryTotalGB}GB, Battery ${info.batteryPercentage}%`,
          };
        }

        case 'take_screenshot': {
          const res = await platform.takeScreenshot();
          return {
            success: res.success,
            output: res,
            message: res.message,
          };
        }

        case 'get_volume': {
          const vol = await platform.getVolume();
          return {
            success: true,
            output: { volume: vol },
            message: `Current volume level is ${vol}%.`,
          };
        }

        case 'set_volume': {
          const targetVol = args.volume ?? 50;
          const res = await platform.setVolume(targetVol);
          return {
            success: res.success,
            output: res,
            message: res.message,
          };
        }

        case 'mute': {
          const res = await platform.mute();
          return {
            success: res.success,
            output: res,
            message: res.message,
          };
        }

        case 'unmute': {
          const res = await platform.unmute();
          return {
            success: res.success,
            output: res,
            message: res.message,
          };
        }

        case 'get_wifi_status': {
          const status = await platform.getWifiStatus();
          return {
            success: true,
            output: status,
            message: status.connected
              ? `Wi-Fi Connected to "${status.ssid}" (${status.signalStrength}% signal strength)`
              : 'Wi-Fi Disconnected',
          };
        }

        default:
          return {
            success: false,
            output: null,
            message: `Unknown or unsupported tool requested: "${name}"`,
          };
      }
    } catch (err: any) {
      return {
        success: false,
        output: null,
        message: `Tool execution failed: ${err.message || String(err)}`,
      };
    }
  }
}

export const toolExecutor = new ToolExecutor();

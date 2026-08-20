import { ToolCall } from '../../types';

export interface PlannedStep {
  toolName: string;
  args: Record<string, any>;
  description: string;
}

export class AgentPlanner {
  private lastActiveContextApp: string = 'chrome';

  public setLastActiveApp(appName: string) {
    this.lastActiveContextApp = appName;
  }

  public getLastActiveApp(): string {
    return this.lastActiveContextApp;
  }

  // Universal intent planner: handles compound tasks, single commands, and anaphoric references ("त्यसमा", "it")
  public planTask(userPrompt: string): PlannedStep[] {
    const rawText = userPrompt.trim();
    const text = rawText.toLowerCase();
    const steps: PlannedStep[] = [];

    const isNepali = /[\u0900-\u097F]/.test(rawText);

    // Context reference resolution ("त्यसमा", "in that", "on it")
    const isAnaphora = text.includes('त्यसमा') || text.includes('त्यसमाथि') || text.includes('in that') || text.includes('on it');
    const targetApp = isAnaphora ? this.lastActiveContextApp : 'chrome';

    // 1. COMPOUND MULTI-STEP COMMANDS ("Chrome खोल अनि YouTube मा Python tutorial search गर")
    if (
      (text.includes('chrome') || text.includes('browser') || text.includes('ब्राउजर')) &&
      text.includes('youtube') &&
      (text.includes('search') || text.includes('खोज') || text.includes('हेर्नु'))
    ) {
      this.lastActiveContextApp = 'chrome';
      steps.push({
        toolName: 'open_application',
        args: { application: 'chrome' },
        description: isNepali ? 'Chrome ब्राउजर खोल्दैछ' : 'Opening Chrome browser',
      });
      steps.push({
        toolName: 'open_website',
        args: { url: 'https://youtube.com' },
        description: isNepali ? 'YouTube मा जाँदैछ' : 'Navigating to YouTube',
      });

      const queryMatch = rawText.match(/youtube\s*(?:मा|in)?\s*(.*?)\s*(?:search|खोज|tutorial)/i);
      const query = queryMatch?.[1]?.trim() || 'Python tutorial';

      steps.push({
        toolName: 'search_web',
        args: { query: `${query} tutorial` },
        description: isNepali ? `YouTube मा ${query} खोज्दैछ` : `Searching YouTube for ${query}`,
      });
      return steps;
    }

    // 2. AUDIO VOLUME & MUTE INTENTS ("Volume 50% मा राख", "Volume set to 70", "Mute audio", "भोल्युम म्युट गर")
    if (text.includes('volume') || text.includes('भोल्युम') || text.includes('sound') || text.includes('आवाज') || text.includes('mute') || text.includes('म्युट')) {
      const numberMatch = text.match(/\d+/);
      const volNum = numberMatch ? parseInt(numberMatch[0], 10) : 50;

      if (text.includes('mute') || text.includes('म्युट') || text.includes('बन्द')) {
        steps.push({
          toolName: 'mute',
          args: {},
          description: isNepali ? 'भोल्युम म्युट गर्दैछ' : 'Muting system audio',
        });
      } else if (text.includes('unmute') || text.includes('अनम्युट')) {
        steps.push({
          toolName: 'unmute',
          args: {},
          description: isNepali ? 'भोल्युम अनम्युट गर्दैछ' : 'Unmuting system audio',
        });
      } else {
        steps.push({
          toolName: 'set_volume',
          args: { volume: volNum },
          description: isNepali ? `भोल्युम ${volNum}% मा मिलाउँदैछ` : `Setting system volume to ${volNum}%`,
        });
      }
      return steps;
    }

    // 3. SCREENSHOT INTENT ("Screenshot ले", "Take screenshot", "स्क्रीनशट खिच")
    if (
      text.includes('screenshot') ||
      text.includes('screen shot') ||
      text.includes('स्क्रीनशट') ||
      text.includes('स्क्रीन शट') ||
      text.includes('फोटो खिच') ||
      text.includes('स्न्याप')
    ) {
      steps.push({
        toolName: 'take_screenshot',
        args: {},
        description: isNepali ? 'स्क्रीनशट लिँदैछ' : 'Capturing screen screenshot',
      });
      return steps;
    }

    // 4. SYSTEM INFORMATION & BATTERY INTENT ("मेरो battery कति छ?", "CPU usage", "System info")
    if (
      text.includes('battery') ||
      text.includes('ब्याट्री') ||
      text.includes('cpu') ||
      text.includes('ram') ||
      text.includes('system info') ||
      text.includes('सिस्टम') ||
      (text.includes('laptop') && text.includes('कति छ'))
    ) {
      steps.push({
        toolName: 'get_system_information',
        args: {},
        description: isNepali ? 'Laptop को ब्याट्री र सिस्टम जानकारी लिँदैछ' : 'Getting device battery and system info',
      });
      return steps;
    }

    // 5. APPLICATION OPENING INTENTS (Chrome, VS Code, Notepad, Calculator, Downloads, etc.)
    const isLaunchVerb =
      text.includes('open') ||
      text.includes('launch') ||
      text.includes('start') ||
      text.includes('खोल') ||
      text.includes('खोल्नु') ||
      text.includes('खोलिदेऊ') ||
      text.includes('खोलिदेउ') ||
      text.includes('खोल न') ||
      text.includes('ओपन');

    if (isLaunchVerb || text.includes('chrome') || text.includes('vscode') || text.includes('notepad') || text.includes('calculator') || text.includes('youtube')) {
      let appToLaunch = '';

      if (text.includes('chrome') || text.includes('browser') || text.includes('ब्राउजर')) {
        appToLaunch = 'chrome';
      } else if (text.includes('code') || text.includes('vscode') || text.includes('vs code')) {
        appToLaunch = 'code';
      } else if (text.includes('notepad') || text.includes('नोटप्याड')) {
        appToLaunch = 'notepad';
      } else if (text.includes('calculator') || text.includes('calc') || text.includes('क्याल्कुलेटर')) {
        appToLaunch = 'calc';
      } else if (text.includes('download') || text.includes('डाउनलोड')) {
        appToLaunch = 'explorer';
      } else if (text.includes('cmd') || text.includes('terminal') || text.includes('powershell')) {
        appToLaunch = 'cmd';
      }

      if (appToLaunch) {
        this.lastActiveContextApp = appToLaunch;
        steps.push({
          toolName: 'open_application',
          args: { application: appToLaunch },
          description: isNepali ? `${appToLaunch} खोल्दैछ` : `Opening ${appToLaunch}`,
        });
        return steps;
      }
    }

    // 6. WEBSITES & SOCIAL MEDIA INTENTS (YouTube, Google, Facebook, ChatGPT, Github)
    if (text.includes('youtube') || text.includes('google') || text.includes('facebook') || text.includes('chatgpt') || text.includes('github') || text.includes('instagram')) {
      let targetUrl = 'https://google.com';
      if (text.includes('youtube')) targetUrl = 'https://youtube.com';
      if (text.includes('facebook')) targetUrl = 'https://facebook.com';
      if (text.includes('chatgpt')) targetUrl = 'https://chatgpt.com';
      if (text.includes('github')) targetUrl = 'https://github.com';
      if (text.includes('instagram')) targetUrl = 'https://instagram.com';

      steps.push({
        toolName: 'open_website',
        args: { url: targetUrl },
        description: isNepali ? `${targetUrl} खोल्दैछ` : `Navigating to ${targetUrl}`,
      });
      return steps;
    }

    // 7. WEB SEARCH INTENT ("Google मा React tutorial खोज")
    if (text.includes('search') || text.includes('google') || text.includes('खोज')) {
      const query = rawText.replace(/(google|youtube|search|खोज|मा|अलि|अनि|गर)/gi, '').trim() || 'React tutorials';
      steps.push({
        toolName: 'search_web',
        args: { query },
        description: isNepali ? `Web मा ${query} खोज्दैछ` : `Searching web for ${query}`,
      });
      return steps;
    }

    // 8. FILE SEARCH INTENT ("Downloads मा assignment खोज")
    if (text.includes('file') || text.includes('pdf') || text.includes('assignment') || text.includes('फाइल')) {
      const query = rawText.replace(/(file|pdf|assignment|find|search|खोज|फाइल)/gi, '').trim() || 'assignment';
      steps.push({
        toolName: 'search_files',
        args: { query },
        description: isNepali ? `${query} फाइल खोज्दैछ` : `Searching for file ${query}`,
      });
      return steps;
    }

    return steps;
  }
}

export const agentPlanner = new AgentPlanner();

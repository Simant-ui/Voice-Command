import { ToolDefinition } from '../../types';

export const SYSTEM_TOOLS: ToolDefinition[] = [
  // Applications
  {
    name: 'open_application',
    description: 'Launches a desktop or mobile application on the current device (e.g. chrome, vscode, notepad, calculator, spotify).',
    riskLevel: 'LOW',
    parameters: {
      type: 'object',
      properties: {
        application: {
          type: 'string',
          description: 'The executable or common name of the application to launch.',
        },
      },
      required: ['application'],
    },
  },
  {
    name: 'close_application',
    description: 'Closes a running application or process on the current device.',
    riskLevel: 'MEDIUM',
    parameters: {
      type: 'object',
      properties: {
        application: {
          type: 'string',
          description: 'The process or application name to terminate.',
        },
      },
      required: ['application'],
    },
  },
  {
    name: 'list_running_applications',
    description: 'Returns a list of currently active applications and processes on the current device.',
    riskLevel: 'LOW',
    parameters: {
      type: 'object',
      properties: {},
    },
  },

  // Websites
  {
    name: 'open_website',
    description: 'Opens a specified website URL in the default web browser.',
    riskLevel: 'LOW',
    parameters: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The complete web URL or domain name to open.',
        },
      },
      required: ['url'],
    },
  },
  {
    name: 'search_web',
    description: 'Performs a Google web search for a user query.',
    riskLevel: 'LOW',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search keywords or question.',
        },
      },
      required: ['query'],
    },
  },

  // Filesystem
  {
    name: 'search_files',
    description: 'Searches for files or directories matching a given file name or extension on the current device.',
    riskLevel: 'LOW',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Name, part of name, or extension to search for.',
        },
        path: {
          type: 'string',
          description: 'Optional starting directory path.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'open_file',
    description: 'Opens a document or file using its associated application.',
    riskLevel: 'LOW',
    parameters: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Absolute or relative file path to open.',
        },
      },
      required: ['filePath'],
    },
  },
  {
    name: 'create_file',
    description: 'Creates a new file at the specified location with optional content.',
    riskLevel: 'MEDIUM',
    parameters: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Target file path.',
        },
        content: {
          type: 'string',
          description: 'Text content to write into the file.',
        },
      },
      required: ['filePath'],
    },
  },
  {
    name: 'create_folder',
    description: 'Creates a new directory folder.',
    riskLevel: 'MEDIUM',
    parameters: {
      type: 'object',
      properties: {
        folderPath: {
          type: 'string',
          description: 'Full path of the new folder to create.',
        },
      },
      required: ['folderPath'],
    },
  },
  {
    name: 'rename_file',
    description: 'Renames an existing file or directory.',
    riskLevel: 'MEDIUM',
    parameters: {
      type: 'object',
      properties: {
        oldPath: { type: 'string', description: 'Existing file path' },
        newPath: { type: 'string', description: 'New target path' },
      },
      required: ['oldPath', 'newPath'],
    },
  },
  {
    name: 'move_file',
    description: 'Moves a file or directory to a new folder destination.',
    riskLevel: 'MEDIUM',
    parameters: {
      type: 'object',
      properties: {
        srcPath: { type: 'string', description: 'Source path' },
        destPath: { type: 'string', description: 'Destination path' },
      },
      required: ['srcPath', 'destPath'],
    },
  },

  // System & Hardware Diagnostics
  {
    name: 'get_system_information',
    description: 'Retrieves live hardware diagnostics for the current device (CPU, RAM, OS, Battery %)',
    riskLevel: 'LOW',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'take_screenshot',
    description: 'Captures a screenshot of the current device screen.',
    riskLevel: 'LOW',
    parameters: {
      type: 'object',
      properties: {},
    },
  },

  // Audio Controls
  {
    name: 'get_volume',
    description: 'Gets current master audio volume percentage.',
    riskLevel: 'LOW',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'set_volume',
    description: 'Sets master audio volume to a specific percentage (0-100).',
    riskLevel: 'LOW',
    parameters: {
      type: 'object',
      properties: {
        volume: {
          type: 'number',
          description: 'Target volume percentage from 0 to 100.',
        },
      },
      required: ['volume'],
    },
  },
  {
    name: 'mute',
    description: 'Mutes current device audio.',
    riskLevel: 'LOW',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'unmute',
    description: 'Unmutes current device audio.',
    riskLevel: 'LOW',
    parameters: {
      type: 'object',
      properties: {},
    },
  },

  // Network Status
  {
    name: 'get_wifi_status',
    description: 'Checks current device Wi-Fi connection status, network SSID name, and signal strength.',
    riskLevel: 'LOW',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
];

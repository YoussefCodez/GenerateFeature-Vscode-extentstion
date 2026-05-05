import * as vscode from 'vscode';
import type { ExtensionConfig, LayerTemplate } from '../types/index.js';
import {
  DEFAULT_LAYERS,
  DEFAULT_BASE_PATH,
  FLUTTER_TEMPLATES,
} from '../config/defaults.js';

/**
 * Reads extension configuration from VS Code settings.
 * Falls back to sensible defaults for all values.
 */
export function getExtensionConfig(): ExtensionConfig {
  const config = vscode.workspace.getConfiguration('generateFeature');

  const defaultLayers = config.get<string[]>(
    'defaultLayers',
    [...DEFAULT_LAYERS],
  );

  const generateBoilerplate = config.get<boolean>(
    'generateBoilerplate',
    true,
  );

  const basePath = config.get<string>('basePath', DEFAULT_BASE_PATH);

  const customTemplates = config.get<LayerTemplate[]>(
    'customTemplates',
    [],
  );

  // Merge Flutter templates with any user-defined custom templates.
  // User templates override built-in templates for the same layer.
  const templateMap = new Map<string, LayerTemplate>();

  if (generateBoilerplate) {
    for (const t of FLUTTER_TEMPLATES) {
      templateMap.set(t.layer, t);
    }
  }

  for (const t of customTemplates) {
    templateMap.set(t.layer, t);
  }

  return {
    defaultLayers,
    generateBoilerplate,
    basePath,
    templates: [...templateMap.values()],
  };
}

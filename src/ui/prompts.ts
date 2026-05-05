import * as vscode from 'vscode';
import type { FeatureInput, LayerItem  } from '../types/index.js';
import { ADD_CUSTOM_LAYER_LABEL } from '../config/defaults.js';
import {
  validateFeatureName,
  validateLayerName,
  toSnakeCase,
} from '../utils/stringUtils.js';

/**
 * UI layer — all user-facing prompts and pickers.
 * Pure vscode.window interactions, no file system logic.
 */

/**
 * Prompts the user for a feature name via an input box.
 * Returns the sanitized (snake_case) name, or undefined if cancelled.
 */
export async function promptFeatureName(): Promise<string | undefined> {
  const raw = await vscode.window.showInputBox({
    title: 'Generate Feature — Step 1/2',
    prompt: 'Enter feature name (e.g. auth, profile, cart)',
    placeHolder: 'feature_name',
    ignoreFocusOut: true,
    validateInput: (value) => validateFeatureName(value),
  });

  if (raw === undefined) {
    return undefined; // user cancelled
  }

  return toSnakeCase(raw.trim());
}

/**
 * Shows a multi-select quick pick for layer selection,
 * plus an "Add custom layer" option that opens an input box.
 *
 * Returns the selected layer names, or undefined if cancelled.
 */
export async function promptLayerSelection(
  defaultLayers: readonly string[],
): Promise<string[] | undefined> {
  const layers: string[] = [...defaultLayers];
  let confirmed = false;

  while (!confirmed) {
    const items: LayerItem[] = [
      // Default + any already-added custom layers
      ...layers.map((layer) => ({
        label: layer,
        id: layer,
        picked: true,
        isCustom: !defaultLayers.includes(layer),
        description: !defaultLayers.includes(layer) ? '(custom)' : undefined,
      })),
      // Separator-like add option
      {
        label: ADD_CUSTOM_LAYER_LABEL,
        id: '__add_custom__',
        picked: false,
        isCustom: false,
        alwaysShow: true,
        description: 'Type a new layer name',
      },
    ];

    const selected = await vscode.window.showQuickPick(items, {
      title: 'Generate Feature — Step 2/2',
      placeHolder: 'Select layers to generate (check/uncheck)',
      canPickMany: true,
      ignoreFocusOut: true,
    });

    if (selected === undefined) {
      return undefined; // user cancelled
    }

    // Check if user selected the "Add custom layer" option
    const wantsCustom = selected.some((s) => s.id === '__add_custom__');

    if (wantsCustom) {
      const customName = await promptCustomLayerName(layers);
      if (customName !== undefined) {
        layers.push(customName);
      }
      // Re-show the picker with the new layer added
      continue;
    }

    // Filter out the add-custom placeholder and return real selections
    const finalLayers = selected
      .filter((s) => s.id !== '__add_custom__')
      .map((s) => s.id);

    if (finalLayers.length === 0) {
      vscode.window.showWarningMessage(
        'Please select at least one layer.',
      );
      continue;
    }

    confirmed = true;
    return finalLayers;
  }

  return undefined;
}

/**
 * Prompts for a custom layer name.
 * Validates against duplicates in the existing layers list.
 */
async function promptCustomLayerName(
  existingLayers: readonly string[],
): Promise<string | undefined> {
  const raw = await vscode.window.showInputBox({
    title: 'Add Custom Layer',
    prompt: 'Enter custom layer name',
    placeHolder: 'e.g. core, shared, common',
    ignoreFocusOut: true,
    validateInput: (value) => {
      const error = validateLayerName(value);
      if (error) {
        return error;
      }
      const snake = toSnakeCase(value.trim());
      if (existingLayers.includes(snake)) {
        return `Layer "${snake}" already exists`;
      }
      return undefined;
    },
  });

  if (raw === undefined) {
    return undefined;
  }

  return toSnakeCase(raw.trim());
}

/**
 * Orchestrates the full prompt flow:
 *   1. Feature name input
 *   2. Layer selection (with custom layer support)
 *
 * Returns a FeatureInput or undefined if the user cancelled at any step.
 */
export async function runPromptFlow(
  defaultLayers: readonly string[],
): Promise<FeatureInput | undefined> {
  const featureName = await promptFeatureName();
  if (!featureName) {
    return undefined;
  }

  const layers = await promptLayerSelection(defaultLayers);
  if (!layers) {
    return undefined;
  }

  return { featureName, layers };
}

import * as vscode from 'vscode';
import type {
  ExtensionConfig,
  GenerationResult,
  FeatureInput,
  LayerTemplate,
} from '../types/index.js';
import { replacePlaceholders } from '../utils/stringUtils.js';

/**
 * Service responsible for creating the feature folder structure
 * and generating boilerplate files using vscode.workspace.fs.
 *
 * This service has NO UI dependencies — it only deals with the file system.
 */
export class FeatureGeneratorService {
  /**
   * Generates the full feature structure for the given input.
   *
   * @param workspaceUri - Root URI of the workspace
   * @param input        - Feature name and selected layers
   * @param config       - Extension configuration (base path, templates, etc.)
   */
  async generate(
    workspaceUri: vscode.Uri,
    input: FeatureInput,
    config: ExtensionConfig,
  ): Promise<GenerationResult> {
    const { featureName, layers } = input;

    let foldersCreated = 0;
    let filesCreated = 0;

    try {
      // Build the feature root: {workspace}/{basePath}/{featureName}
      const featureUri = vscode.Uri.joinPath(
        workspaceUri,
        config.basePath,
        featureName,
      );

      // Check if feature already exists
      const exists = await this.directoryExists(featureUri);
      if (exists) {
        return {
          success: false,
          message: `Feature "${featureName}" already exists at ${config.basePath}/${featureName}`,
          featureUri,
          foldersCreated: 0,
          filesCreated: 0,
        };
      }

      // Create each layer folder
      for (const layer of layers) {
        const layerUri = vscode.Uri.joinPath(featureUri, layer);
        await vscode.workspace.fs.createDirectory(layerUri);
        foldersCreated++;

        // Generate boilerplate structure if templates exist for this layer
        if (config.generateBoilerplate) {
          const template = config.templates.find(
            (t: LayerTemplate) => t.layer === layer,
          );

          if (template) {
            // Create subfolders
            if (template.subfolders) {
              for (const subfolder of template.subfolders) {
                const subfolderUri = vscode.Uri.joinPath(layerUri, subfolder);
                await vscode.workspace.fs.createDirectory(subfolderUri);
                foldersCreated++;
              }
            }

            // Create files
            const created = await this.generateTemplateFiles(
              layerUri,
              template,
              featureName,
            );
            filesCreated += created;
          }
        }
      }

      return {
        success: true,
        message: `Feature "${featureName}" created successfully 🚀`,
        featureUri,
        foldersCreated,
        filesCreated,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        success: false,
        message: `Failed to create feature "${featureName}": ${errorMessage}`,
        foldersCreated,
        filesCreated,
      };
    }
  }

  /**
   * Generates all template files for a single layer.
   * Handles nested directories within the layer folder.
   */
  private async generateTemplateFiles(
    layerUri: vscode.Uri,
    template: LayerTemplate,
    featureName: string,
  ): Promise<number> {
    let count = 0;

    for (const file of template.files) {
      const resolvedPath = replacePlaceholders(file.relativePath, featureName);
      const resolvedContent = replacePlaceholders(file.content, featureName);

      const fileUri = vscode.Uri.joinPath(layerUri, resolvedPath);

      // Ensure parent directory exists for nested paths
      const parentUri = vscode.Uri.joinPath(fileUri, '..');
      await vscode.workspace.fs.createDirectory(parentUri);

      // Write file content
      const encoded = new TextEncoder().encode(resolvedContent);
      await vscode.workspace.fs.writeFile(fileUri, encoded);
      count++;
    }

    return count;
  }

  /**
   * Checks whether a directory already exists.
   */
  private async directoryExists(uri: vscode.Uri): Promise<boolean> {
    try {
      const stat = await vscode.workspace.fs.stat(uri);
      return stat.type === vscode.FileType.Directory;
    } catch {
      return false;
    }
  }
}

import * as vscode from 'vscode';
import { runPromptFlow } from '../ui/prompts.js';
import { FeatureGeneratorService } from '../services/featureGenerator.js';
import { getExtensionConfig } from '../config/configService.js';

/**
 * Command handler for "generate-feature.generate".
 *
 * Orchestrates: config → prompts → generation → user feedback.
 * This is the only layer that ties UI and services together.
 */
export async function addFeatureCommand(
  contextUri?: vscode.Uri,
): Promise<void> {
  // 1. Ensure a workspace is open
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage(
      'Generate Feature: Please open a workspace folder first.',
    );
    return;
  }

  // If invoked from explorer context menu, use that folder's workspace.
  // Otherwise, default to the first workspace folder.
  let workspaceUri: vscode.Uri;
  if (contextUri) {
    const matchingFolder = workspaceFolders.find((folder) =>
      contextUri.fsPath.startsWith(folder.uri.fsPath),
    );
    workspaceUri = matchingFolder?.uri ?? workspaceFolders[0].uri;
  } else {
    workspaceUri = workspaceFolders[0].uri;
  }

  // 2. Read extension configuration
  const config = getExtensionConfig();

  // 3. Run prompt flow (feature name + layer selection)
  const input = await runPromptFlow(config.defaultLayers);
  if (!input) {
    return; // User cancelled — no noise
  }

  // 4. Generate the feature structure
  const generator = new FeatureGeneratorService();
  const result = await generator.generate(workspaceUri, input, config);

  // 5. Show result to user
  if (result.success) {
    const detail =
      result.filesCreated > 0
        ? `Created ${result.foldersCreated} folders and ${result.filesCreated} files.`
        : `Created ${result.foldersCreated} folders.`;

    const action = await vscode.window.showInformationMessage(
      result.message,
      { detail },
      'Open in Explorer',
    );

    if (action === 'Open in Explorer' && result.featureUri) {
      // Reveal the feature root folder in the Explorer
      const dummyFile = vscode.Uri.joinPath(result.featureUri, '.');
      await vscode.commands.executeCommand(
        'revealInExplorer',
        dummyFile,
      );
    }
  } else {
    vscode.window.showErrorMessage(result.message);
  }
}

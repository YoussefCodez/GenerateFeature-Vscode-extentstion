import * as vscode from 'vscode';
import { addFeatureCommand } from './commands/addFeature.js';

/**
 * Called when the extension is activated.
 * Activation is triggered by the registered command (see package.json).
 */
export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand(
    'generate-feature.addFeature',
    addFeatureCommand,
  );

  context.subscriptions.push(disposable);
}

/**
 * Called when the extension is deactivated.
 */
export function deactivate(): void {
  // Nothing to clean up  
}

import * as vscode from 'vscode';

/**
 * Represents a selectable layer in the multi-select UI.
 */
export interface LayerItem extends vscode.QuickPickItem {
  /** Unique identifier for the layer */
  readonly id: string;
  /** Whether this is a custom (user-added) layer */
  readonly isCustom: boolean;
}

/**
 * Result of the user prompt flow.
 */
export interface FeatureInput {
  /** The sanitized feature name */
  readonly featureName: string;
  /** The selected layer names */
  readonly layers: readonly string[];
}

/**
 * Configuration for boilerplate file generation within a layer.
 */
export interface LayerTemplate {
  /** Layer name this template applies to */
  readonly layer: string;
  /** Files to generate inside the layer folder */
  readonly files: readonly TemplateFile[];
  /** Subfolders to create inside the layer folder */
  readonly subfolders?: readonly string[];
}

/**
 * A single template file to be generated.
 */
export interface TemplateFile {
  /** Relative path within the layer folder (supports nested dirs like "repositories/") */
  readonly relativePath: string;
  /** Content of the file. Supports {{feature_name}} and {{FeatureName}} placeholders */
  readonly content: string;
}

/**
 * Extension-level configuration read from VS Code settings.
 */
export interface ExtensionConfig {
  /** Default layers shown in the picker */
  readonly defaultLayers: readonly string[];
  /** Whether to generate boilerplate files */
  readonly generateBoilerplate: boolean;
  /** The base path relative to workspace root (e.g. "lib/features") */
  readonly basePath: string;
  /** Custom templates per layer */
  readonly templates: readonly LayerTemplate[];
}

/**
 * Result of a feature generation operation.
 */
export interface GenerationResult {
  /** Whether the operation succeeded */
  readonly success: boolean;
  /** Human-readable message */
  readonly message: string;
  /** The URI of the created feature root folder */
  readonly featureUri?: vscode.Uri;
  /** Number of folders created */
  readonly foldersCreated: number;
  /** Number of files created */
  readonly filesCreated: number;
}

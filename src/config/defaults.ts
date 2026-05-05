import type { LayerTemplate } from '../types/index.js';

/**
 * Default layers for Clean Architecture.
 */
export const DEFAULT_LAYERS: readonly string[] = [
  'data',
  'domain',
  'presentation',
];

/**
 * Default base path for feature generation.
 */
export const DEFAULT_BASE_PATH = 'lib/features';

/**
 * Label used in the quick pick to trigger custom layer input.
 */
export const ADD_CUSTOM_LAYER_LABEL = '$(add) Add custom layer…';

/**
 * Flutter Clean Architecture folder structure templates.
 */
export const FLUTTER_TEMPLATES: readonly LayerTemplate[] = [
  {
    layer: 'data',
    subfolders: [
      'datasources',
      'models',
      'repositories',
    ],
    files: [],
  },
  {
    layer: 'domain',
    subfolders: [
      'entities',
      'repositories',
      'usecases',
    ],
    files: [],
  },
  {
    layer: 'presentation',
    subfolders: [
      'view_model',
      'screens/widgets',
    ],
    files: [
      { relativePath: 'screens/{{feature_name}}_screen.dart', content: '' },
    ],
  },
];

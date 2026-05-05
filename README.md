# Generate Feature 🏗️

A VS Code extension that generates **feature-based Clean Architecture** folder structures with customizable layers and optional Flutter boilerplate files.

> Speed up your project scaffolding — stop creating the same folders and files manually for every new feature.

## ✨ Features

| Feature | Description |
|---|---|
| **Feature scaffolding** | Creates `data / domain / presentation` folders under `lib/features/{name}/` |
| **Custom layers** | Add any extra layers (e.g. `core`, `shared`) on the fly |
| **Explorer context menu** | Right-click any folder → *Generate Feature Structure* |
| **Duplicate detection** | Warns you if a feature already exists instead of overwriting |

## 🚀 Usage

### Via Command Palette

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type **"Generate Feature Structure"**
3. Enter a feature name (e.g. `auth`, `profile`, `cart`)
4. Select which layers to generate (multi-select)
5. Done! 🎉

### Via Explorer Context Menu

1. Right-click on any folder in the Explorer
2. Click **"Generate Feature Structure"**
3. Follow the same flow

## 📁 Generated Structure

For a feature named `auth` with default layers:

```
lib/features/auth/
├── data/
│   ├── datasources/
│   │   ├── auth_remote_data_source.dart
│   │   └── auth_local_data_source.dart
│   ├── models/
│   │   └── auth_model.dart
│   └── repositories/
│       └── auth_repository_impl.dart
├── domain/
│   ├── entities/
│   │   └── auth_entity.dart
│   ├── repositories/
│   │   └── auth_repository.dart
│   └── usecases/
│       └── get_auth.dart
└── presentation/
    ├── bloc/
    │   ├── auth_bloc.dart
    │   ├── auth_event.dart
    │   └── auth_state.dart
    ├── pages/
    │   └── auth_page.dart
    └── widgets/
```

## ⚙️ Settings

Configure via VS Code Settings (`Ctrl+,`) → search for **"Generate Feature"**:

| Setting | Default | Description |
|---|---|---|
| `generateFeature.defaultLayers` | `["data", "domain", "presentation"]` | Layers shown in the picker |
| `generateFeature.basePath` | `lib/features` | Where features are created (relative to workspace root) |
| `generateFeature.generateBoilerplate` | `true` | Generate starter files inside each layer |
| `generateFeature.customTemplates` | `[]` | Override built-in templates per layer |

### Custom Templates Example

```jsonc
"generateFeature.customTemplates": [
  {
    "layer": "domain",
    "files": [
      {
        "relativePath": "entities/{{feature_name}}_entity.dart",
        "content": "// Custom entity for {{FeatureName}}\nclass {{FeatureName}}Entity {}"
      }
    ]
  }
]
```

## 🏛️ Extension Architecture

The extension itself follows Clean Architecture principles:

```
src/
├── extension.ts              # Entry point — registers commands
├── commands/
│   └── addFeature.ts         # Command handler — orchestrates the flow
├── services/
│   └── featureGenerator.ts   # Service — file system operations (vscode.workspace.fs)
├── ui/
│   └── prompts.ts            # UI — input boxes & quick picks
├── config/
│   ├── defaults.ts           # Default layers & Flutter templates
│   └── configService.ts      # Reads VS Code settings
├── utils/
│   └── stringUtils.ts        # String utilities (snake_case, PascalCase, validation)
└── types/
    └── index.ts              # Shared TypeScript interfaces
```

## 📝 License

MIT

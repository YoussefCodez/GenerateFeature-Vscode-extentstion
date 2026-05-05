# Generate Feature 🏗️

A VS Code extension that generates **feature-based Clean Architecture** folder structures for Flutter and other projects. It creates a standardized directory structure and a starter screen file automatically.

> Speed up your project scaffolding — stop creating the same folders manually for every new feature.

## ✨ Features

| Feature | Description |
|---|---|
| **Clean Scaffolding** | Creates `data`, `domain`, and `presentation` tiers under `lib/features/{name}/` |
| **Custom Layers** | Add any extra layers (e.g. `core`, `shared`) on the fly during generation |
| **Modern Structure** | Uses `screens` and `view_model` patterns for the presentation layer |
| **Explorer Context Menu** | Right-click any folder → *Generate Feature Structure* |
| **Settings Configurable** | Customize default layers and base path in VS Code settings |

## 🚀 Usage

### 1. Via Command Palette
- Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type **"Generate Feature Structure"**
- Enter feature name (e.g. `auth`, `profile`, `cart`)
- Select layers to generate (multi-select)
- Done! 🎉

### 2. Via Explorer Context Menu
- Right-click on any folder in the Explorer
- Click **"Generate Feature Structure"**

## 📁 Generated Structure

For a feature named `auth`, the extension generates:

```
lib/features/auth/
├── data/
│   ├── datasources/
│   ├── models/
│   └── repositories/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── usecases/
└── presentation/
    ├── view_model/
    └── screens/
        ├── widgets/
        └── auth_screen.dart (empty file)
```

## ⚙️ Settings

Configure via VS Code Settings (`Ctrl+,`) → search for **"Generate Feature"**:

| Setting | Default | Description |
|---|---|---|
| `generateFeature.defaultLayers` | `["data", "domain", "presentation"]` | Default layer checklist |
| `generateFeature.basePath` | `lib/features` | Root directory for new features |
| `generateFeature.generateBoilerplate` | `true` | Set to `false` to skip generating subfolders/files |

## 🏛️ Extension Architecture

The extension is built using Clean Architecture:
- **UI Layer**: Prompts and Quick Picks
- **Command Layer**: VS Code entry points and orchestration
- **Service Layer**: File system operations using `vscode.workspace.fs`
- **Config**: Settings management

## 📝 License

MIT

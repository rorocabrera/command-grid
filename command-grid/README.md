# Command Grid

A VS Code extension that creates a customizable grid of command buttons. Execute your frequently used commands with a single click!

## Features
- Customizable grid of command buttons
- Each button executes a predefined command in the terminal
- Configurable button colors and labels
- Commands run in workspace root

## Installation
1. Clone this repository
2. Open VS Code
3. Run command: Extensions: Install from VSIX...
4. Select the .vsix file from the repository

## Configuration
Add your buttons in VS Code settings.json:
```json
{
    "commandGrid.buttons": [
        {
            "label": "Build",
            "command": "npm run build",
            "color": "#28a745"
        },
        {
            "label": "Test",
            "command": "npm test",
            "color": "#007bff"
        }
    ]
}
```

## Usage
1. Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux)
2. Type "Show Command Grid"
3. Click any button to execute its command

## License
MIT

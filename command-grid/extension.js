// extension.js
const vscode = require('vscode');

function activate(context) {
    let disposable = vscode.commands.registerCommand('command-grid.showPanel', () => {
        CommandGridPanel.createOrShow(context.extensionUri);
    });

    context.subscriptions.push(disposable);
}

class CommandGridPanel {
    static currentPanel = undefined;
    static viewType = 'commandGrid';

    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (CommandGridPanel.currentPanel) {
            CommandGridPanel.currentPanel.panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            CommandGridPanel.viewType,
            'Command Grid',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        CommandGridPanel.currentPanel = new CommandGridPanel(panel, extensionUri);
    }

    constructor(panel, extensionUri) {
        this.panel = panel;
        this.extensionUri = extensionUri;
        this.update();

        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

        this.panel.webview.onDidReceiveMessage(
            async message => {
                if (message.command === 'executeCommand') {
                    const terminal = vscode.window.createTerminal('Command Grid');
                    terminal.show();
                    terminal.sendText(message.text);
                }
            },
            undefined,
            this.disposables
        );
    }

    update() {
        const config = vscode.workspace.getConfiguration('commandGrid');
        const buttons = config.get('buttons') || [];

        this.panel.webview.html = this.getWebviewContent(buttons);
    }

    getWebviewContent(buttons) {
        const gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    .grid {
                        display: grid;
                        grid-template-columns: ${gridTemplateColumns};
                        gap: 10px;
                        padding: 20px;
                    }
                    .button {
                        padding: 10px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        color: white;
                        font-weight: bold;
                        min-height: 40px;
                    }
                </style>
            </head>
            <body>
                <div class="grid">
                    ${buttons.map(btn => `
                        <button 
                            class="button" 
                            style="background-color: ${btn.color || '#007acc'}"
                            onclick="executeCommand('${btn.command}')"
                        >
                            ${btn.label}
                        </button>
                    `).join('')}
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    
                    function executeCommand(command) {
                        vscode.postMessage({
                            command: 'executeCommand',
                            text: command
                        });
                    }
                </script>
            </body>
            </html>
        `;
    }

    dispose() {
        CommandGridPanel.currentPanel = undefined;
        this.panel.dispose();
    }
}

module.exports = { activate };

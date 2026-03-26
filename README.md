# Agent Artifact Pro

A modular, high-quality React coding agent application with a Claude-style interface.

## Architecture

This project follows a modular React architecture:
- `src/api/`: Handles communication with the Anthropic Messages API.
- `src/components/`: Reusable UI components (Sidebar, Chat, Message, ToolCall).
- `src/hooks/`: Custom state management for the Agentic Loop and Virtual FS.
- `src/main.js`: Entry point.

## Features

- **Full Agentic Loop**: Recursive tool calling (tool_use -> tool_result -> text).
- **Responsive Layout**: Works on mobile and desktop with a collapsible sidebar.
- **Premium Aesthetics**: Claude-inspired dark theme with glassmorphism and subtle animations.
- **Virtual Filesystem**: State-based persistent mock filesystem for the agent to interact with.
- **Markdown & Syntax Highlighting**: Rich responses with professional code rendering.

## How to Run

Since this project uses ES modules directly in the browser (via Babel), you need a local web server to handle the file paths correctly.

1. Open a terminal in the project directory: `C:\Users\jayag\.gemini\antigravity\scratch\coding-agent-pro`
2. Run the simple Python server:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser to: `http://localhost:8000`


## Dependencies

- **React 18** & **ReactDOM**
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)
- **Marked** (Markdown rendering)
- **Prism.js** (Syntax highlighting)
- **Babel Standalone** (JSX transcription)

# EchoGPT Clone

EchoGPT Clone is a React-based web application that allows users to interact with an AI assistant. The application uses the EchoGPT API to generate responses to user inputs.

## Features

- **Chat Interface**: Users can send messages and receive responses from the AI assistant.
- **Chat History**: The application saves chat history locally and allows users to load previous conversations.
- **Retry Mechanism**: Implements exponential backoff for retrying API requests in case of rate limiting.
- **Error Handling**: Uses an error boundary to catch and display errors gracefully.

## Project Structure

- `src/`: Contains the source code for the application.
  - `components/`: Contains React components used in the application.
    - `ChatMessage.tsx`: Component for displaying individual chat messages.
    - `ErrorBoundary.tsx`: Component for catching and displaying errors.
    - `HistoryItem.tsx`: Component for displaying chat history items.
  - `App.tsx`: Main application component.
  - `index.css`: Global CSS file using Tailwind CSS.
  - `main.tsx`: Entry point for the React application.
  - `types.ts`: TypeScript types used in the application.
- `public/`: Contains static assets.
- `index.html`: HTML template for the application.
- `postcss.config.js`: Configuration for PostCSS.
- `tailwind.config.js`: Configuration for Tailwind CSS.
- `tsconfig.json`: TypeScript configuration file.
- `tsconfig.app.json`: TypeScript configuration for the application.
- `tsconfig.node.json`: TypeScript configuration for Node.js.
- `vite.config.ts`: Configuration for Vite.
- `.gitignore`: Specifies files and directories to be ignored by Git.
- `eslint.config.js`: Configuration for ESLint.
- `package.json`: Contains project metadata and dependencies.

## Setup Instructions

1. **Clone the repository**:

   ```sh
   git clone https://github.com/Sarafat-Murshid/EchoGPT.git
   cd EchoGPT
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your EchoGPT API key:

   ```sh
   VITE_ECHOGPT_API_KEY=your_api_key_here
   ```

4. **Run the development server**:

   ```sh
   npm run dev
   ```

5. **Build the project**:

   ```sh
   npm run build
   ```

6. **Preview the production build**:
   ```sh
   npm run preview
   ```

## Running Instructions

1. **Start the development server**:

   ```sh
   npm run dev
   ```

2. **Open your browser** and navigate to `http://localhost:3000`.

3. **Interact with the AI assistant** by typing your message in the input box and pressing Enter or clicking the send button.

4. **View chat history** by clicking the history button in the header.

5. **Start a new chat** by clicking the "New Chat" button in the side panel.

## License

This project is licensed under the MIT License.

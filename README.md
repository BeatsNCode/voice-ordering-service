# Voice Ordering Service

A voice-powered ordering application built with React, TypeScript, Node.js, and Express.

The goal of this project is to explore how real-time speech recognition can be integrated into a web application to create a conversational ordering experience.

## Project Status

🚧 Work in progress.

The application currently includes:

- React + TypeScript frontend
- Node.js + Express backend
- Menu data loaded from CSV
- Frontend-to-backend API communication
- Vite development proxy
- Deepgram integration in progress

## Tech Stack

### Frontend

- React
- TypeScript
- Vite

### Backend

- Node.js
- Express
- JavaScript / ES Modules

### Voice / Audio

- Deepgram
- FFmpeg

### Data

- CSV

## Architecture

The application is split into a frontend and backend.

```text
┌─────────────────────┐
│   React Frontend    │
│   localhost:5173    │
└──────────┬──────────┘
           │
           │ HTTP / API
           ▼
┌─────────────────────┐
│   Express Backend   │
│   localhost:3000    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      Menu CSV       │
└─────────────────────┘
```

The frontend retrieves menu information from the Express API.

During development, Vite proxies API requests from the frontend to the backend.

For example:

```ts
fetch('/api/')
```

is forwarded by Vite to the Express server.

## Voice Pipeline

The voice portion of the project will use Deepgram for speech recognition.

A simplified audio pipeline looks like:

```text
Audio Input
    │
    ▼
FFmpeg
    │
    │ PCM / Linear16 audio
    ▼
Deepgram
    │
    │ Streaming transcription
    ▼
Application
    │
    ▼
Ordering Logic
```

FFmpeg can be used to convert incoming audio into the format expected by the speech recognition service.

Audio is processed as a stream rather than waiting for an entire recording to finish.

## Deepgram Streaming

The project is exploring Deepgram's streaming speech recognition APIs.

A streaming connection allows the application to continuously send audio to Deepgram and receive transcription events in return.

Conceptually:

```text
Application                Deepgram
     │                         │
     │──── connect ───────────►│
     │                         │
     │──── audio chunk ───────►│
     │──── audio chunk ───────►│
     │──── audio chunk ───────►│
     │                         │
     │◄──── transcript ────────│
     │                         │
     │◄──── end of turn ───────│
```

This is different from a normal HTTP request where the application sends one request and waits for one response.

## Turn Detection

For a conversational ordering system, transcription alone is not enough.

The application also needs to determine when a customer has finished speaking.

For example:

```text
Customer:

"Can I get a chicken sandwich..."

        short pause

"...with fries and a Coke?"
```

The system should avoid responding during the short pause.

Deepgram's turn detection capabilities can help identify events such as:

- Start of speech
- Partial transcription
- Completed transcription
- End of conversational turn

This will eventually allow the ordering system to determine when it should process the customer's request.

## Menu API

The backend loads menu data from a CSV file and exposes it through an Express endpoint.

Example request:

```http
GET /api/
```

Example response:

```json
[
  {
    "name": "Chicken Sandwich",
    "description": "Crispy chicken sandwich",
    "price": 8.99
  }
]
```

The React frontend can retrieve this data with:

```ts
const response = await fetch('/api/');
const data = await response.json();
```

The resulting data is stored in React state and can be used to render the menu.

## Project Structure

```text
voice-ordering-service/
│
├── client/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── vite.config.ts
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── server.js
│   │   └── loadMenu.js
│   │
│   └── package.json
│
├── data/
│   └── menu.csv
│
└── README.md
```

The exact structure may change as the project develops.

## Running the Project

### Backend

From the server directory:

```bash
cd server
npm install
node src/server.js
```

The API runs on:

```text
http://127.0.0.1:3000
```

### Frontend

From the client directory:

```bash
cd client
npm install
npm run dev
```

Vite will start the frontend development server.

Typically:

```text
http://localhost:5173
```

## Environment Variables

API keys and other secrets should not be committed to the repository.

Create an environment variable for services such as Deepgram:

```env
DEEPGRAM_API_KEY=your_api_key
```

Environment files containing real credentials should be excluded through `.gitignore`.

For example:

```gitignore
.env
.env.local
```

## Concepts Explored

This project is also being used to explore several backend and real-time application concepts:

- REST APIs
- Frontend/backend communication
- HTTP requests
- Asynchronous JavaScript
- Promises
- `async` / `await`
- React state
- React effects
- Node.js streams
- Buffers
- Event-driven programming
- Child processes
- WebSockets
- Streaming audio
- Audio encoding
- Speech-to-text
- Conversational turn detection

## Planned Features

Future versions may include:

- Browser microphone input
- Real-time speech transcription
- Conversational turn detection
- Menu item recognition
- Order creation
- Order modification
- Order confirmation
- Text-to-speech responses
- Improved error handling
- Streaming connection management
- Conversational ordering UI

## Goal

The long-term goal is to create an experience where a customer can naturally place an order using their voice.

For example:

> "Can I get a three-piece chicken with mac and cheese and a lemonade?"

The system should eventually be able to:

```text
Speech
  ↓
Transcription
  ↓
Intent / Item Recognition
  ↓
Menu Validation
  ↓
Order State
  ↓
Confirmation
  ↓
Spoken Response
```

The project is intentionally being developed incrementally so that each layer of the voice application architecture can be understood and tested independently.
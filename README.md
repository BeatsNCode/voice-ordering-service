# Voice Ordering Service

A voice-powered ordering application built with React, TypeScript, Node.js, and Express.

The application allows a customer to place an order using their microphone. Spoken audio is transcribed with Deepgram, interpreted into structured order data, validated against the restaurant menu, displayed in a shopping cart, and confirmed with a generated voice response.

## Project Status

✅ MVP complete

The core voice-ordering flow is functional:

- Browser microphone recording
- Audio upload from frontend to backend
- Deepgram speech-to-text transcription
- AI-assisted order interpretation
- Deterministic menu validation
- Available, unavailable, and invalid item handling
- Quantity handling
- Shopping cart
- Order total calculation
- Spoken order confirmation with Deepgram text-to-speech
- Processing/loading indicator
- Cart status indicator
- Responsive frontend UI

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Browser MediaRecorder API
- Web Audio API

### Backend

- Node.js
- Express
- JavaScript / ES Modules

### AI / Voice

- Deepgram
  - Speech-to-text
  - Text-to-speech
- Google Gemini
  - Structured order interpretation

### Data

- CSV-based menu data

## Architecture

The application is split into a React frontend and an Express backend.

```text
┌──────────────────────────┐
│      React Frontend      │
│      localhost:5173      │
│                          │
│  Microphone              │
│  Menu                    │
│  Shopping Cart           │
└────────────┬─────────────┘
             │
             │ HTTP / API
             ▼
┌──────────────────────────┐
│      Express Backend     │
│      localhost:3000      │
└──────┬──────────┬────────┘
       │          │
       ▼          ▼
   Deepgram     Gemini
   STT / TTS    Order
                Interpretation
       │          │
       └────┬─────┘
            ▼
     Menu Validation
            │
            ▼
        Menu CSV
```

During development, Vite proxies frontend API requests to the Express backend.

For example:

```ts
fetch('/api/')
```

is forwarded to the Express server.

## Voice Ordering Pipeline

The current ordering flow begins when the customer records an order using the browser microphone.

```text
Customer Speech
      ↓
MediaRecorder
      ↓
Audio Blob
      ↓
POST /api/audio
      ↓
Deepgram Speech-to-Text
      ↓
Transcript
      ↓
Gemini Order Interpretation
      ↓
Structured Requested Items
      ↓
Deterministic Menu Validation
      ↓
OrderResult
      ↓
React Shopping Cart
      ↓
Speech Response Generation
      ↓
POST /api/speak
      ↓
Deepgram Text-to-Speech
      ↓
Spoken Confirmation
```

The AI model is used to understand the customer's natural-language request, while menu availability, prices, quantities, and order totals are handled by application logic.

This keeps business rules deterministic rather than relying on the language model to determine menu truth.

## Microphone and Audio

The frontend uses the browser's `MediaRecorder` API to capture microphone input.

When the customer finishes speaking:

1. Recording stops.
2. Recorded audio chunks are combined into a `Blob`.
3. The audio is sent to the backend through `POST /api/audio`.
4. A processing indicator is displayed while the order is evaluated.
5. The resulting order is returned to the frontend.

The Web Audio API is also used to analyze microphone input and drive the microphone's audio-level visualization.

## Speech-to-Text

The backend sends recorded audio to Deepgram for transcription.

Deepgram converts the customer's speech into text that can then be interpreted by the ordering system.

For example:

```text
"Can I get two cheeseburgers, fries and a Coke?"
```

becomes a transcript that is passed into the order interpretation layer.

## Order Interpretation

Google Gemini is used to convert natural-language transcripts into structured requested items.

For example:

```text
"Can I get two cheeseburgers and a Coke?"
```

can be interpreted as structured order data containing:

```text
Cheeseburger
Quantity: 2

Coke
Quantity: 1
```

The language model is responsible for understanding the request, not for deciding whether an item actually exists or is available.

## Menu Validation

After order interpretation, the requested items are validated against the menu.

Items are separated into three groups:

- Available items
- Unavailable items
- Invalid items

Available items can be added to the cart.

Unavailable items exist on the menu but are currently out of stock.

Invalid items represent requests that cannot be matched to a valid menu item.

This allows requests such as:

```text
"Give me two burgers, a chocolate chip cookie and a steak."
```

to be partially fulfilled instead of rejecting the entire order.

## Shopping Cart

Validated available items are displayed in the shopping cart.

The cart tracks:

- Item name
- Quantity
- Unit price
- Order total

The total is calculated deterministically from the validated order:

```ts
total + item.price * item.quantity
```

A cart indicator appears when the cart contains items.

## Spoken Responses

After an order has been processed, the frontend generates a natural-language response based on the order result.

For example:

```text
"Two cheeseburgers and a Coke were added to the cart.
Unfortunately, the chocolate chip cookie is out of stock."
```

The generated text is sent to:

```http
POST /api/speak
```

The backend sends the text to Deepgram's text-to-speech service and returns the generated audio to the browser.

The browser then plays the spoken confirmation.

## Menu API

The backend loads menu data from a CSV file and exposes it through an Express endpoint.

Example:

```http
GET /api/
```

The React frontend retrieves this data and stores it in state for rendering the menu.

```ts
const response = await fetch('/api/')
const data = await response.json()
```

## API Endpoints

The application currently uses three primary API routes:

```text
GET  /api/
     Retrieve menu data

POST /api/audio
     Submit recorded audio and receive a validated order

POST /api/speak
     Submit response text and receive generated speech audio
```

## Project Structure

```text
voice-ordering-service/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── menu.tsx
│   │   │   ├── microphone.tsx
│   │   │   ├── shoppingCart.tsx
│   │   │   └── playSpeech.tsx
│   │   │
│   │   ├── types/
│   │   │   └── order.ts
│   │   │
│   │   ├── App.tsx
│   │   └── App.css
│   │
│   ├── vite.config.ts
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── speech/
│   │   │   ├── transcribeAudio.js
│   │   │   └── textToSpeech.js
│   │   │
│   │   ├── order/
│   │   │   ├── interpretOrder.js
│   │   │   └── validateOrder.js
│   │   │
│   │   ├── loadMenu.js
│   │   └── server.js
│   │
│   ├── .env
│   └── package.json
│
├── data/
│   └── menu.csv
│
└── README.md
```

## Running the Project

### Backend

From the server directory:

```bash
cd server
npm install
node src/server.js
```

The backend runs on:

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

Vite starts the frontend development server, typically at:

```text
http://localhost:5173
```

## Environment Variables

API keys and other secrets should not be committed to the repository.

The backend requires environment variables for external services such as Deepgram and Gemini.

For example:

```env
DEEPGRAM_API_KEY=your_api_key
```

Environment files containing real credentials should be excluded through `.gitignore`.

```gitignore
.env
.env.local
```

## Concepts Explored

This project explores:

- REST APIs
- Frontend/backend communication
- HTTP requests and responses
- React state and effects
- TypeScript interfaces and types
- Asynchronous JavaScript
- Promises
- `async` / `await`
- Browser microphone permissions
- MediaRecorder
- Web Audio API
- Audio blobs
- Node.js buffers and streams
- Speech-to-text
- Text-to-speech
- Structured LLM output
- Natural-language order interpretation
- Deterministic validation
- Application state
- Loading states
- Responsive UI design

## Future Improvements

The current version focuses on completing a single voice-ordering interaction from speech input through spoken confirmation.

Potential future improvements include:

- Adding and removing items through follow-up voice commands
- Updating quantities conversationally
- Multi-turn conversations
- Improved pluralization and natural-language responses
- Better error and retry states
- Streaming speech recognition
- Conversational turn detection
- Persistent cart state
- Checkout flow
- Expanded menu data
- Deployment and production configuration

## Goal

The goal is to create an ordering experience where a customer can naturally place an order using their voice while the application maintains deterministic control over menu data, availability, pricing, and order state.

For example:

> "Can I get two cheeseburgers, onion rings and a vanilla milkshake?"

The application processes the request through:

```text
Speech
  ↓
Transcription
  ↓
Order Interpretation
  ↓
Menu Validation
  ↓
Order State
  ↓
Shopping Cart
  ↓
Speech Response
```

The project is intentionally being developed incrementally so that each layer of the voice application architecture can be understood, implemented, and tested independently.
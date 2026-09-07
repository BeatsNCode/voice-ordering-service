import { DeepgramClient } from "@deepgram/sdk";
import dotenv from "dotenv";
dotenv.config();

export const textToSpeech = async (text) => {

    const client = new DeepgramClient({ apiKey: process.env.DEEPGRAM_API_KEY });

    const response = await client.speak.v1.audio.generate({
    text: text,
    model: "aura-2-thalia-en",
    encoding: "linear16",
    container: "wav"
    });

    // Save the audio file
    const stream = response.stream();
    return stream;
}
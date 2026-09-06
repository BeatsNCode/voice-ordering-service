import { DeepgramClient } from '@deepgram/sdk';
import dotenv from 'dotenv';
dotenv.config();

const transcribeAudio = async (audioBuffer, contentType) => {
    const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY

    if (!DEEPGRAM_API_KEY) {
        throw new Error('Deepgram API key is not set')
    }

    const deepgramClient = new DeepgramClient({
        apiKey: DEEPGRAM_API_KEY
    })

    try {
        const response = await deepgramClient.listen.v1.media.transcribeFile(
            audioBuffer,
            {
                model: 'nova-3',
                smart_format: true
            }
        )

        const transcript = response.results?.channels?.[0]?.alternatives?.[0]?.transcript
        console.log('Transcript:', transcript)

        return transcript ?? ''
    } catch (error) {
        console.error('Error during transcription:', error)
        throw error
    }
}

export default transcribeAudio
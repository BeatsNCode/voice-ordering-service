import { Mic } from 'lucide-react';
import { useRef, useState } from 'react';
import type { OrderResult } from '../types/order';

type MicrophoneProps = {
  onOrderReceived?: (order: OrderResult) => void
}

function Microphone({ onOrderReceived }: MicrophoneProps) {
    const [isListening, setIsListening] = useState(false)
    const streamRef = useRef<MediaStream | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [audioLevel, setAudioLevel] = useState(0)
    const animationFrameRef = useRef<number | null>(null)

    const handleClick = async () => {
        if (!isListening) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                })
                streamRef.current = stream

                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.start();
                console.log("recorder started");

                const chunks: Blob[] = [];
                console.log(chunks)

                mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data);
                };

                mediaRecorder.onstop = async () => {
                    console.log("recorder stopped")

                    streamRef.current?.getTracks().forEach(track => {
                    track.stop()
                    })

                    await audioContextRef.current?.close()
                    audioContextRef.current = null

                    streamRef.current = null
                    mediaRecorderRef.current = null

                    const blob = new Blob(chunks, {
                        type: mediaRecorder.mimeType
                    })

                    const response = await fetch('/api/audio', {
                        method: 'POST',
                        headers: {
                            'Content-Type': blob.type
                        },
                        body: blob
                    })

                    const result = await response.json()
                    onOrderReceived?.(result)
                         
                }

                const audioContext = new AudioContext()
                audioContextRef.current = audioContext
                const source = audioContext.createMediaStreamSource(stream)
                const analyser = audioContext.createAnalyser()
                source.connect(analyser)

                analyser.fftSize = 256

                const dataArray = new Uint8Array(analyser.frequencyBinCount)

                const trackAudio = () => {
                analyser.getByteFrequencyData(dataArray)

                const average =
                    dataArray.reduce((sum, value) => sum + value, 0) /
                    dataArray.length

                setAudioLevel(Math.round(average))

                animationFrameRef.current = requestAnimationFrame(trackAudio)
                }

                trackAudio()
                setIsListening(true)
            } catch (error) {
                console.error('Error accessing microphone', error)
            }
        } else {
            mediaRecorderRef.current?.stop()

            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current)
                animationFrameRef.current = null
            }

            setAudioLevel(0)
            setIsListening(false)
        }
    }

    return (
        <div className={`microphone-container ${isListening ? 'listening' : ''}`}>
        <button
            className="microphone-button"
            onClick={handleClick}
        >
        {isListening && (
            <span
                className="audio-ring"
                style={{
                    transform: `scale(${1 + Math.min(audioLevel / 150, 0.25)})`,
                    opacity: Math.min(0.4 + audioLevel / 80, 1)
                }}
            />
        )}
            <Mic />
        </button>
        <span className="microphone-label">
            {isListening ? 'Listening...' : 'Click to Place Order'}
        </span>
        </div>
    )
}

export default Microphone
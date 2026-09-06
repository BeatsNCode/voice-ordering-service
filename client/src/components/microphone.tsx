import { Mic } from 'lucide-react';
import { useRef, useState } from 'react';

function Microphone() {
    const [isListening, setIsListening] = useState(false)
    const streamRef = useRef<MediaStream | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [audioLevel, setAudioLevel] = useState(0)
    const animationFrameRef = useRef<number | null>(null)

    const handleClick = async () => {
        if (!isListening) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                })
                console.log('Recording started:', stream)
                streamRef.current = stream

                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.start();
                console.log(mediaRecorder.state);
                console.log("recorder started");

                let chunks: Blob[] = [];

                mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data);
                };

                console.log(chunks);

                mediaRecorder.onstop = async () => {
                    console.log("recorder stopped")

                    streamRef.current?.getTracks().forEach(track => {
                    track.stop()
                    })

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
                    console.log('Server response:', result)

                    chunks = []

                    const audioURL = URL.createObjectURL(blob)
                    const audio = new Audio(audioURL)
                    audio.addEventListener('canplaythrough', () => {
                        audio.play()
                    }, { once: true })

                }

                const audioContext = new AudioContext()
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
import { Mic } from 'lucide-react';
import { useRef, useState } from 'react';

function Microphone() {
    const [isListening, setIsListening] = useState(false)
    const streamRef = useRef<MediaStream | null>(null)

    const handleClick = async () => {
        if (!isListening) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                })
                console.log('Recording started:', stream)
                streamRef.current = stream
                setIsListening(true)
            } catch (error) {
                console.error('Error accessing microphone', error)
        }
        } else {
            streamRef.current?.getTracks().forEach(track => {
                track.stop()
                console.log('Recording stopped:', track)
        })

        streamRef.current = null
        setIsListening(false)
        }
    }

    return (
        <div className={`microphone-container ${isListening ? 'listening' : ''}`}>
        <button
            className="microphone-button"
            onClick={handleClick}
        >
            <Mic />
        </button>

        <span className="microphone-label">
            {isListening ? 'Listening...' : 'Click to Place Order'}
        </span>
        </div>
    )
}

export default Microphone
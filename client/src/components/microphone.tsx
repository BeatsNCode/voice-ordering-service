import { Mic } from 'lucide-react';
import { useState } from 'react';

function Microphone() {
    const [isListening, setIsListening] = useState(false)
    const handleClick = () => {
        setIsListening(prev => !prev)
        getMicrophonePermission()
    }
    const getMicrophonePermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log('Microphone permission granted:', stream);
        } catch (error) {
            console.error('Error accessing microphone', error);
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
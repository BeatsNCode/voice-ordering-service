import { Mic } from 'lucide-react';
import { useState } from 'react';

function Microphone() {
    const [isListening, setIsListening] = useState(false)
    return (
        <div className={`microphone-container ${isListening ? 'listening' : ''}`}>
        <button
            className="microphone-button"
            onClick={() => setIsListening(prev => !prev)}
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
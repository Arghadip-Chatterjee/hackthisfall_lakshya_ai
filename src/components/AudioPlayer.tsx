'use client';
import React, { useEffect } from 'react';
import useSound from 'use-sound';

interface AudioPlayerProps {
    src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
    const [play, { stop, sound }] = useSound(src, { soundEnabled: true, interrupt: true });

    useEffect(() => {
        // Stop any playing sound when src changes
        if (sound) {
            stop();
        }
        // Re-initialize the sound with the new src
        play();
    }, [src, play, stop, sound]);

    const handlestop = () => {
        stop();
    };

    return (
        <div>
            <button
                onClick={handlestop}
                className="bg-blue-500 text-white p-2 rounded"
            >
                Stop
            </button>
        </div>
    );
};

export default AudioPlayer;

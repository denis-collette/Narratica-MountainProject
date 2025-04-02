import React from 'react'

interface PlayerProps {
    audioSource: string;
}

const Player: React.FC<PlayerProps> = ({ audioSource }) => {
    return (
        <section>
            <audio controls src={audioSource}>
            </audio>
        </section>
    );
};

export default Player;
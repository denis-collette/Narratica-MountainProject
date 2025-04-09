import React from 'react'
import { FaPlay, FaPause } from "react-icons/fa";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { AiOutlineFastBackward, AiOutlineFastForward } from "react-icons/ai";

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
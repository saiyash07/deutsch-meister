import { useState } from 'react';
import { speakGerman } from '../utils/speech';

export default function PronunciationBtn({ text, gender = 'male', size = 'normal' }) {
  const [playing, setPlaying] = useState(false);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (playing) return;
    setPlaying(true);
    await speakGerman(text, gender);
    setPlaying(false);
  };

  const sizeClass = size === 'small' ? 'btn-sm' : '';

  return (
    <button
      className={`pronun-btn ${gender} ${playing ? 'playing' : ''} ${sizeClass}`}
      onClick={handleClick}
      title={`Listen (${gender})`}
    >
      {gender === 'male' ? '🔵' : '🔴'}
    </button>
  );
}

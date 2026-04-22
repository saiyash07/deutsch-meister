import { useState } from 'react';
import { speakGerman, speakEnglish } from '../utils/speech';

export default function PronunciationBtn({ text, gender = 'male', size = 'normal', lang = 'de' }) {
  const [playing, setPlaying] = useState(false);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (playing) return;
    setPlaying(true);
    if (lang === 'en') {
      await speakEnglish(text);
    } else {
      await speakGerman(text, gender);
    }
    setPlaying(false);
  };

  const sizeClass = size === 'small' ? 'btn-sm' : '';
  const icon = lang === 'en' ? '🔊' : (gender === 'male' ? '🔵' : '🔴');

  return (
    <button
      className={`pronun-btn ${lang === 'en' ? 'en' : gender} ${playing ? 'playing' : ''} ${sizeClass}`}
      onClick={handleClick}
      title={`Listen (${lang === 'en' ? 'English' : gender})`}
    >
      {icon}
    </button>
  );
}

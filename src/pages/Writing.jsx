import { useState } from 'react';
import { useAI } from '../hooks/useAI';

const writingPrompts = [
  { level: 'A1', prompts: [
    'Write the German alphabet (A-Z) including ä, ö, ü, and ß',
    'Write the numbers 1-10 in German words',
    'Write your name and where you are from in German',
    'Write the days of the week in German',
    'Write the months of the year in German',
    'Write 5 colors in German',
    'Write "Good morning, my name is..." in German',
    'Write 5 fruits in German with their articles (der/die/das)',
  ]},
  { level: 'A2', prompts: [
    'Write a short paragraph about your daily routine in German',
    'Write 5 sentences using modal verbs (können, müssen, wollen)',
    'Write directions from your home to the nearest train station',
    'Write a short shopping list in German',
    'Describe your family in 5 German sentences',
  ]},
  { level: 'B1', prompts: [
    'Write a formal email applying for a job in German',
    'Write a paragraph using at least 3 subordinating conjunctions',
    'Write about your dream vacation using Konjunktiv II',
    'Write a short opinion text about learning languages',
  ]},
  { level: 'B2+', prompts: [
    'Write a persuasive essay about a social topic in German',
    'Write a formal complaint letter in German',
    'Summarize a German news article in your own words',
  ]},
];

export default function Writing({ progress }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [promptIdx, setPromptIdx] = useState(0);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const { analyzeImage, loading } = useAI(progress.apiKey);

  const currentLevel = writingPrompts[levelIdx];
  const currentPrompt = currentLevel.prompts[promptIdx];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      // Extract base64 without data URL prefix
      const base64 = ev.target.result.split(',')[1];
      setImage(base64);
      setFeedback(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeWriting = async () => {
    if (!image) return;
    
    const prompt = `You are a German language teacher analyzing a student's handwritten German text.

The writing prompt was: "${currentPrompt}"
The student's level is: ${currentLevel.level}

Please analyze the handwritten text in this image and provide feedback on:
1. **Spelling accuracy** — Are the German words spelled correctly? Check for umlauts (ä, ö, ü) and ß.
2. **Grammar** — Is the grammar correct for the level?
3. **Completeness** — Did the student address the prompt adequately?
4. **Handwriting quality** — Are the German-specific characters (ä, ö, ü, ß) written clearly?
5. **Score** — Give a score out of 100.

Provide your entire analysis, corrections, and encouragement in English. Format with markdown.`;

    const result = await analyzeImage(image, prompt);
    setFeedback(result);
  };

  const nextPrompt = () => {
    setImage(null);
    setImagePreview(null);
    setFeedback(null);
    if (promptIdx + 1 < currentLevel.prompts.length) {
      setPromptIdx(promptIdx + 1);
    } else if (levelIdx + 1 < writingPrompts.length) {
      setLevelIdx(levelIdx + 1);
      setPromptIdx(0);
    } else {
      setLevelIdx(0);
      setPromptIdx(0);
    }
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">✍️ Writing Practice</h1>
        <p className="page-subtitle">Write German by hand, upload a photo, and get AI feedback</p>
      </div>

      {!progress.apiKey && (
        <div className="card" style={{ marginBottom: '20px', background: 'rgba(255,150,0,0.1)', borderColor: 'rgba(255,150,0,0.3)' }}>
          <p style={{ color: 'var(--orange)', fontSize: '14px' }}>
            ⚠️ Set your Gemini API key in <strong>Profile</strong> to enable AI writing analysis.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {writingPrompts.map((wp, i) => (
          <button
            key={wp.level}
            className={`btn btn-sm ${i === levelIdx ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setLevelIdx(i); setPromptIdx(0); setImage(null); setImagePreview(null); setFeedback(null); }}
          >
            {wp.level}
          </button>
        ))}
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          ✏️ Writing Prompt ({currentLevel.level}) — {promptIdx + 1}/{currentLevel.prompts.length}
        </div>
        <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', lineHeight: 1.4 }}>
          {currentPrompt}
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Write this on paper, take a clear photo, and upload it below for AI feedback.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        {!imagePreview ? (
          <label className="upload-zone" htmlFor="writing-upload">
            <div className="upload-zone-icon">📸</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Upload your handwriting</div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Click or drag to upload a photo of your written German</div>
            <input
              id="writing-upload"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </label>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={imagePreview} alt="Your handwriting" className="upload-preview" />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
              <label className="btn btn-secondary" htmlFor="writing-reupload" style={{ cursor: 'pointer' }}>
                📸 Re-upload
                <input
                  id="writing-reupload"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
              <button
                className="btn btn-primary"
                onClick={analyzeWriting}
                disabled={loading || !progress.apiKey}
              >
                {loading ? '⏳ Analyzing...' : '🔍 Analyze Writing'}
              </button>
            </div>
          </div>
        )}
      </div>

      {feedback && (
        <div className="card animate-slide" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>📝 AI Feedback</h3>
          <div style={{ fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {feedback}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={nextPrompt}>
          Next Prompt →
        </button>
      </div>
    </div>
  );
}

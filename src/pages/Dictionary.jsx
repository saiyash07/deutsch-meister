import { useState, useCallback } from 'react';
import { searchDictionary, getCategories, dictionary as allWords } from '../data/dictionary';
import { useAI } from '../hooks/useAI';
import PronunciationBtn from '../components/PronunciationBtn';

export default function Dictionary({ progress, toggleFavoriteWord }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [showFavs, setShowFavs] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const { chat } = useAI(progress.apiKey);
  const categories = getCategories();

  let results;
  if (query) {
    results = searchDictionary(query);
  } else if (category !== 'all') {
    results = allWords.filter(e => e.category === category);
  } else {
    results = allWords;
  }

  if (showFavs) {
    results = results.filter(e => progress.favoriteWords.includes(e.german));
  }

  // Live AI translation for words not in dictionary
  const translateWithAI = useCallback(async () => {
    if (!query.trim() || !progress.apiKey) return;
    setAiLoading(true);
    const response = await chat(
      [{ role: 'user', content: query.trim() }],
      `You are a German-English dictionary. The user will send a word or phrase. Respond ONLY in this exact format (no extra text):
Word: [german word]
Translation: [english meaning]
Article: [der/die/das if noun, empty otherwise]
Plural: [plural form if noun]
Example: [one example sentence in German]
Level: [A1/A2/B1/B2/C1/C2]
Category: [one word category]

If the input is English, translate to German. If German, translate to English. Always provide the German word on the "Word:" line.`
    );
    setAiResult(response);
    setAiLoading(false);
  }, [query, progress.apiKey, chat]);

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">📖 Dictionary & Translator</h1>
        <p className="page-subtitle">300+ words + live AI translation for any word</p>
      </div>

      <div className="dict-search-box">
        <span className="dict-search-icon">🔍</span>
        <input
          className="input"
          value={query}
          onChange={e => { setQuery(e.target.value); setAiResult(null); }}
          onKeyDown={e => { if (e.key === 'Enter' && results.length === 0) translateWithAI(); }}
          placeholder="Search in English or German..."
          style={{ paddingLeft: '48px', height: '56px', fontSize: '17px', borderRadius: 'var(--radius-lg)' }}
          autoFocus
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          className={`btn btn-sm ${showFavs ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowFavs(f => !f)}
        >
          ⭐ Favorites ({progress.favoriteWords.length})
        </button>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{
            padding: '8px 16px', background: 'var(--bg-glass)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '13px'
          }}
        >
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '8px' }}>
          {results.length} results
        </span>
      </div>

      {/* AI Translation when no static results */}
      {query && results.length === 0 && !showFavs && (
        <div className="card" style={{ marginBottom: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Word not in local dictionary.
          </p>
          {progress.apiKey ? (
            <button className="btn btn-primary" onClick={translateWithAI} disabled={aiLoading}>
              {aiLoading ? '⏳ Translating...' : '🤖 Translate with AI'}
            </button>
          ) : (
            <p style={{ fontSize: '13px', color: 'var(--orange)' }}>
              Set your Gemini API key in Profile to enable live translation.
            </p>
          )}
          {aiResult && (
            <div style={{ marginTop: '16px', padding: '16px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', fontSize: '14px', lineHeight: 1.7 }}>
              {(() => {
                const lines = aiResult.split('\n');
                const data = {};
                lines.forEach(line => {
                  const [key, ...val] = line.split(': ');
                  if (key && val.length) data[key.trim()] = val.join(': ').trim();
                });
                return (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                      <strong style={{ fontSize: '18px', color: 'var(--text-primary)' }}>{data.Word}</strong>
                      <PronunciationBtn text={data.Word} gender="male" size="small" />
                      <PronunciationBtn text={data.Word} gender="female" size="small" />
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Translation: </span>
                      <strong style={{ color: 'var(--text-primary)' }}>{data.Translation}</strong>
                      <PronunciationBtn text={data.Translation} lang="en" size="small" />
                    </div>
                    {Object.entries(data).map(([key, val]) => {
                      if (key === 'Word' || key === 'Translation' || !val) return null;
                      return (
                        <div key={key}>
                          <span style={{ color: 'var(--text-secondary)' }}>{key}: </span>
                          <span style={{ color: 'var(--text-primary)' }}>{val}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      <div>
        {results.length === 0 && !query && !showFavs && (
          <div className="empty-state">
            <div className="empty-state-icon">📖</div>
            <p>Type a word to search the dictionary</p>
          </div>
        )}
        {showFavs && results.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">⭐</div>
            <p>No favorites yet. Star words to add them!</p>
          </div>
        )}
        {results.map((entry, i) => (
          <div key={i} className="card dict-word-card">
            <div className="dict-word-main">
              <span className="dict-german">{entry.german}</span>
              {entry.gender && <span className="dict-article">({entry.gender})</span>}
              <PronunciationBtn text={entry.german} gender="male" size="small" />
              <PronunciationBtn text={entry.german} gender="female" size="small" />
              <button
                onClick={() => toggleFavoriteWord(entry.german)}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: '18px', padding: '4px', cursor: 'pointer' }}
              >
                {progress.favoriteWords.includes(entry.german) ? '⭐' : '☆'}
              </button>
            </div>
            <div className="dict-english">{entry.english}</div>
            {entry.plural && (
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Plural: <strong>{entry.plural}</strong>
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <span className={`badge badge-${entry.level === 'A1' ? 'green' : entry.level === 'A2' ? 'blue' : entry.level === 'B1' ? 'purple' : 'orange'}`}>
                {entry.level}
              </span>
              <span className="badge badge-blue">{entry.category}</span>
            </div>
            {entry.example && <div className="dict-example">{entry.example}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

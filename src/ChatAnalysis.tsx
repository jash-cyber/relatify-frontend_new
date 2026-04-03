import { useState, useRef, useCallback } from 'react';
import { Heart, MessageCircle, ArrowLeft, Upload, X, ImageIcon, Type } from 'lucide-react';

function Logo({ onHome }: { onHome: () => void }) {
  return (
    <button onClick={onHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <div className="relative w-6 h-6 flex-shrink-0">
        <MessageCircle className="w-6 h-6 text-pink-600" fill="currentColor" />
        <Heart className="absolute -bottom-1 -right-1 w-3 h-3 text-pink-600" fill="currentColor" />
      </div>
      <span className="font-bold text-gray-950">Relatify</span>
    </button>
  );
}

interface ChatAnalysisResult {
  interest_level: { score: number; label: string; summary: string; };
  conversation_dynamics: { who_has_power: string; effort_balance: string; emotional_investment: string; };
  what_they_really_want: string;
  attachment_style: { type: string; explanation: string; };
  green_flags: string[];
  red_flags: string[];
  warning_signs: { breadcrumbing: boolean; ghosting_risk: number; playing_field: boolean; explanation: string; };
  how_to_respond: string;
  what_to_say_next: string[];
  what_to_avoid: string[];
  next_move: string;
  blunt_reality: string;
  compatibility_vibe: string;
}

const SAMPLE_CHAT = `Me: Hey! How was your weekend?
Them: it was ok lol. busy
Me: Oh nice, what were you up to?
Them: just stuff with friends
Me: That sounds fun! Would you want to grab coffee sometime?
Them: maybe yeah could be fun
Me: I'm free Saturday or Sunday, what works for you?
Them: idk I'll let you know
Me: Sure no worries! What kind of music are you into?
Them: lots of things haha
Me: Haha nice, I've been really into indie lately. You seen any good shows recently?
Them: not really been super busy lately`;

export default function ChatAnalysis({ onHome }: { onHome: () => void }) {
  const [mode, setMode] = useState<'screenshot' | 'text'>('screenshot');
  const [chatText, setChatText] = useState('');
  const [context, setContext] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ChatAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please upload an image file.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Image too large. Please use an image under 10MB.'); return; }
    setImageFile(file);
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  }, []);

  const handlePagePaste = useCallback((e: React.ClipboardEvent) => {
    if (mode !== 'screenshot') return;
    for (const item of e.clipboardData.items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) handleImageSelect(file);
        break;
      }
    }
  }, [mode]);

  const handleAnalyze = async () => {
    if (mode === 'screenshot' && !imageFile) { setError('Please upload or paste a screenshot.'); return; }
    if (mode === 'text' && chatText.trim().length < 30) { setError('Please paste at least a few messages to analyze.'); return; }

    setIsAnalyzing(true);
    setError('');
    setAnalysis(null);

    try {
      const body: Record<string, string> = { context, mode };

      if (mode === 'screenshot' && imageFile) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
        body.image = base64;
        body.media_type = imageFile.type;
      } else {
        body.chat = chatText;
      }

      const response = await fetch('https://relatify.gangwaljash17.workers.dev/analyze-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const raw = await response.json();
      setAnalysis(raw);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) =>
    score >= 70 ? 'from-emerald-500 to-emerald-600' : score >= 40 ? 'from-amber-500 to-amber-600' : 'from-rose-500 to-rose-600';

  const getScoreTextColor = (score: number) =>
    score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-rose-600';

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const reset = () => {
    setChatText(''); setContext(''); setImageFile(null); setImagePreview(null);
    setAnalysis(null); setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white" onPaste={handlePagePaste}>
      {/* Nav */}
      <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo onHome={onHome} />
          <button onClick={onHome} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Profile Analyzer
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden pt-16 pb-20 bg-gradient-to-br from-gray-50 via-white to-purple-50">
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-pink-300 to-purple-200 rounded-full opacity-10 blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-6">
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              <MessageCircle className="w-3 h-3" /> Chat Analyzer
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-950 leading-tight">
              Are They Actually Into You?
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Upload a screenshot or paste your conversation. Get a full psychological breakdown — interest level, red flags, what to say next, and your best move.
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6 max-w-xs mx-auto">
            <button
              onClick={() => { setMode('screenshot'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === 'screenshot' ? 'bg-white shadow text-gray-950' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <ImageIcon className="w-4 h-4" /> Screenshot
            </button>
            <button
              onClick={() => { setMode('text'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === 'text' ? 'bg-white shadow text-gray-950' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Type className="w-4 h-4" /> Paste Text
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">

            {/* Screenshot Mode */}
            {mode === 'screenshot' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                  Upload or Paste Screenshot
                </label>
                {!imagePreview ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${isDragging ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'}`}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-700 font-semibold text-sm">Drop screenshot here, click to upload, or</p>
                    <p className="text-purple-600 font-bold text-sm mt-1">Ctrl+V / Cmd+V to paste directly</p>
                    <p className="text-gray-400 text-xs mt-2">PNG, JPG, WEBP up to 10MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageSelect(f); }}
                    />
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img src={imagePreview} alt="Chat screenshot" className="w-full max-h-80 object-contain bg-gray-50" />
                    <button onClick={clearImage} className="absolute top-2 right-2 bg-gray-950 text-white rounded-full p-1.5 hover:bg-gray-700 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      ✓ Screenshot ready
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Text Mode */}
            {mode === 'text' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                  Paste Your Conversation
                </label>
                <textarea
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  placeholder={`Format like:\nMe: Hey how was your weekend?\nThem: it was ok lol\nMe: Nice! Want to hang sometime?\nThem: maybe yeah`}
                  className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none text-gray-700 placeholder-gray-400 text-sm font-mono"
                />
                <button
                  onClick={() => { setChatText(SAMPLE_CHAT); setContext('Met on Tinder 1 week ago, this is our first real conversation'); }}
                  className="mt-2 text-xs text-purple-600 font-semibold hover:text-purple-800 transition-colors"
                >
                  Use sample conversation →
                </button>
              </div>
            )}

            {/* Context */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                Context <span className="text-gray-400 font-normal normal-case">(optional but helps a lot)</span>
              </label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. Met on Hinge 2 weeks ago, been texting daily, haven't met yet"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-700 placeholder-gray-400 text-sm"
              />
            </div>

            {error && <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">{error}</div>}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin inline-block">↻</span>
                  {mode === 'screenshot' ? 'Reading screenshot...' : 'Analyzing conversation...'}
                </span>
              ) : 'Decode This Conversation 🔍'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mt-5">
            {['Interest Level Score', 'Ghosting Risk', 'Attachment Style', 'What To Say Next', 'Red & Green Flags', 'Best Next Move'].map((f) => (
              <span key={f} className="bg-white border border-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full shadow-sm">{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {analysis && (
        <div ref={resultsRef} className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-3xl mx-auto px-6 space-y-5">
            <h2 className="text-4xl font-bold text-gray-950 mb-1">Your Analysis</h2>
            <p className="text-gray-400 text-sm mb-6">Based on conversation patterns and language signals</p>

            {/* Interest Level */}
            <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-xl p-8">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Interest Level</h3>
              <div className="flex items-end gap-4 mb-4">
                <span className={`text-8xl font-black tabular-nums ${getScoreTextColor(analysis.interest_level.score)}`}>
                  {analysis.interest_level.score}
                </span>
                <div className="pb-3">
                  <div className={`text-2xl font-bold ${getScoreTextColor(analysis.interest_level.score)}`}>{analysis.interest_level.label}</div>
                  <div className="text-sm text-gray-400">out of 100</div>
                </div>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-5">
                <div className={`h-full bg-gradient-to-r ${getScoreColor(analysis.interest_level.score)} rounded-full`} style={{ width: `${analysis.interest_level.score}%` }} />
              </div>
              <p className="text-gray-700 leading-relaxed">{analysis.interest_level.summary}</p>
            </div>

            {/* Dynamics */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 shadow-lg p-8">
              <h3 className="text-lg font-bold text-gray-950 mb-4">Conversation Dynamics</h3>
              <div className="space-y-4">
                {[
                  { label: 'Power', value: analysis.conversation_dynamics.who_has_power },
                  { label: 'Effort', value: analysis.conversation_dynamics.effort_balance },
                  { label: 'Investment', value: analysis.conversation_dynamics.emotional_investment },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wide w-24 pt-0.5 flex-shrink-0">{label}</span>
                    <p className="text-gray-700 text-sm leading-relaxed">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What They Really Want */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 shadow-lg p-8">
              <h3 className="text-lg font-bold text-gray-950 mb-3">What They Really Want</h3>
              <p className="text-gray-700 leading-relaxed">{analysis.what_they_really_want}</p>
            </div>

            {/* Attachment Style */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-lg p-8">
              <h3 className="text-lg font-bold text-gray-950 mb-3">Attachment Style</h3>
              <div className="inline-block bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full mb-3">{analysis.attachment_style.type}</div>
              <p className="text-gray-700 text-sm leading-relaxed">{analysis.attachment_style.explanation}</p>
            </div>

            {/* Flags */}
            <div className="grid md:grid-cols-2 gap-4">
              {analysis.green_flags.length > 0 && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 shadow-lg p-6">
                  <h3 className="text-base font-bold text-gray-950 mb-3"><span className="text-emerald-600">✓</span> Green Flags</h3>
                  <ul className="space-y-2">
                    {analysis.green_flags.map((flag, idx) => (
                      <li key={idx} className="flex gap-2 text-gray-700 text-sm"><span className="text-emerald-500 mt-0.5 flex-shrink-0">•</span><span>{flag}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.red_flags.length > 0 && (
                <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl border border-rose-200 shadow-lg p-6">
                  <h3 className="text-base font-bold text-gray-950 mb-3"><span className="text-rose-600">!</span> Red Flags</h3>
                  <ul className="space-y-2">
                    {analysis.red_flags.map((flag, idx) => (
                      <li key={idx} className="flex gap-2 text-gray-700 text-sm"><span className="text-rose-500 mt-0.5 flex-shrink-0">•</span><span>{flag}</span></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Warning Signs */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-300 shadow-lg p-8">
              <h3 className="text-lg font-bold text-gray-950 mb-5">Warning Signs</h3>
              <div className="flex gap-8 mb-5 flex-wrap">
                <div className="text-center">
                  <div className={`text-3xl font-black ${getScoreTextColor(100 - analysis.warning_signs.ghosting_risk)}`}>{analysis.warning_signs.ghosting_risk}%</div>
                  <div className="text-xs text-gray-500 font-medium mt-1">Ghosting Risk</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-black ${analysis.warning_signs.breadcrumbing ? 'text-rose-600' : 'text-emerald-600'}`}>{analysis.warning_signs.breadcrumbing ? 'YES' : 'NO'}</div>
                  <div className="text-xs text-gray-500 font-medium mt-1">Breadcrumbing</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-black ${analysis.warning_signs.playing_field ? 'text-rose-600' : 'text-emerald-600'}`}>{analysis.warning_signs.playing_field ? 'LIKELY' : 'UNLIKELY'}</div>
                  <div className="text-xs text-gray-500 font-medium mt-1">Talking to Others</div>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{analysis.warning_signs.explanation}</p>
            </div>

            {/* How to Respond */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-cyan-200 shadow-lg p-8">
              <h3 className="text-lg font-bold text-gray-950 mb-3">How to Respond</h3>
              <p className="text-gray-700 leading-relaxed">{analysis.how_to_respond}</p>
            </div>

            {/* What to Say Next */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-200 shadow-lg p-8">
              <h3 className="text-lg font-bold text-gray-950 mb-4">What to Say Next</h3>
              <div className="space-y-3">
                {analysis.what_to_say_next.map((msg, idx) => (
                  <div key={idx} className="flex gap-3 p-4 bg-white/80 rounded-xl border border-teal-100">
                    <span className="text-teal-500 font-bold text-sm flex-shrink-0 mt-0.5">{idx + 1}.</span>
                    <p className="text-gray-700 text-sm italic">"{msg}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What to Avoid */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-200 shadow-lg p-8">
              <h3 className="text-lg font-bold text-gray-950 mb-3">What to Avoid</h3>
              <ul className="space-y-2">
                {analysis.what_to_avoid.map((item, idx) => (
                  <li key={idx} className="flex gap-2 text-gray-700 text-sm"><span className="text-rose-500 font-bold flex-shrink-0">✗</span><span>{item}</span></li>
                ))}
              </ul>
            </div>

            {/* Best Next Move */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-300 shadow-xl p-8">
              <h3 className="text-lg font-bold text-gray-950 mb-3">🎯 Your Best Next Move</h3>
              <p className="text-gray-800 leading-relaxed font-medium">{analysis.next_move}</p>
            </div>

            {/* Blunt Reality */}
            <div className="bg-gray-950 rounded-2xl shadow-xl p-8">
              <h3 className="text-lg font-bold text-white mb-3">Blunt Reality Check</h3>
              <p className="text-gray-300 leading-relaxed">{analysis.blunt_reality}</p>
            </div>

            {/* Compatibility */}
            <div className="bg-gradient-to-r from-fuchsia-50 to-pink-50 rounded-2xl border border-fuchsia-200 shadow-lg p-8">
              <h3 className="text-lg font-bold text-gray-950 mb-3">Compatibility Vibe</h3>
              <p className="text-gray-700 leading-relaxed">{analysis.compatibility_vibe}</p>
            </div>

            <button onClick={reset} className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all active:scale-95 text-base">
              Analyze Another Conversation
            </button>
          </div>
        </div>
      )}

      <footer className="bg-gray-950 text-gray-400 py-12 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm">
          <p className="mb-1">Relatify helps you understand people better.</p>
          <p>Built with care for clearer, more thoughtful connections.</p>
        </div>
      </footer>
    </div>
  );
}

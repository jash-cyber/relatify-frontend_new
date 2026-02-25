import { useState, useRef } from 'react';
import { Heart, Shield, Brain, MessageCircle, Zap, Check } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import html2canvas from 'html2canvas';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface AnalysisResult {
  snapshot: {
    emotional_maturity: number;
    stability: number;
    ghosting_risk: number;
    emotional_intensity: number;
    relationship_safety: number;
    one_line_reality_check: string;
  };
  vibe_summary: string;
  who_they_really_are: string[];
  what_they_want: string;
  green_flags: string[];
  red_flags: string[];
  blunt_truths: string[];
  how_to_talk: string;
  texting_style: {
    frequency: string;
    tone: string;
    what_works: string;
    what_turns_them_off: string;
  };
  first_date_energy: string;
  message_examples: string[];
  final_advice: string;
}

const SAMPLE_PROFILE = `I'm a software engineer who loves hiking and trying new coffee spots. I value genuine communication and I'm looking for someone emotionally available and ready for something real. Life's too short for games. When I'm not coding, you'll find me at live music venues or planning travel adventures. Looking for a genuine connection with someone who values growth and isn't afraid of deep conversations.`;

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-6 h-6 flex-shrink-0">
        <MessageCircle className="w-6 h-6 text-pink-600" fill="currentColor" />
        <Heart className="absolute -bottom-1 -right-1 w-3 h-3 text-pink-600" fill="currentColor" />
      </div>
      <span className="font-bold text-gray-950">Relatify</span>
    </div>
  );
}

function FloatingCardStack() {
  return (
    <div className="relative h-96 w-72 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <div className="text-center">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-xs text-gray-400">Abstract connection</p>
        </div>
      </div>
      <div className="relative w-full h-full animate-float">
        <div className="absolute inset-0 animate-fadeIn" style={{ animationDelay: '0ms' }}>
          <div className="absolute w-56 bg-white rounded-2xl shadow-lg border border-pink-200 p-4 transform transition-transform hover:shadow-xl" style={{ rotate: '-2deg', top: '0px', left: '20px' }}>
            <h3 className="text-xs font-bold text-gray-900 mb-3">Emotional Snapshot</h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Maturity</span>
                  <span className="text-xs font-bold text-pink-600">72</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-[72%] bg-gradient-to-r from-pink-500 to-purple-600"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Safety</span>
                  <span className="text-xs font-bold text-emerald-600">68</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-[68%] bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <div className="absolute w-56 bg-white rounded-2xl shadow-lg border border-emerald-200 p-4 transform transition-transform hover:shadow-xl" style={{ rotate: '1deg', top: '80px', left: '40px' }}>
            <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-green-500">✓</span> Green Flags
            </h3>
            <ul className="space-y-1">
              <li className="text-xs text-gray-600">Self-aware & reflective</li>
              <li className="text-xs text-gray-600">Values honesty & clarity</li>
              <li className="text-xs text-gray-600">Emotionally available</li>
            </ul>
          </div>
        </div>
        <div className="absolute inset-0 animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <div className="absolute w-56 bg-white rounded-2xl shadow-lg border border-rose-200 p-4 transform transition-transform hover:shadow-xl" style={{ rotate: '-1.5deg', top: '160px', left: '60px' }}>
            <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-rose-500">!</span> Red Flags
            </h3>
            <ul className="space-y-1">
              <li className="text-xs text-gray-600">Occasional avoidance language</li>
              <li className="text-xs text-gray-600">Unclear about intentions</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="absolute -top-20 -right-16 w-40 h-40 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl"></div>
    </div>
  );
}

function BackgroundBlob({ className }: { className: string }) {
  return <div className={`absolute rounded-full opacity-15 blur-3xl ${className}`}></div>;
}

// ── Share Card (renders off-screen, captured by html2canvas) ──────────────────
function ShareCard({ analysis, shareRef }: { analysis: AnalysisResult; shareRef: React.RefObject<HTMLDivElement> }) {
  const snap = analysis.snapshot;
  const bars = [
    { label: 'Emotional Maturity',  value: snap.emotional_maturity,  color: '#e040a0' },
    { label: 'Stability',           value: snap.stability,           color: '#9040e0' },
    { label: 'Ghosting Risk',       value: snap.ghosting_risk,       color: '#e04040' },
    { label: 'Emotional Intensity', value: snap.emotional_intensity, color: '#d08020' },
    { label: 'Relationship Safety', value: snap.relationship_safety, color: '#20a060' },
  ];

  return (
    <div
      ref={shareRef}
      style={{
        width: '520px',
        background: '#141416',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
        fontFamily: 'Georgia, serif',
        position: 'absolute',
        left: '-9999px',
        top: 0,
      }}
    >
      {/* Header */}
      <div style={{ padding: '28px 32px 22px', background: 'linear-gradient(135deg, #1a0a2e 0%, #16091f 50%, #0d1a2e 100%)' }}>
        <div style={{ fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.35)', marginBottom: '14px', fontFamily: 'sans-serif', textTransform: 'uppercase' }}>
          Relatify · Profile Analysis
        </div>
        {snap.one_line_reality_check && (
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, borderLeft: '2px solid rgba(220,80,180,0.5)', paddingLeft: '12px', marginBottom: '0px', fontStyle: 'italic' }}>
            "{snap.one_line_reality_check}"
          </div>
        )}
      </div>

      {/* Score bars */}
      <div style={{ padding: '22px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.25)', marginBottom: '14px', fontFamily: 'sans-serif', textTransform: 'uppercase' }}>
          Emotional Snapshot
        </div>
        {bars.map((b) => (
          <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', width: '140px', fontFamily: 'sans-serif', flexShrink: 0 }}>{b.label}</div>
            <div style={{ flex: 1, height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${b.value}%`, height: '100%', background: b.color, borderRadius: '10px' }} />
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', width: '26px', textAlign: 'right', fontFamily: 'sans-serif' }}>{b.value}</div>
          </div>
        ))}
      </div>

      {/* Green + Red flags */}
      <div style={{ padding: '20px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {analysis.green_flags.length > 0 && (
          <div style={{ background: 'rgba(80,200,120,0.08)', border: '1px solid rgba(80,200,120,0.15)', borderRadius: '12px', padding: '14px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(80,200,120,0.8)', marginBottom: '8px', fontFamily: 'sans-serif', textTransform: 'uppercase' }}>✓ Green Flags</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontFamily: 'sans-serif' }}>
              {analysis.green_flags.slice(0, 2).map((f, i) => <div key={i}>• {f}</div>)}
            </div>
          </div>
        )}
        {analysis.red_flags.length > 0 && (
          <div style={{ background: 'rgba(255,80,80,0.07)', border: '1px solid rgba(255,80,80,0.12)', borderRadius: '12px', padding: '14px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,100,100,0.8)', marginBottom: '8px', fontFamily: 'sans-serif', textTransform: 'uppercase' }}>⚠ Red Flags</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontFamily: 'sans-serif' }}>
              {analysis.red_flags.slice(0, 2).map((f, i) => <div key={i}>• {f}</div>)}
            </div>
          </div>
        )}
      </div>

      {/* CTA footer */}
      <div style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'sans-serif' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '2px', fontWeight: 600 }}>Curious about your match?</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Decode any profile free at relatify.in</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #d050b0, #8060e0)', color: 'white', fontSize: '12px', fontWeight: 600, padding: '10px 18px', borderRadius: '10px', fontFamily: 'sans-serif' }}>
          Try Relatify →
        </div>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  const [profileText, setProfileText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [feedbackRating, setFeedbackRating] = useState<'accurate' | 'somewhat' | 'inaccurate' | ''>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLDivElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null); // ← NEW

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleUseSample = () => {
    setProfileText(SAMPLE_PROFILE);
    setAnalysis(null);
    setError('');
    setFeedbackSubmitted(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleAnalyze = async () => {
    if (!profileText.trim() || profileText.trim().length < 10) {
      setError('Please enter at least 10 characters to analyze.');
      return;
    }
    setIsAnalyzing(true);
    setError('');
    setAnalysis(null);
    setFeedbackSubmitted(false);
    setFeedbackRating('');
    try {
      const response = await fetch('https://relatify.gangwaljash17.workers.dev/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: profileText }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }
      const raw = await response.json();
      const result: AnalysisResult = {
        snapshot: {
          emotional_maturity: raw.snapshot?.emotional_maturity ?? 0,
          stability: raw.snapshot?.stability ?? 0,
          ghosting_risk: raw.snapshot?.ghosting_risk ?? 0,
          emotional_intensity: raw.snapshot?.emotional_intensity ?? 0,
          relationship_safety: raw.snapshot?.relationship_safety ?? 0,
          one_line_reality_check: raw.snapshot?.one_line_reality_check ?? '',
        },
        vibe_summary: raw.vibe_summary ?? '',
        who_they_really_are: raw.who_they_really_are ?? [],
        what_they_want: raw.what_they_want ?? '',
        green_flags: raw.green_flags ?? [],
        red_flags: raw.red_flags ?? [],
        blunt_truths: raw.blunt_truths ?? [],
        how_to_talk: raw.how_to_talk ?? '',
        texting_style: {
          frequency: raw.texting_style?.frequency ?? '',
          tone: raw.texting_style?.tone ?? '',
          what_works: raw.texting_style?.what_works ?? '',
          what_turns_them_off: raw.texting_style?.what_turns_them_off ?? '',
        },
        first_date_energy: raw.first_date_energy ?? '',
        message_examples: raw.message_examples ?? [],
        final_advice: raw.final_advice ?? '',
      };
      setAnalysis(result);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeAnother = () => {
    setProfileText('');
    setAnalysis(null);
    setError('');
    setFeedbackSubmitted(false);
    setFeedbackRating('');
    setTimeout(() => {
      inputRef.current?.focus();
      heroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackRating) return;
    try {
      const { error: submitError } = await supabase
        .from('profile_feedback')
        .insert({ profile_text: profileText, accuracy_rating: feedbackRating, comment: '' });
      if (submitError) throw submitError;
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  // ── Download share card ───────────────────────────────────────────────────
  const handleDownloadShareCard = async () => {
    if (!shareCardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#141416',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = 'relatify-analysis.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => scrollToSection(heroRef)} className="hover:opacity-80 transition-opacity">
            <Logo />
          </button>
          <div className="flex items-center gap-6">
            <button onClick={() => scrollToSection(howRef)} className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">
              How Relatify Works
            </button>
            <button onClick={() => scrollToSection(aboutRef)} className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">
              About
            </button>
          </div>
        </div>
      </nav>

      <div ref={heroRef} className="relative overflow-hidden pt-20 pb-24 bg-gradient-to-br from-gray-50 via-white to-pink-50">
        <BackgroundBlob className="top-10 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-300 to-purple-300" />
        <BackgroundBlob className="bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-300 to-pink-200" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-950 leading-tight">
                  Understand Dating Profiles Better With AI
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Get clarity on emotional tone, maturity, ghosting patterns, and connection potential. Early-stage tool built to explore emotional patterns.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 space-y-4">
                <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Paste a dating profile
                </label>
                <textarea
                  ref={inputRef}
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                  placeholder="Example: I'm creative and love coffee. Looking for someone genuine and emotionally available..."
                  className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all resize-none text-gray-700 placeholder-gray-400"
                />
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">{error}</div>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">↻</span> Analyzing...
                      </span>
                    ) : (
                      'Analyze Profile'
                    )}
                  </button>
                  <button
                    onClick={handleUseSample}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-pink-400 hover:bg-pink-50 transition-all active:scale-95"
                  >
                    Use Sample
                  </button>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex justify-center items-center">
              <FloatingCardStack />
            </div>
          </div>
        </div>
      </div>

      {analysis && (
        <div ref={resultsRef} className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-gray-950 mb-12">Your Analysis</h2>

            <div className="space-y-6 animate-fadeIn">
              {/* Emotional Snapshot */}
              <div className="bg-white rounded-2xl border border-pink-200 shadow-lg p-8 hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-bold text-gray-950 mb-6">Emotional Snapshot</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Emotional Maturity', value: analysis.snapshot.emotional_maturity, color: 'pink' },
                    { label: 'Stability', value: analysis.snapshot.stability, color: 'purple' },
                    { label: 'Ghosting Risk', value: analysis.snapshot.ghosting_risk, color: 'rose' },
                    { label: 'Emotional Intensity', value: analysis.snapshot.emotional_intensity, color: 'amber' },
                    { label: 'Relationship Safety', value: analysis.snapshot.relationship_safety, color: 'emerald' },
                  ].map((metric, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                        <span className="text-sm font-bold text-gray-900">{metric.value}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${
                            metric.color === 'pink' ? 'from-pink-500 to-pink-600'
                            : metric.color === 'purple' ? 'from-purple-500 to-purple-600'
                            : metric.color === 'rose' ? 'from-rose-500 to-rose-600'
                            : metric.color === 'amber' ? 'from-amber-500 to-amber-600'
                            : 'from-emerald-500 to-emerald-600'
                          }`}
                          style={{ width: `${metric.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                {analysis.snapshot.one_line_reality_check && (
                  <p className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 text-sm text-gray-700 italic">
                    "{analysis.snapshot.one_line_reality_check}"
                  </p>
                )}
              </div>

              {/* The Vibe */}
              {analysis.vibe_summary && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-bold text-gray-950 mb-4">The Vibe</h3>
                  <p className="text-gray-700 leading-relaxed">{analysis.vibe_summary}</p>
                </div>
              )}

              {/* Who They Really Are */}
              {analysis.who_they_really_are && analysis.who_they_really_are.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-bold text-gray-950 mb-4">Who They Really Are</h3>
                  <div className="space-y-4">
                    {analysis.who_they_really_are.map((paragraph, idx) => (
                      <p key={idx} className="text-gray-700 leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* What They Want */}
              {analysis.what_they_want && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-bold text-gray-950 mb-4">What They Want</h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">{analysis.what_they_want}</div>
                </div>
              )}

              {/* Green Flags */}
              {analysis.green_flags && analysis.green_flags.length > 0 && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-bold text-gray-950 mb-4 flex items-center gap-2">
                    <span className="text-emerald-600">✓</span> Green Flags
                  </h3>
                  <ul className="space-y-2">
                    {analysis.green_flags.map((flag, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-700 text-sm">
                        <span className="text-emerald-500 mt-1">•</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Red Flags */}
              {analysis.red_flags && analysis.red_flags.length > 0 && (
                <div className="bg-gradient-to-r from-rose-50 to-red-50 rounded-2xl border border-rose-200 shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-bold text-gray-950 mb-4 flex items-center gap-2">
                    <span className="text-rose-600">!</span> Red Flags
                  </h3>
                  <ul className="space-y-2">
                    {analysis.red_flags.map((flag, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-700 text-sm">
                        <span className="text-rose-500 mt-1">•</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Blunt Reality Check */}
              {analysis.blunt_truths && analysis.blunt_truths.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-300 shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-bold text-gray-950 mb-4">Blunt Reality Check</h3>
                  <ul className="space-y-2">
                    {analysis.blunt_truths.map((truth, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-700 text-sm">
                        <span className="text-amber-600 font-bold mt-1">→</span>
                        <span>{truth}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* How to Talk to Them */}
              {analysis.how_to_talk && (
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-cyan-200 shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-bold text-gray-950 mb-4">How to Talk to Them</h3>
                  <p className="text-gray-700 leading-relaxed">{analysis.how_to_talk}</p>
                </div>
              )}

              {/* Texting Style */}
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-200 shadow-lg p-8 hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-bold text-gray-950 mb-4">Texting Style</h3>
                <div className="space-y-3">
                  {analysis.texting_style.frequency && (
                    <div>
                      <h4 className="font-semibold text-gray-950 text-sm mb-1">Frequency</h4>
                      <p className="text-gray-600 text-sm">{analysis.texting_style.frequency}</p>
                    </div>
                  )}
                  {analysis.texting_style.tone && (
                    <div>
                      <h4 className="font-semibold text-gray-950 text-sm mb-1">Tone</h4>
                      <p className="text-gray-600 text-sm">{analysis.texting_style.tone}</p>
                    </div>
                  )}
                  {analysis.texting_style.what_works && (
                    <div>
                      <h4 className="font-semibold text-gray-950 text-sm mb-1">What Works</h4>
                      <p className="text-gray-600 text-sm">{analysis.texting_style.what_works}</p>
                    </div>
                  )}
                  {analysis.texting_style.what_turns_them_off && (
                    <div>
                      <h4 className="font-semibold text-gray-950 text-sm mb-1">What Turns Them Off</h4>
                      <p className="text-gray-600 text-sm">{analysis.texting_style.what_turns_them_off}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* First Date Energy */}
              {analysis.first_date_energy && (
                <div className="bg-gradient-to-r from-fuchsia-50 to-pink-50 rounded-2xl border border-fuchsia-200 shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-bold text-gray-950 mb-4">First Date Energy</h3>
                  <p className="text-gray-700 leading-relaxed">{analysis.first_date_energy}</p>
                </div>
              )}

              {/* Message Examples */}
              {analysis.message_examples && analysis.message_examples.length > 0 && (
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-200 shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-bold text-gray-950 mb-4">Message Examples</h3>
                  <div className="space-y-3">
                    {analysis.message_examples.map((example, idx) => (
                      <div key={idx} className="p-3 bg-white/70 rounded-lg border border-teal-200">
                        <p className="text-gray-700 text-sm italic">"{example}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Final Advice */}
              {analysis.final_advice && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 shadow-lg p-8">
                  <h3 className="font-bold text-gray-950 mb-4">FINAL ADVICE</h3>
                  <p className="text-gray-700 leading-relaxed">{analysis.final_advice}</p>
                </div>
              )}

              {/* ── Hidden share card + Download button ── */}
              <ShareCard analysis={analysis} shareRef={shareCardRef} />

              <button
                onClick={handleDownloadShareCard}
                disabled={isDownloading}
                className="w-full flex items-center justify-center gap-2 bg-gray-950 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">↻</span> Generating...
                  </span>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download & Share This Analysis
                  </>
                )}
              </button>
              {/* ────────────────────────────────────────── */}
            </div>

            <div className="mt-12 space-y-6">
              {!feedbackSubmitted && (
                <div className="bg-white rounded-2xl border-2 border-pink-200 shadow-lg p-8">
                  <h3 className="text-lg font-bold text-gray-950 mb-4">Was this helpful?</h3>
                  <div className="flex gap-3 mb-6">
                    {(['accurate', 'somewhat', 'inaccurate'] as const).map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFeedbackRating(rating)}
                        className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all text-sm active:scale-95 ${
                          feedbackRating === rating
                            ? rating === 'accurate' ? 'bg-emerald-500 text-white'
                              : rating === 'somewhat' ? 'bg-amber-500 text-white'
                              : 'bg-rose-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {rating === 'accurate' ? '👍 Accurate' : rating === 'somewhat' ? '😐 Somewhat' : '👎 Not Accurate'}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={!feedbackRating}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Submit Feedback
                  </button>
                </div>
              )}

              {feedbackSubmitted && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center shadow-lg">
                  <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-emerald-900 font-semibold">Thank you! Your feedback helps us improve.</p>
                </div>
              )}

              <button
                onClick={handleAnalyzeAnother}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all active:scale-95"
              >
                Analyze Another Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <div ref={howRef} className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-950 mb-16 text-center">How Relatify Works</h2>
          <div className="space-y-8">
            {[
              { num: 1, title: 'Paste the Profile', desc: 'Copy any dating profile text from any app.' },
              { num: 2, title: 'Get Insights', desc: 'We analyze emotional tone, maturity, patterns, and vibes in seconds.' },
              { num: 3, title: 'Make Informed Decisions', desc: 'Understand someone better before you invest feelings or time.' },
            ].map((step) => (
              <div key={step.num} className="flex gap-6 group">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 group-hover:from-pink-200 group-hover:to-purple-200 transition-colors">
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 text-lg">{step.num}</span>
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-bold text-gray-950 mb-2">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div ref={insightsRef} className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-950 mb-16 text-center">What Insights You Get</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Brain, color: 'pink', title: 'Emotional Maturity', desc: 'Self-awareness, communication style, and emotional expression.' },
              { icon: MessageCircle, color: 'rose', title: 'Ghosting Risk', desc: 'Patterns that indicate investment level and follow-through likelihood.' },
              { icon: Shield, color: 'emerald', title: 'Emotional Safety', desc: 'Red flags, respectful language, and relationship readiness.' },
              { icon: Heart, color: 'blue', title: 'Connection Signals', desc: 'Shared interests, chemistry potential, and common ground.' },
            ].map((insight, idx) => {
              const Icon = insight.icon;
              const colorMap: Record<string, string> = {
                pink: 'from-pink-100 to-pink-200 text-pink-600',
                rose: 'from-rose-100 to-rose-200 text-rose-600',
                emerald: 'from-emerald-100 to-emerald-200 text-emerald-600',
                blue: 'from-blue-100 to-blue-200 text-blue-600',
              };
              return (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[insight.color]} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-950 mb-2">{insight.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{insight.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-950 mb-12 text-center">Who It's For</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'People tired of guessing', desc: 'Get clarity before investing feelings or time.' },
              { title: 'People who have been hurt', desc: 'Spot emotional unavailability early and protect your energy.' },
              { title: 'People who value clarity', desc: 'Make smarter dating decisions with deeper insights.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-200 p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-gray-950 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div ref={aboutRef} className="py-24 bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
        <BackgroundBlob className="top-20 right-10 w-80 h-80 bg-gradient-to-br from-pink-300 to-purple-300" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <Zap className="w-12 h-12 text-pink-600 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-gray-950 mb-6">Built to Help You Understand</h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Relatify is an <span className="font-semibold">early-stage tool</span> built to explore emotional patterns in dating profiles. We're not here to judge anyone — just to help you make clearer decisions based on communication style and expressed values.
          </p>
          <p className="text-gray-600 mb-8">Currently improving with real user feedback. Your insights make us smarter.</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span className="font-medium text-gray-950">Secure & Anonymous</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-950">Early-Stage AI</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <span className="font-medium text-gray-950">Non-Judgmental</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-950 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm">
          <p className="mb-2">Relatify helps you understand dating profiles better.</p>
          <p>Built with care for clearer, more thoughtful connections.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
      `}</style>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Video, 
  Camera, 
  Wind, 
  Lightbulb, 
  Music, 
  Globe, 
  MessageSquare,
  Sparkles,
  ChevronDown,
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import { generateDirectorPrompt, VideoConfig } from './services/geminiService';

const CATEGORIES = {
  style: ['Anime', 'Cinematic', 'Realistic', '3D', 'Cartoon', 'VHS', 'Retro'],
  environment: ['Day', 'Sunset', 'Neon Night', 'Rainy', 'City', 'Space', 'Forest', 'Future'],
  camera: ['Pan', 'Tilt', 'Dolly Zoom', 'Drone', 'Tracking', 'POV'],
  lighting: ['Neon', 'Moon', 'Studio', 'Chiaroscuro', 'Rim Light'],
  vfx: ['Smoke', 'Rain', 'Lens Flare', 'Sparks', 'Time Warp'],
  sfx: ['Nature', 'City', 'Epic', 'Sci-fi', 'Silence'],
  audio: ['Music ON', 'Mute Music', 'SFX Only', 'No Audio'],
  dialect: ['Arabic', 'Algerian', 'Egyptian', 'English', 'French']
};

export default function App() {
  const [script, setScript] = useState('');
  const [charDesc, setCharDesc] = useState('');
  const [config, setConfig] = useState<VideoConfig>({
    style: 'Cinematic',
    environment: 'Neon Night',
    camera: 'Tracking',
    lighting: 'Neon',
    vfx: 'Rain',
    sfx: 'Epic',
    audio: 'Music ON',
    dialect: 'English'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!script) return;
    setIsGenerating(true);
    setResult(null);
    try {
      const prompt = await generateDirectorPrompt(script, charDesc, config);
      setResult(prompt || 'No result found.');
    } catch (err) {
      alert('Generation failed. Check console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-oled-black text-white selection:bg-neon-blue/30 overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-white/5 py-6 px-8 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-tr from-neon-purple to-neon-blue rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(138,43,226,0.5)]">
              <Play className="fill-white w-5 h-5 ml-0.5" />
            </div>
            <div className="absolute -inset-1 bg-neon-purple/20 blur-xl rounded-full -z-10 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tighter">
              VIDÉO <span className="bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">SLI</span>
            </h1>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium">AI becomes your director</p>
          </div>
        </div>
        <div className="hidden md:flex gap-6 text-sm text-white/60">
          <button className="hover:text-neon-blue transition-colors">Documentation</button>
          <button className="hover:text-neon-blue transition-colors">Showcase</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Creative Input */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-neon-blue">
              <MessageSquare size={18} />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Cinematic Scenario</h2>
            </div>
            <textarea
              className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-6 focus:outline-none focus:border-neon-blue/50 transition-all text-lg leading-relaxed placeholder:text-white/20 resize-none glass-card"
              placeholder="What is the story of your scene? (e.g., A lonely cybernetic runner escaping through a rainy alleyway...)"
              value={script}
              onChange={(e) => setScript(e.target.value)}
            />
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-neon-purple">
              <Sparkles size={18} />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Character Description</h2>
            </div>
            <textarea
              className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 focus:outline-none focus:border-neon-purple/50 transition-all text-base leading-relaxed placeholder:text-white/20 resize-none glass-card"
              placeholder="Describe your characters... (e.g., Slim, wearing a chrome jacket, eyes glowing blue...)"
              value={charDesc}
              onChange={(e) => setCharDesc(e.target.value)}
            />
          </section>

          <div className="pt-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !script}
              className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                isGenerating ? 'bg-white/5 text-white/40 border-white/10' : 'btn-glow-blue text-white'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" />
                  CONSULTING DIRECTOR GEMINI 3...
                </>
              ) : (
                <>
                  <Video size={20} />
                  GENERATE DIRECTOR'S CUT
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Technical Config */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent space-y-6">
            <div className="pb-4 border-b border-white/5">
              <h3 className="text-xl font-display font-semibold">Master Categories</h3>
              <p className="text-xs text-white/40 mt-1">Refine your vision with specific parameters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <ConfigDropdown
                label="Style"
                icon={<Sparkles size={14} />}
                options={CATEGORIES.style}
                value={config.style}
                onChange={(val) => setConfig({ ...config, style: val })}
              />
              <ConfigDropdown
                label="Environment"
                icon={<Globe size={14} />}
                options={CATEGORIES.environment}
                value={config.environment}
                onChange={(val) => setConfig({ ...config, environment: val })}
              />
              <ConfigDropdown
                label="Camera Motion"
                icon={<Camera size={14} />}
                options={CATEGORIES.camera}
                value={config.camera}
                onChange={(val) => setConfig({ ...config, camera: val })}
              />
              <ConfigDropdown
                label="Lighting"
                icon={<Lightbulb size={14} />}
                options={CATEGORIES.lighting}
                value={config.lighting}
                onChange={(val) => setConfig({ ...config, lighting: val })}
              />
              <ConfigDropdown
                label="VFX"
                icon={<Wind size={14} />}
                options={CATEGORIES.vfx}
                value={config.vfx}
                onChange={(val) => setConfig({ ...config, vfx: val })}
              />
              <ConfigDropdown
                label="Dialect/Tone"
                icon={<Play size={14} />}
                options={CATEGORIES.dialect}
                value={config.dialect}
                onChange={(val) => setConfig({ ...config, dialect: val })}
              />
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest px-2">
                <Music size={14} />
                Audio Control
              </div>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.audio.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setConfig({ ...config, audio: opt })}
                    className={`px-4 py-3 rounded-xl text-xs font-medium transition-all border ${
                      config.audio === opt
                        ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-[0_0_15px_rgba(138,43,226,0.3)]'
                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="p-6 rounded-2xl border border-white/5 bg-white/2 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-neon-blue/10 flex items-center justify-center text-neon-blue shrink-0">
              <Play size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold">Gemini 3 Powered</h4>
              <p className="text-xs text-white/40 mt-1 leading-relaxed">
                The engine translates your creative vision into high-fidelity technical instructions for AI video tools.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Result Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="max-w-7xl mx-auto px-4 pb-24"
          >
            <div className="p-8 rounded-3xl border border-neon-blue/30 bg-gradient-to-br from-neon-blue/5 to-transparent relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={copyToClipboard}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  <span className="text-xs font-bold">{copied ? 'COPIED!' : 'COPY PROMPT'}</span>
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-neon-blue mb-4">
                <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                <h3 className="text-sm font-bold uppercase tracking-widest italic">The Director's Cut</h3>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-white/80 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {result}
                </p>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-neon-blue/20 blur-[80px] -z-10 group-hover:bg-neon-blue/30 transition-all" />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-neon-purple/20 blur-[80px] -z-10 group-hover:bg-neon-purple/30 transition-all" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-white/20 text-[10px] font-bold tracking-[0.3em] uppercase">
        Designed by Slimani 🚀 &copy; 2024 VIDÉO SLI
      </footer>
    </div>
  );
}

function ConfigDropdown({ label, options, value, onChange, icon }: { 
  label: string; 
  options: string[]; 
  value: string; 
  onChange: (val: string) => void;
  icon: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="text-white/40">{icon}</span>
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</label>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group"
      >
        <span className="text-sm font-medium">{value}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-white/40`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 right-0 mt-2 p-2 rounded-xl bg-black border border-white/10 shadow-2xl z-50 max-h-60 overflow-y-auto"
            >
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                    value === opt ? 'bg-neon-blue/10 text-neon-blue' : 'hover:bg-white/5 text-white/60'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

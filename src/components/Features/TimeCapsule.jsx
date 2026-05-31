import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTimeCapsule } from '../../services/ai';
import { Loader2, Mail, Fingerprint } from 'lucide-react';

export default function TimeCapsule() {
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSend = async () => {
    if (!plan) return;
    setLoading(true);
    try {
      const res = await getTimeCapsule(plan);
      setMessage(res.message);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 p-6">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-heading font-bold text-text-primary mb-4 glow-text">Climate Time Capsule</h2>
        <p className="text-text-secondary text-lg">Send your sustainability plan into the future and receive a message from 2050.</p>
      </div>

      {!message ? (
        <div className="bg-bg-surface/50 border border-border-subtle rounded-3xl p-8 glass-panel max-w-2xl mx-auto">
          <textarea 
            className="w-full h-32 bg-bg-primary border border-white/10 rounded-xl p-4 text-text-primary focus:outline-none focus:border-accent-purple transition-colors mb-6 resize-none"
            placeholder="What is your plan for the Earth? e.g. I will advocate for massive solar investment and public transit..."
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !plan}
            className="w-full bg-accent-purple hover:bg-[#651fff] text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Mail /> Seal Capsule</>}
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1 }}
          className="relative max-w-2xl mx-auto"
        >
          {/* Hologram Effect Base */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-12 bg-accent-teal/30 blur-2xl rounded-[100%]"></div>
          
          <div className="bg-gradient-to-b from-[#0a2a35]/90 to-bg-primary border-t-2 border-l border-r border-accent-teal/50 rounded-t-3xl p-10 text-center relative overflow-hidden shadow-[0_0_50px_rgba(29,233,182,0.15)]">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(29,233,182,0.1)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-30"></div>
            
            <Fingerprint className="w-12 h-12 text-accent-teal mx-auto mb-6 opacity-80" />
            <div className="text-xs text-accent-teal uppercase tracking-[0.3em] font-bold mb-8">
              Transmission Received • Year 2050
            </div>
            
            <p className="text-2xl text-white font-light leading-relaxed italic relative z-10 font-heading">
              "{message}"
            </p>

            <button 
              onClick={() => setMessage(null)}
              className="mt-12 text-sm text-accent-teal/70 hover:text-accent-teal underline tracking-widest uppercase relative z-10"
            >
              Close Transmission
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

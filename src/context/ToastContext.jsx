import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle, AlertTriangle, Info, Zap, Award } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = crypto.randomUUID();
    const newToast = { id, ...toast };
    
    setToasts(prev => {
      const updated = [newToast, ...prev];
      if (updated.length > 3) return updated.slice(0, 3);
      return updated;
    });

    if (toast.type === 'badge') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffab40', '#ffd740', '#ffffff']
      });
    }

    setTimeout(() => {
      removeToast(id);
    }, toast.type === 'badge' ? 5000 : 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const ToastItem = ({ toast, onRemove }) => {
  const getStyles = () => {
    switch (toast.type) {
      case 'success': return { bg: 'bg-[rgba(0,230,118,0.15)]', border: 'border-accent-green', icon: <CheckCircle className="text-accent-green" size={20} /> };
      case 'warning': return { bg: 'bg-[rgba(255,171,64,0.15)]', border: 'border-accent-amber', icon: <AlertTriangle className="text-accent-amber" size={20} /> };
      case 'xp': return { bg: 'bg-[rgba(124,77,255,0.15)]', border: 'border-accent-purple', icon: <Zap className="text-accent-purple" size={20} /> };
      case 'badge': return { bg: 'bg-[rgba(255,171,64,0.2)]', border: 'border-[#ffd740]', icon: <Award className="text-[#ffd740]" size={20} /> };
      default: return { bg: 'bg-[rgba(255,255,255,0.1)]', border: 'border-[rgba(255,255,255,0.2)]', icon: <Info className="text-white" size={20} /> };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      onClick={onRemove}
      className={`cursor-pointer backdrop-blur-md border ${styles.border} ${styles.bg} p-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[280px]`}
    >
      {styles.icon}
      <div>
        {toast.title && <div className="font-heading font-bold text-white text-sm">{toast.title}</div>}
        <div className={`text-sm ${toast.title ? 'text-text-secondary' : 'text-white font-medium'}`}>
          {toast.message}
        </div>
      </div>
    </motion.div>
  );
};

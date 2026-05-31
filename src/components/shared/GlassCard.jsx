import { motion } from 'framer-motion';

export default function GlassCard({ children, title, icon, className = '', accentColor = 'var(--accent-green)', onClick, noPadding = false }) {
  const CardContent = (
    <>
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.3)] to-transparent opacity-50"></div>
      
      {title && (
        <div className={`flex items-center gap-3 ${noPadding ? 'p-6 pb-0' : 'mb-5'} border-b border-[rgba(255,255,255,0.05)] pb-3`}>
          {icon && (
            <div 
              className="p-2 rounded-lg" 
              style={{ 
                backgroundColor: `${accentColor}15`,
                color: accentColor,
                boxShadow: `0 0 15px ${accentColor}30` 
              }}
            >
              {icon}
            </div>
          )}
          <h3 className="font-heading font-semibold text-lg text-white tracking-wide">{title}</h3>
        </div>
      )}
      <div className={`relative z-10 w-full h-full flex flex-col ${noPadding ? '' : 'flex-1'}`}>
        {children}
      </div>
    </>
  );

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02, boxShadow: `0 0 40px ${accentColor}20` } : { scale: 1.01, boxShadow: `0 0 40px rgba(0,230,118,0.12)` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] shadow-xl ${onClick ? 'cursor-pointer' : ''} ${noPadding ? '' : 'p-6'} ${className}`}
    >
      {CardContent}
    </motion.div>
  );
}

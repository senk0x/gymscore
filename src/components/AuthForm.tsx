import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignInButton } from '@/components/ui/sign-in-button';

interface AuthFormProps {
  open: boolean;
  onClose: () => void;
  onAuth: (email: string, password: string, name: string, mode: 'login' | 'register') => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

export function AuthForm({ open, onClose, onAuth, mode, onModeChange }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'register') {
      if (!email || !password || !name) {
        setError('Please enter your name, email and password.');
        return;
      }
    } else if (mode === 'login') {
      if (!email || !password) {
        setError('Please enter your email and password.');
        return;
      }
    }
    setError(null);
    onAuth(email, password, name, mode);
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-[#1E1E1E] bg-opacity-95 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.form
          onClick={e => e.stopPropagation()}
          onSubmit={handleSubmit}
          className="w-full max-w-[320px] bg-[#27272A] rounded-[20px] px-[13px] pt-[21px] pb-[21px] mx-auto my-0 flex flex-col justify-center"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          style={{ boxSizing: 'border-box' }}
        >
          <h2 className="text-[13px] poppins-medium text-white mb-4 text-center">
            {mode === 'login' ? 'Log In to Your Account' : 'Create Your Account'}
          </h2>
          {error && <div className="text-red-500 text-center text-[12px] mb-2 poppins-medium">{error}</div>}
          <div className="space-y-3">
            {mode === 'register' && (
              <div className="space-y-0.5">
                <label className="text-[13px] poppins-medium text-white mb-0.5 block">Name</label>
                <motion.div
                  className="relative"
                  animate={focusedInput === 'name' ? { scale: 1.025, backgroundColor: '#232328' } : { scale: 1, backgroundColor: 'transparent' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ borderRadius: 16 }}
                >
                  <input
                    type="text"
                    className="w-full bg-[#232326] rounded-[16px] px-3 py-1.5 text-white poppins-regular text-[11px] focus:outline-none placeholder:poppins-regular placeholder:text-[11px]"
                    placeholder="Enter your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onFocus={() => setFocusedInput('name')}
                    onBlur={() => setFocusedInput(null)}
                    autoComplete="name"
                  />
                </motion.div>
              </div>
            )}
            <div className="space-y-0.5">
              <label className="text-[13px] poppins-medium text-white mb-0.5 block">Email</label>
              <motion.div
                className="relative"
                animate={focusedInput === 'email' ? { scale: 1.025, backgroundColor: '#232328' } : { scale: 1, backgroundColor: 'transparent' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ borderRadius: 16 }}
              >
                <input
                  type="email"
                  className="w-full bg-[#232326] rounded-[16px] px-3 py-1.5 text-white poppins-regular text-[11px] focus:outline-none placeholder:poppins-regular placeholder:text-[11px]"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  autoComplete="email"
                />
              </motion.div>
            </div>
            <div className="space-y-0.5">
              <label className="text-[13px] poppins-medium text-white mb-0.5 block">Password</label>
              <motion.div
                className="relative"
                animate={focusedInput === 'password' ? { scale: 1.025, backgroundColor: '#232328' } : { scale: 1, backgroundColor: 'transparent' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ borderRadius: 16 }}
              >
                <input
                  type="password"
                  className="w-full bg-[#232326] rounded-[16px] px-3 py-1.5 text-white poppins-regular text-[11px] focus:outline-none placeholder:poppins-regular placeholder:text-[11px]"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              </motion.div>
            </div>
          </div>
          <motion.button
            type="submit"
            className="w-full bg-[#3D3D40] text-white poppins-medium text-[13px] py-2 rounded-[16px] mt-6 hover:bg-[#232326] transition-colors"
            whileHover={{ scale: 1.035 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </motion.button>
          <button
            type="button"
            onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
            className="w-full mt-2 bg-transparent border border-[#3D3D40] text-[#777779] poppins-medium text-[13px] py-2 rounded-[16px] hover:bg-[#232326] hover:text-white transition-colors"
          >
            {mode === 'login' ? "Don't have an account? Create one" : 'Already have an account? Log in'}
          </button>
          {/* Google Sign In Button below */}
          <div className="mt-6 flex flex-col items-center">
            <SignInButton onClick={() => setError(null)} />
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
} 
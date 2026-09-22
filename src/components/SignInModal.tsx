import React, { useState } from 'react';
import { X, User, Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  userEmail = 'adebayodeolu@gmail.com',
}) => {
  const [email, setEmail] = useState(userEmail);
  const [signedIn, setSignedIn] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignedIn(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#09090b] border border-[#27272a] rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="px-6 py-4 bg-[#121214] border-b border-[#27272a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black border border-[#27272a] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-sans text-[16px] font-bold text-white">cookieLens Account</h3>
              <p className="font-mono text-[11px] text-zinc-400">Developer & Watchlist Portal</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded bg-black hover:bg-[#18181b] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {signedIn ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-white mx-auto" />
              <h4 className="font-sans font-bold text-[18px] text-white">Welcome back!</h4>
              <p className="text-[13px] text-zinc-400">Signed in as {email}</p>
            </div>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-[12px] font-mono text-zinc-500 mb-1">EMAIL ADDRESS</label>
                <div className="flex items-center bg-black border border-[#27272a] rounded-lg px-3 py-2">
                  <Mail className="w-4 h-4 text-zinc-500 mr-2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-white font-mono text-[13px] outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-mono text-zinc-500 mb-1">PASSWORD</label>
                <div className="flex items-center bg-black border border-[#27272a] rounded-lg px-3 py-2">
                  <Lock className="w-4 h-4 text-zinc-500 mr-2" />
                  <input
                    type="password"
                    required
                    defaultValue="••••••••••••"
                    className="w-full bg-transparent text-white font-mono text-[13px] outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[12px] text-zinc-400">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded bg-black border-[#27272a]" />
                  <span>Remember session</span>
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-zinc-300 hover:text-white underline">
                  Forgot key?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-white hover:bg-zinc-200 text-black rounded-lg font-bold text-[14px] transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>Sign In to cookieLens</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

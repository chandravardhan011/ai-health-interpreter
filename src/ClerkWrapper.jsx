import React, { useState } from 'react';
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp, UserButton } from '@clerk/clerk-react';
import { Activity, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function ClerkWrapper({ children }) {
  const [authMode, setAuthMode] = useState('sign-in'); // 'sign-in' or 'sign-up'
  const [skipAuth, setSkipAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('skipAuth') || 'false');
    } catch {
      return false;
    }
  });

  const handleSkip = () => {
    localStorage.setItem('skipAuth', 'true');
    setSkipAuth(true);
  };

  // If publishable key is not provided yet or user skipped, render app
  if (!clerkPubKey || clerkPubKey.includes('your_clerk') || skipAuth) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-clinical-950 to-slate-900 flex flex-col justify-between text-slate-100 font-sans selection:bg-clinical-500 selection:text-white">
          
          {/* Top Brand Bar */}
          <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-clinical-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-clinical-500/30">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center space-x-2">
                  <span>AI Health Report Interpreter</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-clinical-500/20 text-clinical-300 border border-clinical-500/30">
                    Pro v2.0
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Clinical Diagnostics • Multilingual Risk Engine • Smart Summaries
                </p>
              </div>
            </div>

            <button
              onClick={handleSkip}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <span>Skip for Now (Guest Mode)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </header>

          {/* Center Auth Card with beautiful tabs */}
          <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
              
              {/* Tab Selector between Sign In and Sign Up */}
              <div className="flex p-1 mb-5 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-inner backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setAuthMode('sign-in')}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 ${
                    authMode === 'sign-in'
                      ? 'bg-clinical-600 text-white shadow-md shadow-clinical-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('sign-up')}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 ${
                    authMode === 'sign-up'
                      ? 'bg-clinical-600 text-white shadow-md shadow-clinical-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create Account (Sign Up)
                </button>
              </div>

              {/* Clerk Auth Box */}
              <div className="flex justify-center bg-white/95 backdrop-blur-xl p-2 rounded-3xl shadow-2xl border border-slate-200/50">
                {authMode === 'sign-in' ? (
                  <SignIn 
                    routing="hash"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 p-4 sm:p-6 w-full"
                      }
                    }}
                  />
                ) : (
                  <SignUp 
                    routing="hash"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 p-4 sm:p-6 w-full"
                      }
                    }}
                  />
                )}
              </div>

              {/* Bottom Guest Action */}
              <div className="mt-5 text-center">
                <button
                  onClick={handleSkip}
                  className="text-xs text-slate-400 hover:text-clinical-400 transition-colors inline-flex items-center space-x-1"
                >
                  <span>Don't want to create an account?</span>
                  <span className="font-semibold text-clinical-400 underline underline-offset-4 ml-1">
                    Continue as Guest
                  </span>
                </button>
              </div>

            </div>
          </main>

          {/* Footer note */}
          <footer className="py-4 text-center text-slate-500 text-xs">
            <div className="flex items-center justify-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>HIPAA Compliant • Bank-Grade 256-Bit Encryption • Client-First Privacy</span>
            </div>
          </footer>

        </div>
      </SignedOut>
    </ClerkProvider>
  );
}

import React, { useState } from 'react';
import { X, User, Mail, Lock, ShieldCheck, Stethoscope, ArrowRight, Sparkles } from 'lucide-react';

export function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const [role, setRole] = useState('patient'); // 'patient' | 'doctor'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }
    if (tab === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const displayName = tab === 'signup' 
      ? (role === 'doctor' && !name.toLowerCase().startsWith('dr.') ? `Dr. ${name}` : name)
      : (email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));

    const user = {
      name: displayName,
      email: email.trim(),
      role: role,
      signedInAt: new Date().toISOString(),
      provider: 'local'
    };

    localStorage.setItem('health_user', JSON.stringify(user));
    onLoginSuccess(user);
    onClose();
  };

  const handleQuickLogin = (demoRole) => {
    const demoUser = demoRole === 'doctor'
      ? {
          name: 'Dr. Chandra Vardhan',
          email: 'doctor@aihealthreportinterpreter.com',
          role: 'doctor',
          signedInAt: new Date().toISOString(),
          provider: 'demo'
        }
      : {
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@example.com',
          role: 'patient',
          signedInAt: new Date().toISOString(),
          provider: 'demo'
        };

    localStorage.setItem('health_user', JSON.stringify(demoUser));
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn cursor-pointer overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 relative animate-scaleUp cursor-default my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-br from-slate-900 via-clinical-950 to-slate-900 p-6 text-white text-center relative overflow-hidden">
          {/* Prominent Visible Close Cross Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-white/20 hover:bg-white/35 text-white transition-all cursor-pointer border border-white/25 shadow-md flex items-center justify-center group"
          >
            <X className="w-5 h-5 text-white stroke-[2.5] group-hover:scale-110 transition-transform" />
          </button>

          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-clinical-500/20 text-clinical-300 border border-clinical-400/30 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-clinical-200 border border-white/15 mb-2">
            Optional Account Login &bull; Not Compulsory
          </div>
          <h3 className="text-xl font-extrabold tracking-tight">
            {tab === 'signin' ? 'Sign In • AI Health Report Interpreter' : 'Create Your Account'}
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            Signing in is optional. You can analyze medical reports freely without creating an account.
          </p>

          {/* Tab Switcher */}
          <div className="flex bg-white/10 p-1 rounded-xl mt-4 border border-white/10">
            <button
              type="button"
              onClick={() => { setTab('signin'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                tab === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('signup'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                tab === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign Up (Optional)
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
              {error}
            </div>
          )}

          {/* Direct Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {tab === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`flex items-center justify-center space-x-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      role === 'patient'
                        ? 'border-clinical-600 bg-clinical-50 text-clinical-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Patient</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('doctor')}
                    className={`flex items-center justify-center space-x-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      role === 'doctor'
                        ? 'border-clinical-600 bg-clinical-50 text-clinical-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Physician</span>
                  </button>
                </div>
              </div>
            )}

            {tab === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'doctor' ? 'e.g. Chandra Vardhan' : 'e.g. Rajesh Kumar'}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-clinical-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-clinical-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-clinical-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-clinical-600 hover:bg-clinical-700 text-white shadow-md shadow-clinical-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{tab === 'signin' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Login */}
          <div className="mt-5 pt-4 border-t border-slate-200">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
              Instant 1-Click Demo Login
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('patient')}
                className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-clinical-600" />
                <span>Demo Patient</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('doctor')}
                className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                <span>Demo Doctor</span>
              </button>
            </div>
          </div>

          {/* Close & Continue as Guest Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-3 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <span>✕ Close &amp; Continue as Guest (Not Compulsory)</span>
          </button>

          <p className="text-[11px] text-slate-400 text-center mt-3">
            🔒 Medical reports and accounts are protected. Signing in is not compulsory.
          </p>
        </div>
      </div>
    </div>
  );
}

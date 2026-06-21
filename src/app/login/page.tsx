'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, Shield, Eye, EyeOff, Globe } from 'lucide-react';
import DashboardHeader from '@/components/dashboard-header';
import DashboardFooter from '@/components/dashboard-footer';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // MOCK LOGIN / SIGN UP FLOW
    // This is where you connect to Supabase authentication:
    // For Sign Up: const { data, error } = await supabase.auth.signUp({ email, password })
    // For Sign In: const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    setTimeout(() => {
      setLoading(false);
      if (isLogin) {
        if (email && password) {
          setMessage({
            text: 'Logged in successfully (Mock session created). Redirecting...',
            type: 'success'
          });
          // Typically: router.push('/')
        } else {
          setMessage({
            text: 'Please fill in all details.',
            type: 'error'
          });
        }
      } else {
        setMessage({
          text: 'Registration successful! Check your email for verification link.',
          type: 'success'
        });
      }
    }, 1500);
  };

  // Social Auth placeholder handlers
  const handleOAuth = (provider: 'google' | 'github') => {
    setMessage({
      text: `Connecting to Supabase OAuth: ${provider}...`,
      type: 'success'
    });
    // In production:
    // await supabase.auth.signInWithOAuth({ provider })
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-slate-100">
      <DashboardHeader />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl -z-10" />

        <div className="w-full max-w-md space-y-8 bg-slate-950/60 p-6 sm:p-8 rounded-2xl border border-border shadow-2xl backdrop-blur-sm relative z-10 animate-in fade-in duration-300">
          
          {/* Header */}
          <div className="space-y-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 font-mono transition-colors mx-auto"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Dashboard
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">
              {isLogin ? 'Sign in to Nifty Pulse' : 'Create new account'}
            </h1>
            <p className="text-xs text-slate-400">
              {isLogin
                ? 'Enter credentials to access your saved pre-market feeds.'
                : 'Get started with a free terminal account.'}
            </p>
          </div>

          {/* Form alert notices */}
          {message && (
            <div
              className={`p-3 rounded-lg border text-xs leading-relaxed ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Auth form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Email field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600 font-mono"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold text-slate-400">
                  Password
                </label>
                {isLogin && (
                  <a href="#" className="text-[10px] text-violet-400 hover:underline">
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg py-2.5 pl-10 pr-10 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-violet-700 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-md shadow-violet-600/10 cursor-pointer"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-900"></div>
            <span className="flex-shrink mx-4 text-[10px] text-slate-600 uppercase tracking-widest font-mono">Or Continue With</span>
            <div className="flex-grow border-t border-slate-900"></div>
          </div>

          {/* Social OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleOAuth('google')}
              className="flex items-center justify-center gap-2 py-2 border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900/30 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Google
            </button>
            <button
              onClick={() => handleOAuth('github')}
              className="flex items-center justify-center gap-2 py-2 border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900/30 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              GitHub
            </button>
          </div>

          {/* Login/Signup Toggle */}
          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-900">
            {isLogin ? (
              <span>
                New to Nifty Pulse?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setMessage(null);
                  }}
                  className="text-violet-400 font-semibold hover:underline"
                >
                  Create free account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setMessage(null);
                  }}
                  className="text-violet-400 font-semibold hover:underline"
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>

          {/* Integration hint box */}
          <div className="rounded-lg bg-violet-950/20 border border-violet-500/10 p-3 flex gap-2 text-[10px] text-violet-300/80 leading-normal">
            <Shield className="h-4.5 w-4.5 shrink-0 text-violet-400 mt-0.5" />
            <div>
              <span className="font-semibold block text-violet-300">Supabase Auth Integration</span>
              Configure client variables in `.env.local` to connect this login page with your Supabase auth instance. Supports MFA and OAuth out-of-the-box.
            </div>
          </div>

        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}

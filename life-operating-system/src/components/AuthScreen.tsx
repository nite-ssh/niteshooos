/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Command, AlertCircle } from 'lucide-react';
import { db } from '../db';

interface AuthScreenProps {
  onSuccess: (email: string, fullName: string) => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [email, setEmail] = useState('np.niteshpoudel@gmail.com');
  const [fullName, setFullName] = useState('Nitesh Poudel');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim()) {
      setError('Please enter your name and email to continue.');
      return;
    }
    db.login(email, fullName);
    onSuccess(email, fullName);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 font-sans select-none relative">
      
      {/* Decorative subtle radial gradient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(60,60,60,0.06)_0,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 space-y-6">
        
        {/* Logo and Brand */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-xl bg-[#111111] border border-[#262626] text-white shadow-xl">
            <Command size={24} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#666] uppercase">Personal Workspace</span>
            <h1 className="text-xl font-bold tracking-tight text-white mt-1">Life Organizer & Planner</h1>
            <p className="text-xs text-[#A1A1A1] mt-1.5 font-mono max-w-xs mx-auto leading-relaxed">
              Track your life categories, weekly habits, active projects, and daily tasks in one clean database.
            </p>
          </div>
        </div>

        {/* Auth form card */}
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-6 shadow-2xl space-y-4">
          
          <div className="border-b border-[#262626]/60 pb-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A1A1A1]">Welcome Back</h3>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Your Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Nitesh Poudel"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] text-white text-xs font-mono rounded-md px-3 py-2.5 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Your Email Address</label>
              <input
                type="email"
                required
                placeholder="e.g. yourname@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] text-white text-xs font-mono rounded-md px-3 py-2.5 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black font-bold font-mono text-xs uppercase py-2.5 rounded-md shadow-md transition active:scale-[0.98] cursor-pointer"
            >
              <ShieldCheck size={14} strokeWidth={2.5} />
              <span>Enter Workspace</span>
            </button>
          </form>

        </div>

        {/* Security / System status footer insights */}
        <div className="text-center font-mono text-[9px] text-[#666] space-y-1">
          <p>Your data is saved safely inside your web browser.</p>
          <p>Optional cloud database integration is available in settings.</p>
        </div>

      </div>
    </div>
  );
}

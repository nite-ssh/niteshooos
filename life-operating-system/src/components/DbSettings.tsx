/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, Shield, Check, Copy, HardDrive, RefreshCw } from 'lucide-react';
import { db } from '../db';
import { DbConnectionSettings } from '../types';

interface DbSettingsProps {
  settings: DbConnectionSettings;
  onSaveSettings: (settings: DbConnectionSettings) => void;
}

export default function DbSettings({ settings, onSaveSettings }: DbSettingsProps) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState(settings.url);
  const [anonKey, setAnonKey] = useState(settings.anonKey);
  const [useSupabase, setUseSupabase] = useState(settings.useSupabase);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      url: url.trim(),
      anonKey: anonKey.trim(),
      useSupabase: useSupabase,
    });
  };

  const sqlSchemaCode = `-- DATABASE SCHEMA: LIFE OPERATING SYSTEM
-- Run this inside Supabase SQL Editor

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT
);

CREATE TABLE public.portfolios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE DEFAULT auth.uid() NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    vision TEXT,
    health_score INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID REFERENCES public.portfolios ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    objective TEXT,
    health TEXT DEFAULT 'Healthy'
);

CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    program_id UUID REFERENCES public.programs ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    deadline DATE,
    progress_percentage INTEGER DEFAULT 0
);

CREATE TABLE public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'Todo'
);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlSchemaCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0A0A0A] p-6 sm:p-8 font-sans text-[#EDEDED]">
      
      {/* Header */}
      <header className="border-b border-[#262626] pb-6 mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <Database size={18} className="text-[#A1A1A1]" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#666]">System Settings</span>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">Data Settings</h2>
        <p className="text-xs text-[#666] font-mono mt-1">Save your data on your computer, or connect to a secure online cloud database to access your planner anywhere.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 select-none">
        
        {/* LEFT COLUMN: CRITICAL CONFIGURATION ACTIONS */}
        <div className="space-y-6">
          
          <form onSubmit={handleSave} className="bg-[#111111] border border-[#262626] rounded-xl p-5 space-y-4 shadow-sm">
            <div className="border-b border-[#262626]/50 pb-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A1A1A1]">Supabase Cloud Settings</h3>
            </div>

            {/* Checkbox toggle option */}
            <div className="flex items-center gap-3 p-3 bg-[#0C0C0C]/40 border border-[#262626] rounded-lg cursor-pointer">
              <input
                id="use-supabase-checkbox"
                type="checkbox"
                checked={useSupabase}
                onChange={(e) => setUseSupabase(e.target.checked)}
                className="w-4 h-4 rounded border-[#262626] bg-[#0C0C0C] accent-white focus:ring-0 cursor-pointer"
              />
              <label htmlFor="use-supabase-checkbox" className="text-xs font-mono font-medium text-[#EDEDED] cursor-pointer">
                Save my data to Supabase Cloud
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Supabase URL</label>
                <input
                  type="url"
                  placeholder="https://xyzabcdefg.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={!useSupabase}
                  className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] text-white text-xs font-mono rounded-md px-3 py-2 focus:outline-none disabled:opacity-40 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Supabase Anon Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  disabled={!useSupabase}
                  className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] text-white text-xs font-mono rounded-md px-3 py-2 focus:outline-none disabled:opacity-40 transition"
                />
              </div>
            </div>

            {/* Save trigger button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-gray-200 text-black font-bold font-mono text-xs uppercase py-2 rounded-md transition cursor-pointer shadow-sm"
            >
              <RefreshCw size={12} />
              <span>Save Connection Settings</span>
            </button>

          </form>

          {/* Seed reset instructions */}
          <div className="bg-[#111111] border border-[#262626] rounded-xl p-5 shadow-sm">
            <div className="border-b border-[#262626]/50 pb-3 mb-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A1A1A1]">Restore Data or Start Over</h3>
            </div>
            <p className="text-xs text-[#666] mb-4 font-sans leading-relaxed">
              If something isn't working right or you want to start over with sample data:
            </p>
            <button
              onClick={() => { if (confirm('This will delete all your current categories, focus areas, projects, and tasks, and replace them with sample data. Are you sure?')) { db.resetToDefaults(); } }}
              className="w-full flex items-center justify-center gap-1.5 bg-[#1A1A1A] hover:bg-[#222] text-[#EDEDED] border border-[#262626] font-bold font-mono text-xs uppercase py-2 rounded-md transition cursor-pointer"
            >
              <HardDrive size={13} />
              <span>Delete My Data & Load Sample Data</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: SHOW COMPILED BLUEPRINT FOR POSTGRE */}
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center border-b border-[#262626]/50 pb-3 mb-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A1A1A1]">Supabase Database Setup Code</h3>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-[10px] font-mono hover:text-[#EDEDED] text-[#666] transition cursor-pointer"
              >
                {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Simulated code display block */}
            <div className="bg-[#0C0C0C] p-4 rounded-lg border border-[#262626] overflow-x-auto max-h-[300px] scrollbar-none shadow-inner">
              <pre className="text-[10px] font-mono text-[#666] leading-relaxed max-w-full">
                <code>{sqlSchemaCode}</code>
              </pre>
            </div>
          </div>

          <div className="pt-4 border-t border-[#262626] mt-6 font-mono text-[9px] text-[#666] space-y-2">
            <div className="flex items-start gap-2 p-3 bg-[#0C0C0C]/50 rounded-lg border border-[#262626]">
              <Shield size={14} className="shrink-0 mt-0.5 text-[#666]" />
              <p className="leading-relaxed text-[#666]">
                This code sets up your cloud database. Connecting things this way means deleting a parent category will automatically clean up its child projects and tasks.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Compass,
  Sliders,
  FolderLock,
  Layers,
  CheckSquare,
  ClipboardCheck,
  Database,
  Terminal,
  LogOut,
  Sparkles,
  Command,
  Plus,
  BookOpen
} from 'lucide-react';
import { UserProfile, DbConnectionSettings } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  authUser: UserProfile | null;
  dbSettings: DbConnectionSettings;
  onLogout: () => void;
  onOpenCommandPalette: () => void;
  onTriggerCreate: (type: 'Portfolio' | 'Program' | 'Project' | 'Task') => void;
}

export default function Sidebar({
  currentView,
  onNavigate,
  authUser,
  dbSettings,
  onLogout,
  onOpenCommandPalette,
  onTriggerCreate,
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Compass },
    { id: 'portfolios', name: 'Life Categories', icon: Sliders },
    { id: 'programs', name: 'Focus & Habits', icon: Layers },
    { id: 'projects', name: 'Active Projects', icon: FolderLock },
    { id: 'tasks', name: 'Action Tasks', icon: CheckSquare },
    { id: 'weekly-review', name: 'Weekly Checklist', icon: ClipboardCheck },
    { id: 'settings', name: 'Data Settings', icon: Database },
    { id: 'manual', name: 'User Manual', icon: BookOpen },
  ];

  return (
    <aside className="w-64 border-r border-[#262626] bg-[#0C0C0C] flex flex-col justify-between shrink-0 h-screen select-none font-sans">
      <div className="flex flex-col flex-1 min-h-0">
        
        {/* Core System Brand */}
        <div className="p-6 flex items-center gap-3 border-b border-[#262626]">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shrink-0">
            <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center">
              <span className="text-[9px] font-mono font-bold text-white leading-none">A</span>
            </div>
          </div>
          <div>
            <h1 className="text-[10px] uppercase tracking-widest text-[#666] leading-none">Aegis OS</h1>
            <span className="font-semibold text-base tracking-tight text-[#EDEDED] block mt-0.5 leading-none">Goal Planner</span>
          </div>
        </div>

        {/* Command Launcher Banner */}
        <div className="p-4">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between p-2 rounded border border-[#262626] bg-[#111111] hover:bg-[#1A1A1A] hover:border-[#333] text-[11px] text-[#A1A1A1] font-mono transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Command size={12} className="text-[#666]" />
              <span>Search Planner...</span>
            </div>
            <span className="p-0.5 px-1 bg-[#0A0A0A] rounded text-[#666] border border-[#262626] text-[9px]">⌘K</span>
          </button>
        </div>

        {/* Global Create Button */}
        <div className="px-4 pb-2">
          <button
             onClick={() => onTriggerCreate('Task')}
             className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded bg-white hover:bg-gray-200 text-black transition-colors cursor-pointer"
          >
            <Plus size={13} strokeWidth={2.5} />
            <span>NEW TASK</span>
          </button>
        </div>

        {/* Navigation Categories */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-[#666] mb-3 px-2">Navigation</div>
          {menuItems.map((item) => {
            const Icon = item.id === 'portfolios' ? Sliders : item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs tracking-wide transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white font-semibold'
                    : 'text-[#A1A1A1] hover:text-white hover:bg-[#1A1A1A]/50'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-white' : 'text-[#666]'} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sync State Marker and User Profile card */}
      <div className="p-4 border-t border-[#262626] bg-[#0C0C0C] flex flex-col gap-3">
        
        {/* Sync Mode pill */}
        <div className="flex items-center justify-between p-2 rounded bg-[#111111] border border-[#262626] text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-[#A1A1A1]">
            <div className={`w-1.5 h-1.5 rounded-full ${dbSettings.useSupabase ? 'bg-indigo-500 animate-pulse' : 'bg-green-500 animate-pulse'}`} />
            <span>{dbSettings.useSupabase ? 'Cloud Nodes' : 'Local Database'}</span>
          </div>
          <span className="text-[9px] uppercase tracking-wider text-[#666] font-semibold">{dbSettings.useSupabase ? 'Cloud' : 'Local'}</span>
        </div>

        {/* User Card */}
        {authUser && (
          <div className="flex items-center justify-between p-1.5 rounded hover:bg-[#111111] border border-transparent hover:border-[#262626]/40 group transition-all">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={authUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80'}
                alt={authUser.full_name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full border border-[#262626] object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold leading-3 text-[#EDEDED] truncate">{authUser.full_name}</p>
                <span className="text-[9px] font-mono text-[#666] truncate block mt-0.5">{authUser.email}</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1 px-1.5 rounded text-[#666] hover:text-[#EDEDED] hover:bg-[#1A1A1A] transition cursor-pointer"
              title="Disconnect Terminal"
            >
              <LogOut size={12} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

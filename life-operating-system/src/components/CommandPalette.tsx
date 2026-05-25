/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Compass, Plus, Sliders, Database, HardDrive, ShieldCheck, CornerDownLeft, BookOpen } from 'lucide-react';
import { db } from '../db';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onTriggerCreate: (type: 'Portfolio' | 'Program' | 'Project' | 'Task') => void;
  onTriggerWeeklyReview: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onTriggerCreate,
  onTriggerWeeklyReview,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle outside click / escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  // Retrieve data to index
  const portfolios = db.getPortfolios();
  const programs = db.getPrograms();
  const projects = db.getProjects();
  const tasks = db.getTasks();

  // Core navigation commands
  const navigationCommands = [
    { title: 'Go to Dashboard', category: 'Navigation', icon: Compass, action: () => onNavigate('dashboard') },
    { title: 'Go to Life Categories', category: 'Navigation', icon: Sliders, action: () => onNavigate('portfolios') },
    { title: 'Go to Focus Areas & Habits', category: 'Navigation', icon: Sliders, action: () => onNavigate('programs') },
    { title: 'Go to Active Projects', category: 'Navigation', icon: Sliders, action: () => onNavigate('projects') },
    { title: 'Go to Action Tasks', category: 'Navigation', icon: Sliders, action: () => onNavigate('tasks') },
    { title: 'Go to Weekly Checklist', category: 'Navigation', icon: ShieldCheck, action: () => onNavigate('weekly-review') },
    { title: 'Go to Data Settings', category: 'Navigation', icon: Database, action: () => onNavigate('settings') },
    { title: 'Go to User Manual', category: 'Navigation', icon: BookOpen, action: () => onNavigate('manual') },
  ];

  // Action commands
  const actionCommands = [
    { title: 'Create Category', category: 'Quick Action', icon: Plus, action: () => onTriggerCreate('Portfolio') },
    { title: 'Create Focus Area or Habit', category: 'Quick Action', icon: Plus, action: () => onTriggerCreate('Program') },
    { title: 'Create Project', category: 'Quick Action', icon: Plus, action: () => onTriggerCreate('Project') },
    { title: 'Create Task', category: 'Quick Action', icon: Plus, action: () => onTriggerCreate('Task') },
    { title: 'Start Weekly Checklist', category: 'Quick Action', icon: ShieldCheck, action: () => onTriggerWeeklyReview() },
    { title: 'Load Sample Data & Clear Changes', category: 'Database', icon: HardDrive, action: () => { db.resetToDefaults(); onClose(); } },
  ];

  // Dynamic search items based on input query
  const searchRecords: any[] = [];
  if (query.trim().length > 0) {
    const normalQuery = query.toLowerCase();

    portfolios.forEach(p => {
      if (p.title.toLowerCase().includes(normalQuery) || p.description.toLowerCase().includes(normalQuery)) {
        searchRecords.push({
          title: `Category: ${p.title}`,
          subtitle: p.description,
          category: 'Categories',
          icon: Sliders,
          action: () => { onNavigate('portfolios'); onClose(); }
        });
      }
    });

    programs.forEach(pr => {
      if (pr.title.toLowerCase().includes(normalQuery) || pr.description?.toLowerCase().includes(normalQuery)) {
        searchRecords.push({
          title: `Focus Area: ${pr.title}`,
          subtitle: pr.objective,
          category: 'Focus Areas',
          icon: Sliders,
          action: () => { onNavigate('programs'); onClose(); }
        });
      }
    });

    projects.forEach(pj => {
      if (pj.title.toLowerCase().includes(normalQuery) || pj.description?.toLowerCase().includes(normalQuery)) {
        searchRecords.push({
          title: `Project: ${pj.title}`,
          subtitle: `Goal: ${pj.definition_of_done}`,
          category: 'Projects',
          icon: Sliders,
          action: () => { onNavigate('projects'); onClose(); }
        });
      }
    });

    tasks.forEach(t => {
      if (t.title.toLowerCase().includes(normalQuery) || t.notes?.toLowerCase().includes(normalQuery)) {
        searchRecords.push({
          title: `Task: ${t.title}`,
          subtitle: `Priority: ${t.priority} | Status: ${t.status}`,
          category: 'Tasks',
          icon: Sliders,
          action: () => { onNavigate('tasks'); onClose(); }
        });
      }
    });
  }

  // Combine results
  const allFilteredItems = query.trim().length === 0
    ? [...navigationCommands, ...actionCommands]
    : searchRecords.length > 0
      ? searchRecords
      : [...navigationCommands, ...actionCommands].filter(item =>
          item.title.toLowerCase().includes(query.toLowerCase())
        );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, allFilteredItems.length - 1));
      scrollIntoView(selectedIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
      scrollIntoView(selectedIndex - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allFilteredItems[selectedIndex]) {
        allFilteredItems[selectedIndex].action();
        onClose();
      }
    }
  };

  const scrollIntoView = (index: number) => {
    if (!itemsContainerRef.current) return;
    const container = itemsContainerRef.current;
    const itemEl = container.children[index] as HTMLElement;
    if (itemEl) {
      const elTop = itemEl.offsetTop;
      const elHeight = itemEl.offsetHeight;
      const containerHeight = container.offsetHeight;
      if (elTop + elHeight > container.scrollTop + containerHeight) {
        container.scrollTop = elTop + elHeight - containerHeight;
      } else if (elTop < container.scrollTop) {
        container.scrollTop = elTop;
      }
    }
  };

  return (
    <div id="command-palette-backdrop" className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh] bg-black/85 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-[#111111] border border-[#262626] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#262626] bg-[#0C0C0C]">
          <Search size={18} className="text-[#666]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search categories, projects, and tasks..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none text-white placeholder-[#666] focus:outline-none text-sm"
          />
          <div className="p-1 px-1.5 text-[10px] font-mono rounded bg-[#1A1A1A] text-[#666] border border-[#262626]">
            ESC
          </div>
        </div>

        {/* Dynamic results */}
        <div ref={itemsContainerRef} className="overflow-y-auto flex-1 max-h-[50vh] p-2.5 space-y-1 scrollbar-none select-none">
          {allFilteredItems.length === 0 ? (
            <div className="p-8 text-center text-[#666] text-xs font-mono">
              No results found.
            </div>
          ) : (
            allFilteredItems.map((item, index) => {
              const IconComp = item.icon || Sliders;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={index}
                  onClick={() => { item.action(); onClose(); }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors font-sans cursor-pointer ${
                    isSelected ? 'bg-[#1A1A1A] text-white' : 'text-[#666] hover:text-[#EDEDED]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IconComp size={16} className={`shrink-0 ${isSelected ? 'text-[#EDEDED]' : 'text-[#666]'}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{item.title}</p>
                      {item.subtitle && (
                        <p className={`text-[10px] truncate mt-0.5 font-mono ${isSelected ? 'text-[#EDEDED]/60' : 'text-[#666]'}`}>{item.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="p-0.5 px-1.5 text-[8px] font-mono tracking-wider font-semibold rounded bg-[#0C0C0C] border border-[#262626] text-[#A1A1A1] uppercase line-clamp-1">
                      {item.category || 'System'}
                    </span>
                    {isSelected && (
                      <CornerDownLeft size={12} className="text-[#A1A1A1] animate-pulse" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0C0C0C] border-t border-[#262626] flex items-center justify-between text-[10px] text-[#666] font-mono">
          <div className="flex items-center gap-2">
            <span className="p-0.5 px-1 rounded bg-[#1A1A1A] border border-[#262626] text-[#A1A1A1]">⌘K</span> / <span className="p-0.5 px-1 rounded bg-[#1A1A1A] border border-[#262626] text-[#A1A1A1]">Ctrl+K</span>
            <span>to toggle palette anywhere</span>
          </div>
          <div className="flex items-center gap-1">
            <CornerDownLeft size={10} />
            <span>Select Action</span>
          </div>
        </div>

      </div>
    </div>
  );
}

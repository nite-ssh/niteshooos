/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  Sliders,
  Layers,
  FolderLock,
  CheckSquare,
  ClipboardCheck,
  Database,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  Info,
  ChevronRight,
  Terminal,
  Activity
} from 'lucide-react';

interface UserManualViewProps {
  onNavigate: (view: string) => void;
}

export default function UserManualView({ onNavigate }: UserManualViewProps) {
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'weekly-review' | 'database' | 'faq'>('hierarchy');
  const [expandedConcept, setExpandedConcept] = useState<string | null>('domains');

  const concepts = [
    {
      id: 'domains',
      title: 'Level 1: Life Categories (Portfolios)',
      icon: Sliders,
      badge: 'LIFE CRADLE',
      description: 'The main pillars of your life. This layer divides your life into high-level categories that stay constant over time.',
      examples: 'Career & Income, Health & Fitness, Mindset & Learning, Family & Friends.',
      bestPractice: 'Try to limit yourself to 4-6 categories to avoid spreading yourself too thin. Write a simple, inspiring "Vision Statement" for each category and track its overall health on a scale of 1 to 100.',
    },
    {
      id: 'commitments',
      title: 'Level 2: Habits & Areas of Focus (Programs)',
      icon: Layers,
      badge: 'WEEKLY FOCUS',
      description: 'Continuous habit loops or responsibilities that feed into a main Life Category. These do not have a set end date; they represent things you do over and over again.',
      examples: 'Daily Cardio Routines, Weekly Brand Creation, Ongoing Language Lessons.',
      bestPractice: 'Decide what single main goal this focus area supports. Choose how often you want to review it (usually weekly) and update how well you are staying on track.',
    },
    {
      id: 'initiatives',
      title: 'Level 3: Specific Projects (Projects)',
      icon: FolderLock,
      badge: 'FINITE ACHIEVEMENTS',
      description: 'Projects with clear starting points, strict deadlines, and a solid finish line. These are short campaigns that help make your focus areas succeed.',
      examples: 'Write and publish a short guidebook, Create a website landing page, Upgrade desk or home office.',
      bestPractice: 'A project must have a clear finish line so you do not guess when it is done. Choose realistic deadlines, pick priority levels, and select the energy level needed (Low, Medium, or High).',
    },
    {
      id: 'actions',
      title: 'Level 4: Todo Checklist (Tasks)',
      icon: CheckSquare,
      badge: 'DAILY ACTION',
      description: 'The mini daily tasks and actions you check off. Tasks are the actual small steps that belong to your larger projects.',
      examples: 'Draft five headlines, Order a new extension cord, Call a provider for pricing queries.',
      bestPractice: 'Make tasks clear and doable. Instead of writing "Think about social media," write "Draft three post ideas." Enter an estimated time and write down how long it actually took you.',
    }
  ];

  const reviewSteps = [
    {
      step: 1,
      title: 'Clean Up Pending Tasks',
      desc: 'Look at tasks that are late or left over. Finish them on the spot if they take under two minutes, or reschedule/cancel them to clear your mind.',
    },
    {
      step: 2,
      title: 'Unblock Stuck Projects',
      desc: 'Look over projects that are paused or blocked. Find out what is holding them up, and create one single task to get them moving again.',
    },
    {
      step: 3,
      title: 'Update Your Habit Status',
      desc: 'Review your ongoing habits. Switch their labels to Healthy, At Risk, or Critical so you instantly know where to spend your energy next.',
    },
    {
      step: 4,
      title: 'Write Down Your Weekly Review',
      desc: 'Write a quick summary of what you learned this week. Save this review so you can easily browse your notes and see how you grow over the months.',
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#0A0A0A] p-6 sm:p-8 font-sans text-[#EDEDED] select-none">
      
      {/* Header */}
      <header className="border-b border-[#262626] pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <BookOpen size={18} className="text-[#A1A1A1]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#666]">User Manual</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">How This System Works</h2>
          <p className="text-xs text-[#666] font-mono mt-1">Simple guides and tricks. Follow this model to set up your life categories, habits, projects, and tasks.</p>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-md bg-white hover:bg-gray-200 text-black transition-all cursor-pointer"
        >
          <span>Return to Dashboard</span>
          <ArrowRight size={13} />
        </button>
      </header>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation panel for sections (1/4 width) */}
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase font-bold text-[#666] tracking-wider px-3 mb-2">Chapters</div>
          {[
            { id: 'hierarchy', label: '1. Life Organization Levels', icon: Sliders },
            { id: 'weekly-review', label: '2. Weekly Check-In Process', icon: ClipboardCheck },
            { id: 'database', label: '3. Technical Settings', icon: Database },
            { id: 'faq', label: '4. Questions & Support', icon: HelpCircle },
          ].map(chap => {
            const Icon = chap.icon;
            const isActive = activeTab === chap.id;
            return (
              <button
                key={chap.id}
                onClick={() => setActiveTab(chap.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#111111] text-white border-[#262626] font-semibold shadow-inner'
                    : 'text-[#666] hover:text-[#EDEDED] hover:bg-[#111111]/30 border-transparent'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-white' : 'text-[#666]'} />
                <span>{chap.label}</span>
              </button>
            );
          })}

          <div className="pt-6">
            <div className="p-4 bg-[#111111]/40 border border-[#262626]/60 rounded-xl space-y-3 shadow-inner">
              <div className="flex items-center gap-1.5 text-amber-500">
                <Lightbulb size={14} />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Quick Lesson</span>
              </div>
              <p className="text-[10px] text-[#666] font-mono leading-relaxed">
                "Routines outperform raw effort. By organizing small tasks inside larger projects, your brain stays empty of stress, helping you focus perfectly."
              </p>
            </div>
          </div>
        </div>

        {/* Content Panel (3/4 width) */}
        <div className="lg:col-span-3 bg-[#111111] border border-[#262626] rounded-xl p-6 min-h-[500px] shadow-sm flex flex-col justify-between">
          
          <div>
            {/* 1. HIERARCHICAL PARADIGM CHAPTER */}
            {activeTab === 'hierarchy' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-[#262626]/50 pb-4">
                  <span className="text-[10px] font-mono uppercase text-[#666] tracking-widest font-bold">Chapter 1</span>
                  <h3 className="text-base font-bold text-white mt-1">Four Levels of Organization</h3>
                  <p className="text-xs text-[#666] font-mono mt-1 leading-relaxed">
                    This planner divides your life goals into four levels. Everything is linked, meaning every daily task helps back up a larger project or life goal.
                  </p>
                </div>

                {/* Conceptual map */}
                <div className="p-4 bg-[#0A0A0A] border border-[#262626] rounded-xl font-mono text-[10px] text-center space-y-3 shadow-inner relative overflow-hidden">
                  <p className="text-zinc-500 text-[10px] absolute top-2.5 left-3 font-mono">GOAL FLOW</p>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <div className="p-2 px-3.5 rounded bg-[#111111] border border-[#262626] text-[#EDEDED] font-bold">
                      Life Categories <span className="text-[#666] block text-[8px] font-normal mt-0.5">Portfolios</span>
                    </div>
                    <ChevronRight size={14} className="text-[#666] rotate-90 sm:rotate-0" />
                    <div className="p-2 px-3.5 rounded bg-[#111111] border border-[#262626] text-[#EDEDED] font-bold">
                      Habits & Focus Area <span className="text-[#666] block text-[8px] font-normal mt-0.5">Programs</span>
                    </div>
                    <ChevronRight size={14} className="text-[#666] rotate-90 sm:rotate-0" />
                    <div className="p-2 px-3.5 rounded bg-[#111111] border border-[#262626] text-[#EDEDED] font-bold">
                      Active Projects <span className="text-[#666] block text-[8px] font-normal mt-0.5">Projects</span>
                    </div>
                    <ChevronRight size={14} className="text-[#666] rotate-90 sm:rotate-0" />
                    <div className="p-2 px-3.5 rounded bg-white text-black font-extrabold shadow-md">
                      Next-Step Tasks <span className="text-zinc-600 block text-[8px] font-bold mt-0.5">Tasks</span>
                    </div>
                  </div>
                </div>

                {/* Concepts list details */}
                <div className="space-y-3.5">
                  {concepts.map(concept => {
                    const Icon = concept.icon;
                    const isExpanded = expandedConcept === concept.id;
                    return (
                      <div
                        key={concept.id}
                        className="border border-[#262626] bg-[#0c0c0c]/40 rounded-xl overflow-hidden transition"
                      >
                        <button
                          onClick={() => setExpandedConcept(isExpanded ? null : concept.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-[#111111]/40 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#111111] border border-[#262626] text-white rounded-lg">
                              <Icon size={14} />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-[#EDEDED]">{concept.title}</h4>
                              <p className="text-[9px] font-mono text-[#666] mt-0.5 uppercase tracking-widest">{concept.badge}</p>
                            </div>
                          </div>
                          <span className="text-xs font-mono text-[#666]">
                            {isExpanded ? 'Hide info [-]' : 'Show info [+]'}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-[#262626]/40 pt-3 space-y-3 font-sans text-xs bg-[#0C0C0C]/10 text-[#A1A1A1]">
                            <p className="leading-relaxed text-[#EDEDED]">{concept.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-mono text-[10px]">
                              <div className="p-3 bg-[#0C0C0C] border border-[#262626] rounded-lg">
                                <span className="text-zinc-500 font-bold uppercase block mb-1">Examples:</span>
                                <span className="text-[#A1A1A1] leading-relaxed">{concept.examples}</span>
                              </div>
                              <div className="p-3 bg-[#0C0C0C] border border-[#262626] rounded-lg">
                                <span className="text-zinc-500 font-bold uppercase block mb-1">Best Practices:</span>
                                <span className="text-[#A1A1A1] leading-relaxed">{concept.bestPractice}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. ALIGNMENT PROTOCOLS CHAPTER */}
            {activeTab === 'weekly-review' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-[#262626]/50 pb-4">
                  <span className="text-[10px] font-mono uppercase text-[#666] tracking-widest font-bold">Chapter 2</span>
                  <h3 className="text-base font-bold text-white mt-1">Weekly Review Steps</h3>
                  <p className="text-xs text-[#666] font-mono mt-1 leading-relaxed">
                    Our energy levels rise and fall, making static to-do lists difficult to maintain. Using this step-by-step weekly checklist makes it easy to update your status, weed out old tasks, and write down your achievements.
                  </p>
                </div>

                {/* Review Pipeline details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviewSteps.map(step => (
                    <div
                      key={step.step}
                      className="p-4 bg-[#0A0A0A] border border-[#262626] rounded-xl flex items-start gap-4 shadow-inner"
                    >
                      <div className="w-6 h-6 rounded-md bg-[#111111] border border-[#262626] flex items-center justify-center font-mono font-extrabold text-[11px] text-[#A1A1A1] shrink-0">
                        {step.step}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{step.title}</h4>
                        <p className="text-[10px] text-[#666] font-mono leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-[#0C0C0C] border border-[#262626] rounded-xl space-y-3">
                  <span className="text-[10px] font-mono font-bold text-[#EDEDED] uppercase tracking-wider block">When to Do Your Review</span>
                  <p className="text-xs text-[#666] leading-relaxed">
                    We suggest running this checklist <strong className="text-white">every Sunday evening</strong> or <strong className="text-white">Friday afternoon</strong> before ending work. Logging a Review records your historical progress and lets you track your focus and memories in an interactive feed.
                  </p>
                  <button
                    onClick={() => onNavigate('weekly-review')}
                    className="flex items-center gap-1.5 text-xs text-white font-mono hover:underline font-bold"
                  >
                    <span>Start your Weekly Review checklist now</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* 3. TECHNICAL DATABASE ARCHITECTURE */}
            {activeTab === 'database' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-[#262626]/50 pb-4">
                  <span className="text-[10px] font-mono uppercase text-[#666] tracking-widest font-bold">Chapter 3</span>
                  <h3 className="text-base font-bold text-white mt-1">Data Storage & Settings</h3>
                  <p className="text-xs text-[#666] font-mono mt-1 leading-relaxed">
                    All of your planning data is stored right inside your web browser. It is quick, clean, and requires no complicated setup to start using.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-[#0A0A0A] border border-[#262626] rounded-xl space-y-3">
                    <div className="flex items-center gap-2">
                      <Terminal size={15} className="text-zinc-500" />
                      <span className="text-[10px] font-mono uppercase font-semibold text-zinc-400">Where data is saved</span>
                    </div>

                    <div className="space-y-2 text-xs text-[#666] leading-relaxed">
                      <p>
                        <strong className="text-white">Browser Cache:</strong> Your goals, projects, and habits are saved inside your browser's <code className="text-white bg-[#111111] px-1 py-0.5 rounded text-[10px] font-mono">localStorage</code>. This means they will still load instantly even if your internet disconnects.
                      </p>
                      <p>
                        <strong className="text-white">Cloud Database Option:</strong> If you are an advanced user, you can connect this app directly to a PostgreSQL database such as Supabase in the settings page to keep your items synced across devices.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#0A0A0A] border border-[#262626] rounded-xl space-y-3">
                    <span className="text-[10px] font-mono font-bold text-[#EDEDED] uppercase tracking-wider block">Connecting items together</span>
                    <p className="text-xs text-[#666] leading-relaxed">
                      This app maintains neat links between lists. For example, if you delete a Life Category, the app will automatically clean up its child habits, projects, and todo tasks so your files do not become cluttered.
                    </p>
                    <button
                      onClick={() => onNavigate('settings')}
                      className="flex items-center gap-1.5 text-xs text-white font-mono hover:underline font-bold"
                    >
                      <span>View SQL Connection Settings</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. SYSTEM SUPPORT & FAQ */}
            {activeTab === 'faq' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-[#262626]/50 pb-4">
                  <span className="text-[10px] font-mono uppercase text-[#666] tracking-widest font-bold">Chapter 4</span>
                  <h3 className="text-base font-bold text-white mt-1">Frequently Asked Questions</h3>
                  <p className="text-xs text-[#666] font-mono mt-1 leading-relaxed">
                    Quick answers to help you organize with ease and resolve common doubts.
                  </p>
                </div>

                <div className="space-y-4 text-xs font-sans">
                  <div className="p-4 bg-[#0c0c0c] border border-[#262626] rounded-lg">
                    <h4 className="font-bold text-[#EDEDED] mb-1">Q: How do I handle recurring tasks (like a weekly report or gym day)?</h4>
                    <p className="text-[#666] leading-relaxed">
                      Make these continuous Habits (Level 2). Under that Habit, you can create a monthly Project to measure your success and make a set of simple checklist items as you do them.
                    </p>
                  </div>

                  <div className="p-4 bg-[#0c0c0c] border border-[#262626] rounded-lg">
                    <h4 className="font-bold text-[#EDEDED] mb-1">Q: What do "At Risk" or "Critical" statuses mean?</h4>
                    <p className="text-[#666] leading-relaxed">
                      These are flags to help you see what needs attention. If a habit or project is behind schedule because you are too busy or blocked, mark it "Critical" to highlight it in red on your Dashboard so you know to fix it first.
                    </p>
                  </div>

                  <div className="p-4 bg-[#0c0c0c] border border-[#262626] rounded-lg">
                    <h4 className="font-bold text-[#EDEDED] mb-1">Q: Can I change my profile information?</h4>
                    <p className="text-[#666] leading-relaxed">
                      Yes! Click the button next to your name at the bottom of the sidebar to disconnect the current view. You can then write in a new name and email. Your saved items will not be deleted!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Quiz / Operational Interactive Checklist to foster learning */}
          <div className="mt-8 pt-4 border-t border-[#262626] flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-[10px] text-[#666]">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-emerald-500 shrink-0" />
              <span>Ready to add new items? Try pressing the hotkey combo <strong className="text-white">⌘K</strong> anywhere.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

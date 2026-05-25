/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClipboardCheck, ArrowLeft, ArrowRight, HelpCircle, Save } from 'lucide-react';
import { db } from '../db';
import { Task, Program, WeeklyReviewSession } from '../types';

interface WeeklyReviewViewProps {
  onNavigateToDashboard: () => void;
}

export default function WeeklyReviewView({ onNavigateToDashboard }: WeeklyReviewViewProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [reviewsHistory, setReviewsHistory] = useState<WeeklyReviewSession[]>(() => db.getReviews());

  // Wizard state parameters
  const [adjustmentsText, setAdjustmentsText] = useState('');
  const [reflectionText, setReflectionText] = useState('');
  
  const tasks = db.getTasks();
  const projects = db.getProjects();
  const programs = db.getPrograms();

  const unresolvedTasks = tasks.filter(t => t.status !== 'Done' && t.status !== 'Cancelled');
  const blockedProjects = projects.filter(p => p.status === 'Blocked' || p.status === 'Paused');

  // Inline action modifier for step 1
  const handleUpdateTaskStatus = (task: Task, nextStatus: Task['status']) => {
    db.saveTask({ ...task, status: nextStatus });
  };

  // Inline health adjust handler for step 3
  const handleAdjustProgramHealth = (program: Program, healthGrade: Program['health']) => {
    db.saveProgram({ ...program, health: healthGrade });
  };

  // Handle final submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveReview({
      review_date: new Date().toISOString().split('T')[0],
      uncompleted_tasks_reviewed_count: unresolvedTasks.length,
      health_checks_completed_count: programs.length,
      adjustments_made: adjustmentsText || 'All lists checked and updated.',
      reflection_notes: reflectionText || 'Feeling good and organized.',
    });

    // Reset wizard
    setStep(1);
    setAdjustmentsText('');
    setReflectionText('');
    setReviewsHistory(db.getReviews());
    onNavigateToDashboard();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0A0A0A] p-6 sm:p-8 font-sans text-[#EDEDED]">
      
      {/* Header */}
      <header className="border-b border-[#262626] pb-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <ClipboardCheck size={18} className="text-[#A1A1A1]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#666]">Weekly Checklist</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">My Weekly Review</h2>
          <p className="text-xs text-[#666] font-mono mt-1">A simple, friendly way to check on your tasks, find stuck projects, and set your goals.</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#666] uppercase">Steps:</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <span
                key={s}
                className={`w-5 h-5 rounded flex items-center justify-center font-bold font-mono text-[10px] ${
                  step === s ? 'bg-white text-black' : 'bg-[#0c0c0c] text-[#666] border border-[#262626]'
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEADING WIZARD SCREEN (2/3 width) */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#262626] rounded-xl p-6 shadow-sm">
          
          {/* STEP 1: TASK RE-SCHEDULING & SWEEP */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="border-b border-[#262626]/50 pb-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#666]">Step 1 of 4</p>
                <h3 className="text-sm font-semibold text-[#EDEDED] mt-1">Clean Up Unfinished Tasks</h3>
                <p className="text-xs text-[#666] mt-0.5 leading-relaxed font-mono">Look at your unfinished tasks. Mark them Done, leave them in your list for later, or Cancel them to clear your mind.</p>
              </div>

              {unresolvedTasks.length === 0 ? (
                <div className="p-8 text-center text-[#666] text-xs font-mono border border-dashed border-[#262626]/40 rounded-xl">
                  All set! You have no unfinished tasks to review right now.
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 select-none scrollbar-none">
                  {unresolvedTasks.map(task => (
                    <div
                      key={task.id}
                      className="p-3 bg-[#0C0C0C]/40 border border-[#262626] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-[#EDEDED] truncate">{task.title}</h4>
                        <span className="text-[9px] font-mono text-[#666] block mt-1 uppercase tracking-wider">
                          Priority Key: {task.priority} • Due: {task.due_date || 'No deadline'}
                        </span>
                      </div>

                      <div className="flex gap-2 shrink-0 font-mono text-[9px]">
                        <button
                          onClick={() => handleUpdateTaskStatus(task, 'Done')}
                          className="px-2.5 py-1 rounded bg-white hover:bg-gray-200 text-black font-bold transition cursor-pointer"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleUpdateTaskStatus(task, 'Cancelled')}
                          className="px-2.5 py-1 rounded border border-[#262626] hover:border-[#666] text-[#A1A1A1] hover:text-white font-bold transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step Navigation controls */}
              <div className="flex justify-end pt-4 border-t border-[#262626] mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold uppercase rounded-md bg-white hover:bg-gray-200 text-black transition cursor-pointer"
                >
                  <span>Step 2: Stuck Projects</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: BLOCKED PROJECTS & SOLUTIONS */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="border-b border-[#262626]/50 pb-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#666]">Step 2 of 4</p>
                <h3 className="text-sm font-semibold text-[#EDEDED] mt-1">Check Stuck Projects</h3>
                <p className="text-xs text-[#666] mt-0.5 leading-relaxed font-mono">Look at any projects that are paused or stuck. Think about what is holding them up and how you can get them moving.</p>
              </div>

              {blockedProjects.length === 0 ? (
                <div className="p-8 text-center text-[#666] text-xs font-mono border border-dashed border-[#262626]/40 rounded-xl">
                  Hooray! No active projects are blocked or paused.
                </div>
              ) : (
                <div className="space-y-3">
                  {blockedProjects.map(proj => (
                    <div key={proj.id} className="p-3.5 bg-[#0C0C0C]/40 border border-[#262626] rounded-lg shadow-inner">
                      <div className="flex items-center justify-between text-[9px] font-mono mb-2">
                        <span className="text-red-400 uppercase font-bold tracking-wider">{proj.status} PROJECT</span>
                        <span className="text-[#666]">DEADLINE: {proj.deadline || 'No deadline'}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{proj.title}</h4>
                      <p className="text-[10px] text-[#666] mt-1 leading-normal font-mono">Goal: {proj.definition_of_done}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation controls */}
              <div className="flex justify-between pt-4 border-t border-[#262626] mt-6 font-mono text-xs">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-[#666] hover:text-white transition cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase rounded-md bg-white hover:bg-gray-200 text-black transition cursor-pointer"
                >
                  <span>Step 3: Habit Health</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PROGRAM HEALTH AUDIT */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border-b border-[#262626]/50 pb-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#666]">Step 3 of 4</p>
                <h3 className="text-sm font-semibold text-[#EDEDED] mt-1">Check Habit & Focus Health Status</h3>
                <p className="text-xs text-[#666] mt-0.5 leading-relaxed font-mono">Look at your focus areas and habits. Update their health status based on how well you stayed consistent this week.</p>
              </div>

              <div className="space-y-3 select-none">
                {programs.map(prg => (
                  <div key={prg.id} className="p-3.5 bg-[#0C0C0C]/40 border border-[#262626] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-inner">
                    <div>
                      <h4 className="text-xs font-semibold text-[#EDEDED]">{prg.title}</h4>
                      <p className="text-[9px] font-mono text-[#666] mt-1 leading-none uppercase">Current status: {prg.health}</p>
                    </div>

                    <div className="flex gap-1.5 text-[9px] font-mono font-bold">
                      {(['Healthy', 'At Risk', 'Critical'] as const).map(g => (
                        <button
                          key={g}
                          onClick={() => handleAdjustProgramHealth(prg, g)}
                          className={`px-2.5 py-1 rounded cursor-pointer transition ${
                            prg.health === g 
                              ? 'bg-white text-black font-extrabold' 
                              : 'bg-[#0C0C0C] border border-[#262626] text-[#666] hover:text-[#A1A1A1]'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation controls */}
              <div className="flex justify-between pt-4 border-t border-[#262626] mt-6 font-mono text-xs">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1 text-[#666] hover:text-white transition cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase rounded-md bg-white hover:bg-gray-200 text-black transition cursor-pointer"
                >
                  <span>Step 4: Reflections</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REFLECTION & GLOBAL ALIGNMENT SUBMISSION */}
          {step === 4 && (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="border-b border-[#262626]/50 pb-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#666]">Step 4 of 4</p>
                <h3 className="text-sm font-semibold text-[#EDEDED] mt-1">Weekly Summary & Notes</h3>
                <p className="text-xs text-[#666] mt-0.5 leading-relaxed font-mono">Write down what went well, what adjustments you are making, and your notes for the week.</p>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Adjustments for Next Week</label>
                <textarea
                  required
                  placeholder="e.g. Pause YouTube project for a few days to focus on learning piano chords first..."
                  value={adjustmentsText}
                  onChange={(e) => setAdjustmentsText(e.target.value)}
                  className="w-full bg-[#0C0C0C] border border-[#262626] rounded-md p-3 text-xs text-[#EDEDED] placeholder-[#666] focus:outline-none focus:border-[#333] h-20 resize-none font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Weekly Reflection Notes</label>
                <textarea
                  required
                  placeholder="e.g. Energy levels were great, but need to go to bed 30 minutes earlier..."
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  className="w-full bg-[#0C0C0C] border border-[#262626] rounded-md p-3 text-xs text-[#EDEDED] placeholder-[#666] focus:outline-none focus:border-[#333] h-20 resize-none font-sans"
                />
              </div>

              {/* Navigation and Final Save Submissions */}
              <div className="flex justify-between pt-4 border-t border-[#262626] mt-6 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1 text-[#666] hover:text-white transition cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase rounded-md bg-white hover:bg-gray-200 text-black shadow transition cursor-pointer"
                >
                  <Save size={14} />
                  <span>Save Weekly Review</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* RECENT HISTORIC ARCHIVES FEED (1/3 width) */}
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="border-b border-[#262626] pb-3 mb-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#A1A1A1]">Review History</h4>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 scrollbar-none font-mono text-[10px]">
              {reviewsHistory.length === 0 ? (
                <div className="text-[10px] font-mono text-[#666] italic text-center py-8">
                  No saved reviews found under this user.
                </div>
              ) : (
                reviewsHistory.map(session => (
                  <div key={session.id} className="text-[10px] font-mono border-b border-[#262626]/40 pb-3 last:border-0 font-mono text-[10px]">
                    <div className="flex justify-between items-center text-[#A1A1A1] font-bold mb-1">
                      <span>SYNC REVIEW</span>
                      <span>{session.review_date}</span>
                    </div>
                    <div className="text-[9px] text-[#666] mb-2 font-mono">
                      uncompleted tasks reviewed: {session.uncompleted_tasks_reviewed_count}
                    </div>
                    <p className="text-[#A1A1A1] font-sans text-xs italic leading-snug">“{session.reflection_notes}”</p>
                    <p className="text-[#666] text-[9px] mt-1.5 leading-relaxed block">Adjusted: {session.adjustments_made}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#262626] mt-6 select-none">
            <div className="p-3.5 bg-[#0C0C0C]/50 rounded-lg border border-[#262626] flex items-start gap-2.5">
              <HelpCircle size={15} className="text-[#666] mt-0.5 shrink-0" />
              <p className="text-[9px] font-mono text-[#666] leading-relaxed">
                Reviewing your lists once a week is a great way to clear your head, find stuck tasks, and start the next week fresh.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

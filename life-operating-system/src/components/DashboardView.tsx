/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  Flame,
  Activity,
  Zap,
  CheckSquare
} from 'lucide-react';
import { db } from '../db';
import { Portfolio, Program, Project, Task, WeeklyReviewSession } from '../types';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onEditTask: (task: Task) => void;
  onEditProject: (project: Project) => void;
  onEditProgram: (program: Program) => void;
}

export default function DashboardView({ onNavigate, onEditTask, onEditProject, onEditProgram }: DashboardViewProps) {
  const portfolios = db.getPortfolios();
  const programs = db.getPrograms();
  const projects = db.getProjects();
  const tasks = db.getTasks();
  const reviews = db.getReviews();

  const activePrograms = programs.filter(p => p.status === 'Active');
  const criticalPrograms = programs.filter(p => p.health === 'Critical' || p.status === 'At Risk' || p.status === 'Blocked');
  const projectsAtRisk = projects.filter(p => p.status === 'Blocked' || p.status === 'Paused');
  const activeProjects = projects.filter(p => p.status === 'Active');

  // Task metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done');
  const todoTasks = tasks.filter(t => t.status === 'Todo' || t.status === 'In Progress');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueTasks = todoTasks.filter(t => t.due_date && t.due_date < todayStr);
  const todayTasks = todoTasks.filter(t => t.due_date === todayStr);

  // Completion rate calculation
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  
  // Weekly Review status trigger
  const lastReview = reviews[0];
  const daysSinceLastReview = lastReview 
    ? Math.floor((Date.now() - new Date(lastReview.completed_at).getTime()) / (1000 * 60 * 60 * 24))
    : 99;
  const reviewNeeded = daysSinceLastReview >= 7;

  // Workload density (tasks grouped by energy or context)
  const contextWorkload = todoTasks.reduce((acc, task) => {
    const ctx = task.context || 'Work';
    acc[ctx] = (acc[ctx] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentLogs = db.getActivityLogs().slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto bg-[#0A0A0A] p-6 sm:p-8 font-sans text-[#EDEDED]">
      
      {/* Executive Command Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#262626] pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Compass size={18} className="text-[#A1A1A1]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#666]">Planner Status</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">My Dashboard</h2>
          <p className="text-xs text-[#666] font-mono mt-1">A simple view of your life categories, habits, active projects, and daily tasks.</p>
        </div>

        {/* Realtime indicators */}
        <div className="flex items-center gap-6 text-[11px] font-mono border border-[#262626] p-2.5 px-4 rounded-xl bg-[#0C0C0C]/80">
          <div>
            <span className="text-[#666] block uppercase">Current Date</span>
            <span className="text-[#EDEDED] font-bold">{new Date().toISOString().slice(0, 10)}</span>
          </div>
          <div className="w-px h-6 bg-[#262626]" />
          <div>
            <span className="text-[#666] block uppercase">Weekly Checklist</span>
            <span className={`font-bold ${reviewNeeded ? 'text-red-500 animate-pulse' : 'text-[#22C55E]'}`}>
              {reviewNeeded ? 'REVIEW NEEDED' : 'UP TO DATE'}
            </span>
          </div>
        </div>
      </header>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Metric 1 */}
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#666] text-[11px] font-mono uppercase tracking-wider">
            <span>Active Focus & Habits</span>
            <Activity size={14} className="text-[#666]" />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-white">{activePrograms.length}</span>
            <span className="text-[10px] text-[#666] font-mono">/ {programs.length} Habits</span>
          </div>
          <div className="text-[10px] text-[#666] font-mono truncate">
            Staying active: <span className="text-[#22C55E] font-bold">{Math.round((activePrograms.length / (programs.length || 1)) * 100)}%</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#666] text-[11px] font-mono uppercase tracking-wider">
            <span>Stuck Projects</span>
            <AlertTriangle size={14} className="text-[#666]" />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-red-500">{projectsAtRisk.length}</span>
            <span className="text-[10px] text-[#666] font-mono">/ {projects.length} Projects</span>
          </div>
          <div className="text-[10px] text-red-400 font-mono truncate flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span>Need prompt action</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#666] text-[11px] font-mono uppercase tracking-wider">
            <span>Finished Tasks</span>
            <CheckCircle2 size={14} className="text-[#666]" />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-white">{taskCompletionRate}%</span>
            <span className="text-[10px] text-[#666] font-mono">{completedTasks.length} / {totalTasks} Done</span>
          </div>
          {/* Custom progress micro bar */}
          <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#22C55E] h-full transition-all rounded-full" style={{ width: `${taskCompletionRate}%` }} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#666] text-[11px] font-mono uppercase tracking-wider">
            <span>Overdue Tasks</span>
            <Clock size={14} className="text-[#666]" />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className={`text-2xl font-mono font-bold ${overdueTasks.length > 0 ? 'text-yellow-500' : 'text-[#666]'}`}>{overdueTasks.length}</span>
            <span className="text-[10px] text-[#A1A1A1] font-mono">Past Due</span>
          </div>
          <div className="text-[10px] text-[#666] font-mono truncate">
            {todayTasks.length} left for today.
          </div>
        </div>
      </div>

      {/* PILOT WEEKLY REVIEW ALERT */}
      {reviewNeeded && (
        <div className="mb-8 p-5 rounded-xl border border-red-500/20 bg-red-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-start gap-3">
            <AlertOctagon className="text-red-500 mt-0.5 shrink-0" size={18} />
            <div>
              <p className="text-xs font-mono uppercase tracking-wide font-bold text-red-500">Weekly Checklist Alert</p>
              <h4 className="text-sm font-semibold text-white mt-1">It is time for your weekly list update ({daysSinceLastReview} days since last review)</h4>
              <p className="text-xs text-[#A1A1A1] mt-0.5">Let's clean up old tasks, check in on how your goals are doing, and get organized for next week.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('weekly-review')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase rounded bg-white text-black hover:bg-gray-200 transition-all cursor-pointer shadow"
          >
            <span>START WEEKLY CHECKLIST</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* CORE OPERATIONAL BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: EXECUTIVE PRIORITY & TODAY VIEW (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TODAY FOCUS QUEUE */}
          <div className="bg-[#111111] border border-[#262626] rounded-xl p-5">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Flame size={15} className="text-orange-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#666]">My Focus Today</h3>
              </div>
              <button onClick={() => onNavigate('tasks')} className="text-[10px] font-mono text-[#666] hover:text-[#A1A1A1] flex items-center gap-1 cursor-pointer">
                <span>View all tasks</span>
                <ArrowRight size={10} />
              </button>
            </div>

            {todayTasks.length === 0 ? (
              <div className="p-8 text-center text-[#666] text-xs font-mono border border-dashed border-[#262626] rounded-lg">
                No active focus tasks listed for today. Write or assign tasks below.
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.slice(0, 4).map(task => {
                  const proj = projects.find(p => p.id === task.project_id);
                  return (
                    <div
                      key={task.id}
                      onClick={() => onEditTask(task)}
                      className="group flex items-center justify-between p-3.5 rounded-lg bg-[#1A1A1A] border border-[#262626] hover:border-[#333] transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-2 h-2 rounded-full ${task.priority === 'Critical' ? 'bg-red-500' : task.priority === 'High' ? 'bg-orange-500' : 'bg-[#666]'}`} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white group-hover:text-blue-400 truncate transition-colors">{task.title}</p>
                          <span className="text-[10px] font-mono text-[#666] truncate block mt-0.5 uppercase tracking-wide">
                            {proj ? proj.title : 'General Task'} • {task.context}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 text-[10px] font-mono text-[#666] shrink-0">
                        <span className="px-1.5 py-0.5 rounded bg-[#0A0A0A] border border-[#262626] text-[#A1A1A1]">{task.energy_required} Energy</span>
                        <span>{task.estimated_time} mins</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ACTIVE INITIATIVES PIPELINE (PROJECTS) */}
          <div className="bg-[#111111] border border-[#262626] rounded-xl p-5">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-[#A1A1A1]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#666]">Projects in Progress</h3>
              </div>
              <button onClick={() => onNavigate('projects')} className="text-[10px] font-mono text-[#666] hover:text-[#A1A1A1] flex items-center gap-1 cursor-pointer">
                <span>View project roadmap</span>
                <ArrowRight size={10} />
              </button>
            </div>

            {activeProjects.length === 0 ? (
              <div className="p-8 text-center text-[#666] text-xs font-mono border border-dashed border-[#262626] rounded-lg">
                No active projects listed. Create a project under the Projects tab to get going.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeProjects.slice(0, 4).map(proj => {
                  const prg = programs.find(p => p.id === proj.program_id);
                  return (
                    <div
                      key={proj.id}
                      onClick={() => onEditProject(proj)}
                      className="p-4 rounded-lg bg-[#1A1A1A] border border-[#262626] hover:border-[#333] transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-mono text-[#666] uppercase truncate max-w-[120px]">
                            {prg ? prg.title : 'General Focus'}
                          </span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold border ${
                            proj.priority === 'Critical' ? 'border-red-500/20 bg-red-500/5 text-red-400' :
                            proj.priority === 'High' ? 'border-orange-500/20 bg-orange-500/5 text-orange-400' : 'border-[#262626] bg-[#0A0A0A] text-[#A1A1A1]'
                          }`}>
                            {proj.priority}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white mt-2.5 line-clamp-1">{proj.title}</h4>
                        <p className="text-[11px] text-[#A1A1A1] mt-1 line-clamp-2 min-h-[30px] font-mono leading-relaxed">Goal: {proj.definition_of_done || 'Not specified'}</p>
                      </div>

                      <div className="mt-4 border-t border-[#262626]/40 pt-4">
                        <div className="flex items-center justify-between text-[9px] font-mono text-[#666] mb-1.5">
                          <span>Completion Pace</span>
                          <span className="text-white font-bold">{proj.progress_percentage}%</span>
                        </div>
                        <div className="w-full bg-[#0A0A0A] h-1.5 rounded-full overflow-hidden border border-[#262626]">
                          <div className="bg-[#22C55E] h-full transition-all rounded-full" style={{ width: `${proj.progress_percentage}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-mono text-[#666] mt-3">
                          <span>Target Deadline</span>
                          <span className="text-[#A1A1A1]">{proj.deadline || 'No deadline'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Column 2: STRATEGIC HEALTH & RISK (1/3 width on desktop) */}
        <div className="space-y-6">
          
          {/* STUCK OR CRITICAL ITEMS (RISK CENTER) */}
          <div className="bg-[#111111] border border-[#262626] rounded-xl p-5">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertOctagon size={15} className="text-red-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#666]">Stuck Items</h3>
              </div>
              <span className="text-[10px] font-mono text-red-500 font-bold">{criticalPrograms.length + projectsAtRisk.length} flagged</span>
            </div>

            {criticalPrograms.length === 0 && projectsAtRisk.length === 0 ? (
              <div className="p-8 text-center text-[#666] text-xs font-mono border border-dashed border-[#262626] rounded-lg">
                Awesome! No blocked or stuck items detected.
              </div>
            ) : (
              <div className="space-y-3">
                {criticalPrograms.slice(0, 3).map(prg => (
                  <div
                    key={prg.id}
                    onClick={() => onEditProgram(prg)}
                    className="p-3.5 rounded-lg border border-red-500/20 bg-red-500/5 flex flex-col justify-between cursor-pointer hover:bg-red-500/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono uppercase bg-red-500/10 text-red-400 border border-red-500/20 rounded px-1.5 py-0.5">
                        Habit/Focus Risk
                      </span>
                      <span className="text-[10px] font-mono text-[#666]">Level: {prg.risk_level}</span>
                    </div>
                    <h5 className="text-xs font-bold text-white mt-2">{prg.title}</h5>
                    <p className="text-[11px] font-mono text-[#A1A1A1] mt-1">Goal: {prg.objective}</p>
                  </div>
                ))}

                {projectsAtRisk.slice(0, 3).map(pj => (
                  <div
                    key={pj.id}
                    onClick={() => onEditProject(pj)}
                    className="p-3.5 rounded-lg border border-[#262626] bg-[#1A1A1A] flex flex-col justify-between cursor-pointer hover:border-[#333] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono uppercase bg-[#0A0A0A] text-[#A1A1A1] border border-[#262626] rounded px-1.5 py-0.5">
                        Project {pj.status}
                      </span>
                      <span className="text-[10px] font-mono text-[#666]">{pj.deadline || 'No deadline'}</span>
                    </div>
                    <h5 className="text-xs font-bold text-white mt-2">{pj.title}</h5>
                    <p className="text-[10px] font-mono text-[#666] mt-1 line-clamp-1">Goal: {pj.objective}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* WORKLOAD DISTRIBUTION (ANALYTICS SQUEEZE) */}
          <div className="bg-[#111111] border border-[#262626] rounded-xl p-5">
            <div className="border-b border-[#262626] pb-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-[#A1A1A1]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#666]">Tasks by Category</h3>
              </div>
              <span className="text-[10px] font-mono text-[#666]">{todoTasks.length} total tasks</span>
            </div>

            {Object.keys(contextWorkload).length === 0 ? (
              <div className="p-8 text-center text-[#666] text-xs font-mono border border-dashed border-[#262626] rounded-lg">
                No active tasks found in your list.
              </div>
            ) : (
              <div className="space-y-4 font-mono">
                {Object.entries(contextWorkload).map(([key, count]) => {
                  const maxCount = Math.max(...Object.values(contextWorkload));
                  const pct = Math.round((count / maxCount) * 100);
                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center text-[10px] mb-1">
                        <span className="text-[#A1A1A1] uppercase tracking-wide">{key}</span>
                        <span className="text-white text-xs font-bold">{count} tasks</span>
                      </div>
                      <div className="w-full bg-[#0A0A0A] h-2 rounded-full overflow-hidden border border-[#262626]">
                        <div className="bg-[#22C55E]/80 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* REALTIME SYSTEM AUDIT TRAIL */}
          <div className="bg-[#111111] border border-[#262626] rounded-xl p-5">
            <div className="border-b border-[#262626] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-[#A1A1A1]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#666]">Planner History Log</h3>
              </div>
            </div>

            <div className="space-y-3.5 max-h-[180px] overflow-y-auto pr-1 font-mono text-[10px]">
              {recentLogs.map(log => (
                <div key={log.id} className="text-[10px] border-b border-[#262626]/40 pb-3 last:border-b-0">
                  <div className="flex justify-between items-start text-[9px]">
                    <span className={`uppercase font-bold ${
                      log.action === 'Completed' ? 'text-green-500' :
                      log.action === 'Created' ? 'text-blue-400' : 'text-[#666]'
                    }`}>
                      {log.action}
                    </span>
                    <span className="text-[#666]">{new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="text-[#EDEDED] mt-1 font-sans font-medium line-clamp-1">{log.entity_title}</p>
                  <p className="text-[#666] text-[9px] mt-0.5 leading-relaxed">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

// Fallback in case folder icon compiles weirdly
const FoldersIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
  </svg>
);

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FolderLock, Plus, Edit3, Trash2, LayoutGrid, Kanban, Calendar, Layers, CheckSquare, AlertCircle, Timer } from 'lucide-react';
import { db } from '../db';
import { Project, Program } from '../types';

interface ProjectViewProps {
  onTriggerCreate: () => void;
  onTriggerEdit: (project: Project) => void;
  onNavigateToTasks: () => void;
}

export default function ProjectView({ onTriggerCreate, onTriggerEdit, onNavigateToTasks }: ProjectViewProps) {
  const [viewType, setViewType] = useState<'kanban' | 'roadmap' | 'hierarchy'>('kanban');
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [programFilter, setProgramFilter] = useState<string>('all');

  const programs = db.getPrograms();
  const projects = db.getProjects();
  const tasks = db.getTasks();

  const handleDelete = (id: string) => {
    db.deleteProject(id);
    setDeleteConfirmationId(null);
  };

  const filteredProjects = programFilter === 'all'
    ? projects
    : projects.filter(p => p.program_id === programFilter);

  // Kanban setup
  const STATUSES: Project['status'][] = ['Planned', 'Active', 'Blocked', 'Paused', 'Completed', 'Killed'];

  // Inline status changer
  const handleStatusChange = (project: Project, newStatus: Project['status']) => {
    db.saveProject({
      ...project,
      status: newStatus,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0A0A0A] p-6 sm:p-8 font-sans text-[#EDEDED]">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#262626] pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <FolderLock size={18} className="text-[#A1A1A1]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#666]">Active Projects</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Active Projects</h2>
          <p className="text-xs text-[#666] font-mono mt-1">Individual projects with set deadlines, goals, and checklists.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filters */}
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className="bg-[#0C0C0C] border border-[#262626] text-xs font-mono text-[#A1A1A1] rounded-md px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="all">All Focus Areas & Habits</option>
            {programs.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          {/* View Toggles */}
          <div className="flex border border-[#262626] p-0.5 rounded-lg bg-[#0C0C0C] font-mono">
            <button
              onClick={() => setViewType('kanban')}
              className={`p-1 px-2.5 text-[10px] uppercase font-bold rounded-md flex items-center gap-1.5 cursor-pointer transition ${
                viewType === 'kanban' ? 'bg-[#1A1A1A] text-white border border-[#262626]/60 shadow-sm' : 'text-[#666] hover:text-[#A1A1A1]'
              }`}
            >
              <Kanban size={10} />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewType('roadmap')}
              className={`p-1 px-2.5 text-[10px] uppercase font-bold rounded-md flex items-center gap-1.5 cursor-pointer transition ${
                viewType === 'roadmap' ? 'bg-[#1A1A1A] text-white border border-[#262626]/60 shadow-sm' : 'text-[#666] hover:text-[#A1A1A1]'
              }`}
            >
              <Calendar size={10} />
              <span>Roadmap</span>
            </button>
            <button
              onClick={() => setViewType('hierarchy')}
              className={`p-1 px-2.5 text-[10px] uppercase font-bold rounded-md flex items-center gap-1.5 cursor-pointer transition ${
                viewType === 'hierarchy' ? 'bg-[#1A1A1A] text-white border border-[#262626]/60 shadow-sm' : 'text-[#666] hover:text-[#A1A1A1]'
              }`}
            >
              <Layers size={10} />
              <span>Hierarchy</span>
            </button>
          </div>

          <button
            onClick={onTriggerCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-200 text-black text-xs font-bold uppercase rounded-md transition cursor-pointer"
          >
            <Plus size={14} />
            <span>New Project</span>
          </button>
        </div>
      </header>

      {/* Dynamic Views Rendering */}

      {/* --- KANBAN VIEW --- */}
      {viewType === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start select-none">
          {STATUSES.map(colStatus => {
            const statusProjects = filteredProjects.filter(p => p.status === colStatus);
            return (
              <div key={colStatus} className="bg-[#111111] border border-[#262626] p-3.5 rounded-xl flex flex-col min-h-[460px] shadow-sm">
                
                {/* Column header */}
                <div className="flex justify-between items-center pb-2.5 border-b border-[#262626]/60 mb-3 text-[10px] font-mono uppercase tracking-wider text-[#666]">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      colStatus === 'Active' ? 'bg-[#22C55E]' :
                      colStatus === 'Blocked' ? 'bg-red-500' :
                      colStatus === 'Paused' ? 'bg-amber-500' : 'bg-gray-600'
                    }`} />
                    <span className="font-bold text-[#A1A1A1]">{colStatus}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-[#1A1A1A] font-bold border border-[#262626] text-[#A1A1A1]">{statusProjects.length}</span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[420px] scrollbar-none pr-0.5">
                  {statusProjects.length === 0 ? (
                    <div className="p-6 text-center text-[#666] text-[10px] font-mono border border-dashed border-[#262626]/60 rounded-lg">
                      Empty
                    </div>
                  ) : (
                    statusProjects.map(proj => {
                      const prg = programs.find(p => p.id === proj.program_id);
                      const projectTasks = tasks.filter(t => t.project_id === proj.id);
                      const doneTasks = projectTasks.filter(t => t.status === 'Done').length;

                      return (
                        <div
                          key={proj.id}
                          className="bg-[#0C0C0C]/65 border border-[#262626] hover:border-[#333] p-3.5 rounded-lg transition duration-200 cursor-pointer flex flex-col justify-between group shadow-inner"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 text-[9px] font-mono text-[#666]">
                              <span className="uppercase truncate max-w-[80px]">{prg ? prg.title : 'External'}</span>
                              <span className={`px-1 rounded uppercase font-semibold ${
                                proj.priority === 'Critical' ? 'bg-red-500/10 text-red-400' :
                                proj.priority === 'High' ? 'bg-orange-500/10 text-orange-400' : 'bg-[#1A1A1A] text-[#A1A1A1]'
                              }`}>{proj.priority}</span>
                            </div>

                            <h4 className="text-[11px] font-semibold text-[#EDEDED] mt-2 line-clamp-2 leading-snug group-hover:text-white">{proj.title}</h4>
                            <p className="text-[10px] text-[#666] mt-1.5 font-mono line-clamp-2">Goal: {proj.definition_of_done || 'N/A'}</p>
                          </div>

                          {/* Progress Rate micro & Action triggers */}
                          <div className="border-t border-[#262626]/40 pt-2.5 mt-3">
                            <div className="flex items-center justify-between text-[8px] font-mono text-[#A1A1A1] mb-1">
                              <span>Tasks: {doneTasks}/{projectTasks.length}</span>
                              <span>{proj.progress_percentage}%</span>
                            </div>
                            <div className="w-full bg-[#0A0A0A] h-1 rounded-full overflow-hidden border border-[#262626]/30">
                              <div className="bg-[#EDEDED] h-full transition-all" style={{ width: `${proj.progress_percentage}%` }} />
                            </div>

                            <div className="flex items-center justify-between text-[8px] font-mono text-[#666] mt-2 group-hover:text-[#A1A1A1] transition-all">
                              <span>{proj.deadline || 'Indefinite'}</span>
                              <div className="flex gap-1.5 items-center">
                                <button
                                  onClick={(e) => { e.stopPropagation(); onTriggerEdit(proj); }}
                                  className="hover:text-white transition cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit3 size={10} />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setDeleteConfirmationId(proj.id); }}
                                  className="hover:text-red-400 transition cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- ROADMAP VIEW --- */}
      {viewType === 'roadmap' && (
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center border-b border-[#262626] pb-4 mb-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A1A1A1]">Project Timelines</h4>
            <span className="text-[10px] font-mono text-[#666]">Sorted by target deadlines</span>
          </div>

          <div className="space-y-4">
            {filteredProjects.length === 0 ? (
              <div className="p-8 text-center text-[#666] font-mono text-xs">No roadmap timelines found.</div>
            ) : (
              filteredProjects
                .sort((a,b) => new Date(a.deadline || '').getTime() - new Date(b.deadline || '').getTime())
                .map(proj => {
                  const prg = programs.find(p => p.id === proj.program_id);
                  return (
                    <div
                      key={proj.id}
                      onClick={() => onTriggerEdit(proj)}
                      className="p-4 rounded-xl border border-[#262626] bg-[#0C0C0C]/50 hover:border-[#333] cursor-pointer flex flex-col md:flex-row justify-between gap-4 transition group shadow-inner"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 font-mono text-[9px] text-[#666]">
                          <span className="uppercase">{prg ? prg.title : 'Internal'}</span>
                          <span className={`px-1.5 py-0.5 rounded ${
                            proj.status === 'Active' ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20' :
                            proj.status === 'Blocked' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-[#1A1A1A] text-[#A1A1A1] border border-[#262626]'
                          }`}>{proj.status}</span>
                        </div>

                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">{proj.title}</h4>
                        <p className="text-[10px] text-[#A1A1A1] mt-1 leading-normal font-mono">Objective: {proj.objective || 'Focus deliverables.'}</p>
                      </div>

                      {/* Timeline status timeline marker */}
                      <div className="md:w-64 font-mono text-[10px] flex flex-col justify-between shrink-0">
                        <div className="flex justify-between text-[#666] text-[9px] mb-1">
                          <span>Target Deadline</span>
                          <span className="text-[#EDEDED] font-semibold">{proj.deadline || 'IndefiniteTarget'}</span>
                        </div>

                        <div className="w-full bg-[#0A0A0A] h-2 rounded-full overflow-hidden border border-[#262626]/40">
                          <div className="bg-[#EDEDED] h-full transition-all rounded-full" style={{ width: `${proj.progress_percentage}%` }} />
                        </div>

                        <div className="flex justify-between items-center text-[8px] text-[#666] mt-2?.5">
                          <span>Progress: {proj.progress_percentage}%</span>
                          <span>Energy: {proj.energy_level_required}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* --- HIERARCHY VIEW --- */}
      {viewType === 'hierarchy' && (
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-5 shadow-sm">
          <div className="border-b border-[#262626] pb-3 mb-6 flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#A1A1A1]">Projects by Focus Area</h4>
            <span className="text-[10px] font-mono text-[#666]">Categories → Focus Areas → Projects</span>
          </div>

          <div className="space-y-6">
            {programs.map(prg => {
              const programProjects = filteredProjects.filter(p => p.program_id === prg.id);
              return (
                <div key={prg.id} className="border-l border-[#262626]/80 pl-4 ml-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="p-0.5 px-1.5 text-[8px] font-mono tracking-wider font-bold uppercase rounded bg-[#1A1A1A] text-[#A1A1A1] border border-[#262626]">
                      Focus Area
                    </span>
                    <h4 className="text-xs font-bold text-[#A1A1A1] font-mono">{prg.title}</h4>
                  </div>

                  <div className="space-y-2">
                    {programProjects.length === 0 ? (
                      <div className="text-[10px] font-mono text-[#666] pl-4 py-1 italic">
                        No projects created for this focus area yet.
                      </div>
                    ) : (
                      programProjects.map(p => (
                        <div
                          key={p.id}
                          onClick={() => onTriggerEdit(p)}
                          className="flex items-center justify-between pl-4 p-2 rounded-lg hover:bg-[#1A1A1A]/40 border border-transparent hover:border-[#262626] transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'Active' ? 'bg-[#22C55E]' : 'bg-[#666]'}`} />
                            <span className="text-xs text-[#EDEDED] font-medium truncate">{p.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#666] shrink-0">{p.progress_percentage}% completed</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Warning cascade overlay */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-[#111111] border border-[#262626] rounded-xl p-6 max-w-sm w-full text-left shadow-2xl">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-[#262626] pb-3 mb-3">
              <AlertCircle size={16} className="text-red-500" />
              <span>Delete Project and All Its Tasks?</span>
            </h4>
            <p className="text-xs text-[#A1A1A1] leading-relaxed mb-4">
              Are you sure you want to delete this project? This will also delete any tasks that belong to it.
            </p>
            <div className="p-3 bg-red-500/5 border border-red-500/20 font-mono text-[9px] text-[#red-400] uppercase tracking-widest rounded-lg mb-4">
              <span>All tasks under this project will be deleted too.</span>
            </div>
            <div className="flex justify-end gap-3 text-xs font-mono">
              <button
                onClick={() => setDeleteConfirmationId(null)}
                className="px-3 py-1.5 rounded-md hover:bg-[#1A1A1A] text-[#A1A1A1] transition cursor-pointer"
              >
                No, Keep It
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmationId)}
                className="px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-650 text-white transition font-bold cursor-pointer"
              >
                Yes, Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Portfolio, Program, Project, Task } from '../types';
import { db } from '../db';

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'Portfolio' | 'Program' | 'Project' | 'Task';
  editItem?: any | null; // if modifying existing
  prefilledParentId?: string; // e.g. prefilled program_id when adding project
}

export default function ModalForm({ isOpen, onClose, type, editItem, prefilledParentId }: ModalFormProps) {
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [portfolioData, setPortfolioData] = useState<Partial<Portfolio>>({
    title: '',
    description: '',
    vision: '',
    status: 'Active',
    health_score: 100,
  });

  const [programData, setProgramData] = useState<Partial<Program>>({
    portfolio_id: '',
    title: '',
    description: '',
    objective: '',
    owner: 'Nitesh Poudel',
    status: 'Active',
    health: 'Healthy',
    risk_level: 'Low',
    target_outcome: '',
    review_frequency: 'Weekly',
  });

  const [projectData, setProjectData] = useState<Partial<Project>>({
    program_id: '',
    title: '',
    description: '',
    objective: '',
    definition_of_done: '',
    priority: 'Medium',
    status: 'Planned',
    deadline: '',
    progress_percentage: 0,
    energy_level_required: 'Medium',
  });

  const [taskData, setTaskData] = useState<Partial<Task>>({
    project_id: '',
    title: '',
    notes: '',
    status: 'Todo',
    due_date: '',
    estimated_time: 30,
    actual_time: 0,
    energy_required: 'Medium',
    context: 'Work',
    priority: 'Medium',
  });

  const portfolios = db.getPortfolios();
  const programs = db.getPrograms();
  const projects = db.getProjects();

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (editItem) {
        if (type === 'Portfolio') setPortfolioData(editItem);
        if (type === 'Program') setProgramData(editItem);
        if (type === 'Project') setProjectData(editItem);
        if (type === 'Task') setTaskData(editItem);
      } else {
        // Defaults/Resets
        if (type === 'Portfolio') {
          setPortfolioData({
            id: 'p-' + Math.random().toString(36).substr(2, 9),
            title: '',
            description: '',
            vision: '',
            status: 'Active',
            health_score: 100,
            created_at: new Date().toISOString(),
          });
        }
        if (type === 'Program') {
          setProgramData({
            id: 'prog-' + Math.random().toString(36).substr(2, 9),
            portfolio_id: prefilledParentId || (portfolios[0]?.id || ''),
            title: '',
            description: '',
            objective: '',
            owner: 'Nitesh Poudel',
            status: 'Active',
            health: 'Healthy',
            risk_level: 'Low',
            target_outcome: '',
            review_frequency: 'Weekly',
            created_at: new Date().toISOString(),
          });
        }
        if (type === 'Project') {
          setProjectData({
            id: 'proj-' + Math.random().toString(36).substr(2, 9),
            program_id: prefilledParentId || (programs[0]?.id || ''),
            title: '',
            description: '',
            objective: '',
            definition_of_done: '',
            priority: 'Medium',
            status: 'Planned',
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2w default
            progress_percentage: 0,
            energy_level_required: 'Medium',
            created_at: new Date().toISOString(),
          });
        }
        if (type === 'Task') {
          setTaskData({
            id: 't-' + Math.random().toString(36).substr(2, 9),
            project_id: prefilledParentId || (projects[0]?.id || ''),
            title: '',
            notes: '',
            status: 'Todo',
            due_date: new Date().toISOString().split('T')[0], // today default
            estimated_time: 30,
            actual_time: 0,
            energy_required: 'Medium',
            context: 'Work',
            priority: 'Medium',
            created_at: new Date().toISOString(),
          });
        }
      }
    }
  }, [isOpen, editItem, type, prefilledParentId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (type === 'Portfolio') {
        const d = portfolioData as Portfolio;
        if (!d.title.trim()) throw new Error('Title is required');
        db.savePortfolio(d);
      } else if (type === 'Program') {
        const d = programData as Program;
        if (!d.title.trim()) throw new Error('Title is required');
        if (!d.portfolio_id) throw new Error('Portfolio domain is required');
        db.saveProgram(d);
      } else if (type === 'Project') {
        const d = projectData as Project;
        if (!d.title.trim()) throw new Error('Title is required');
        if (!d.program_id) throw new Error('Parent Program is required');
        db.saveProject(d);
      } else if (type === 'Task') {
        const d = taskData as Task;
        if (!d.title.trim()) throw new Error('Task title is required');
        if (!d.project_id) throw new Error('Parent Project is required');
        db.saveTask(d);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Validation failed');
    }
  };

  return (
    <div id="modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#111111] border border-[#262626] rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] scrollbar-none">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#262626] pb-4 mb-4 select-none">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 text-[10px] font-mono font-bold rounded bg-[#0C0C0C] border border-[#262626] text-[#A1A1A1] uppercase tracking-wider">
              {editItem ? 'Edit' : 'Create'} {type}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-[#1A1A1A] text-[#666] hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-950/20 border border-red-900/30 text-red-500 text-xs">
            <AlertCircle size={15} className="shrink-0" />
            <p className="font-mono">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* --- PORTFOLIO FORM --- */}
          {type === 'Portfolio' && (
            <>
              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Category Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Health & Fitness, Business, Personal Finance"
                  value={portfolioData.title}
                  onChange={(e) => setPortfolioData({ ...portfolioData, title: e.target.value })}
                  className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Category Description</label>
                <textarea
                  placeholder="What is this category about?"
                  value={portfolioData.description || ''}
                  onChange={(e) => setPortfolioData({ ...portfolioData, description: e.target.value })}
                  className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none h-20 resize-none transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Long-Term Vision</label>
                <textarea
                  placeholder="Where do you want to be in 5 years in this area?"
                  value={portfolioData.vision || ''}
                  onChange={(e) => setPortfolioData({ ...portfolioData, vision: e.target.value })}
                  className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none h-20 resize-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Status</label>
                  <select
                    value={portfolioData.status}
                    onChange={(e: any) => setPortfolioData({ ...portfolioData, status: e.target.value })}
                    className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition font-sans cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Health Score (1-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={portfolioData.health_score}
                    onChange={(e) => setPortfolioData({ ...portfolioData, health_score: parseInt(e.target.value) || 100 })}
                    className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition font-mono"
                  />
                </div>
              </div>
            </>
          )}

          {/* --- PROGRAM FORM --- */}
          {type === 'Program' && (
            <>
              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Parent Category</label>
                <select
                  required
                  value={programData.portfolio_id}
                  onChange={(e) => setProgramData({ ...programData, portfolio_id: e.target.value })}
                  className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition font-mono cursor-pointer"
                >
                  <option value="">-- Choose Category --</option>
                  {portfolios.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Habit or Focus Area Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daily Gym Routine, Weekly Piano Practice"
                  value={programData.title}
                  onChange={(e) => setProgramData({ ...programData, title: e.target.value })}
                  className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Area Description</label>
                <textarea
                  placeholder="What is the daily or weekly plan for this area?"
                  value={programData.description || ''}
                  onChange={(e) => setProgramData({ ...programData, description: e.target.value })}
                  className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none h-20 resize-none transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Goal or Purpose</label>
                <input
                  type="text"
                  placeholder="Why are we building this habit or focus area?"
                  value={programData.objective || ''}
                  onChange={(e) => setProgramData({ ...programData, objective: e.target.value })}
                  className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Status</label>
                  <select
                    value={programData.status}
                    onChange={(e: any) => setProgramData({ ...programData, status: e.target.value })}
                    className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Paused">Paused</option>
                    <option value="Dead">Dead (Hold)</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Health Status</label>
                  <select
                    value={programData.health}
                    onChange={(e: any) => setProgramData({ ...programData, health: e.target.value })}
                    className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition font-mono cursor-pointer"
                  >
                    <option value="Healthy">Healthy</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Risk Level</label>
                  <select
                    value={programData.risk_level}
                    onChange={(e: any) => setProgramData({ ...programData, risk_level: e.target.value })}
                    className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition font-sans cursor-pointer"
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">How Often to Review</label>
                  <select
                    value={programData.review_frequency}
                    onChange={(e: any) => setProgramData({ ...programData, review_frequency: e.target.value })}
                    className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition font-mono cursor-pointer"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Biweekly">Biweekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Final Target Outcome</label>
                <input
                  type="text"
                  placeholder="e.g. Lose 10 pounds, study 100 flashcards"
                  value={programData.target_outcome || ''}
                  onChange={(e) => setProgramData({ ...programData, target_outcome: e.target.value })}
                  className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition"
                />
              </div>
            </>
          )}

          {/* --- PROJECT FORM --- */}
          {type === 'Project' && (
            <>
              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Parent Focus Area / Habit</label>
                <select
                  required
                  value={projectData.program_id}
                  onChange={(e) => setProjectData({ ...projectData, program_id: e.target.value })}
                  className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition font-mono cursor-pointer"
                >
                  <option value="">-- Choose Focus / Habit Area --</option>
                  {programs.map((prg) => (
                    <option key={prg.id} value={prg.id}>{prg.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Learn Chopin Waltz on Piano, Build a Workout Split"
                  value={projectData.title}
                  onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                  className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Project Description</label>
                <textarea
                  placeholder="What is the short-term project about?"
                  value={projectData.description || ''}
                  onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                  className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none h-20 resize-none transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Project Goal / Standard</label>
                <input
                  type="text"
                  placeholder="e.g. Can play Waltz from memory, split posted on gym wall"
                  value={projectData.definition_of_done || ''}
                  onChange={(e) => setProjectData({ ...projectData, definition_of_done: e.target.value })}
                  className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Status</label>
                  <select
                    value={projectData.status}
                    onChange={(e: any) => setProjectData({ ...projectData, status: e.target.value })}
                    className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition font-sans cursor-pointer"
                  >
                    <option value="Planned">Planned</option>
                    <option value="Active">Active</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
                    <option value="Killed">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Priority</label>
                  <select
                    value={projectData.priority}
                    onChange={(e: any) => setProjectData({ ...projectData, priority: e.target.value })}
                    className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition font-sans cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical Path</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Due Date</label>
                  <input
                    type="date"
                    required
                    value={projectData.deadline}
                    onChange={(e) => setProjectData({ ...projectData, deadline: e.target.value })}
                    className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Energy Required</label>
                  <select
                    value={projectData.energy_level_required}
                    onChange={(e: any) => setProjectData({ ...projectData, energy_level_required: e.target.value })}
                    className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition font-sans cursor-pointer"
                  >
                    <option value="Low">Low Energy</option>
                    <option value="Medium">Medium Energy</option>
                    <option value="High">High Focus Required</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* --- TASK FORM --- */}
          {type === 'Task' && (
            <>
              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Parent Project</label>
                <select
                  required
                  value={taskData.project_id}
                  onChange={(e) => setTaskData({ ...taskData, project_id: e.target.value })}
                  className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition font-mono cursor-pointer"
                >
                  <option value="">-- Choose Project --</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>{proj.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="Write clear, actionable next step..."
                  value={taskData.title}
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                  className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Notes & Links</label>
                <textarea
                  placeholder="Specify links, references, or details..."
                  value={taskData.notes || ''}
                  onChange={(e) => setTaskData({ ...taskData, notes: e.target.value })}
                  className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none h-16 resize-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Status</label>
                  <select
                    value={taskData.status}
                    onChange={(e: any) => setTaskData({ ...taskData, status: e.target.value })}
                    className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition font-sans cursor-pointer"
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Waiting">Waiting</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Done">Done</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Priority</label>
                  <select
                    value={taskData.priority}
                    onChange={(e: any) => setTaskData({ ...taskData, priority: e.target.value })}
                    className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition font-sans cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical Path</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Estimated Time (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 30"
                    value={taskData.estimated_time || ''}
                    onChange={(e) => setTaskData({ ...taskData, estimated_time: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Actual Time Spent (Minutes)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 20"
                    value={taskData.actual_time || ''}
                    onChange={(e) => setTaskData({ ...taskData, actual_time: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Due Date</label>
                  <input
                    type="date"
                    required
                    value={taskData.due_date}
                    onChange={(e) => setTaskData({ ...taskData, due_date: e.target.value })}
                    className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#666] uppercase tracking-widest mb-1.5 font-bold">Where / Context</label>
                  <input
                    type="text"
                    placeholder="e.g. Computer, Phone, Gym, Grocery Store"
                    value={taskData.context}
                    onChange={(e) => setTaskData({ ...taskData, context: e.target.value })}
                    className="w-full bg-[#0C0C0C] border border-[#262626] focus:border-[#444] rounded-md px-3 py-2 text-xs text-white focus:outline-none transition font-mono"
                  />
                </div>
              </div>
            </>
          )}

          {/* Footer Save and Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#262626] mt-6 select-none font-mono">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#A1A1A1] hover:text-white hover:bg-[#1A1A1A] rounded-md border border-transparent text-xs font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black text-xs font-bold px-4 py-2 rounded-md shadow cursor-pointer transition font-mono uppercase"
            >
              <Save size={14} />
              <span>Save {type}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

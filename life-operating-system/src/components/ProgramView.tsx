/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, Plus, Edit3, Trash2, ShieldAlert, CheckSquare, RefreshCw } from 'lucide-react';
import { db } from '../db';
import { Program, Portfolio } from '../types';

interface ProgramViewProps {
  onTriggerCreate: () => void;
  onTriggerEdit: (program: Program) => void;
  onNavigateToProjects: () => void;
}

export default function ProgramView({ onTriggerCreate, onTriggerEdit, onNavigateToProjects }: ProgramViewProps) {
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [portfolioFilter, setPortfolioFilter] = useState<string>('all');
  
  const portfolios = db.getPortfolios();
  const programs = db.getPrograms();
  const projects = db.getProjects();

  const handleDelete = (id: string) => {
    db.deleteProgram(id);
    setDeleteConfirmationId(null);
  };

  const filteredPrograms = portfolioFilter === 'all'
    ? programs
    : programs.filter(p => p.portfolio_id === portfolioFilter);

  return (
    <div className="flex-1 overflow-y-auto bg-[#0A0A0A] p-6 sm:p-8 font-sans text-[#EDEDED]">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#262626] pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Layers size={18} className="text-[#A1A1A1]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#666]">Focus & Habits</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Focus Areas & Habits</h2>
          <p className="text-xs text-[#666] font-mono mt-1">Routines or areas of interest that you practice or check on regularly.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Portfolio filter dropdown */}
          <select
            value={portfolioFilter}
            onChange={(e) => setPortfolioFilter(e.target.value)}
            className="bg-[#0C0C0C] border border-[#262626] text-xs font-mono text-[#A1A1A1] rounded-md px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {portfolios.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          <button
            onClick={onTriggerCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-200 text-black text-xs font-bold uppercase rounded-md transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Focus Area</span>
          </button>
        </div>
      </header>

      {/* RISK MATRIX & METRIC PIPELINES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 font-mono">
        <div className="p-5 bg-[#111111] border border-[#262626] rounded-xl shadow-sm">
          <span className="text-[10px] text-[#666] uppercase tracking-wider block">Focus & Habits</span>
          <span className="block text-2xl font-bold text-white mt-1">{programs.length}</span>
        </div>
        <div className="p-5 bg-[#111111] border border-[#262626] rounded-xl shadow-sm">
          <span className="text-[10px] text-[#666] uppercase tracking-wider block">Stuck Areas</span>
          <span className={`block text-2xl font-bold mt-1 ${programs.filter(p => p.health === 'At Risk' || p.health === 'Critical').length > 0 ? 'text-red-400 font-bold' : 'text-[#666]'}`}>
            {programs.filter(p => p.health === 'Critical' || p.health === 'At Risk').length}
          </span>
        </div>
        <div className="p-5 bg-[#111111] border border-[#262626] rounded-xl shadow-sm">
          <span className="text-[10px] text-[#666] uppercase tracking-wider block">Reviewed Weekly</span>
          <span className="block text-2xl font-bold text-white mt-1">
            {programs.filter(p => p.review_frequency === 'Weekly').length} Weekly
          </span>
        </div>
        <div className="p-5 bg-[#111111] border border-[#262626] rounded-xl shadow-sm">
          <span className="text-[10px] text-[#666] uppercase tracking-wider block">Paused Areas</span>
          <span className="block text-2xl font-bold text-amber-500 mt-1">
            {programs.filter(p => p.status === 'Paused').length}
          </span>
        </div>
      </div>

      {/* PROGRAMS CARD ROADMAP LIST */}
      <div className="space-y-4">
        {filteredPrograms.length === 0 ? (
          <div className="p-12 text-center text-[#666] text-xs font-mono border border-dashed border-[#262626] rounded-lg">
            No focus areas or habits here yet. Click 'Add Focus Area' above to create one!
          </div>
        ) : (
          filteredPrograms.map((program) => {
            const domain = portfolios.find(p => p.id === program.portfolio_id);
            const activeProjects = projects.filter(prj => prj.program_id === program.id);
            
            return (
              <div
                key={program.id}
                className="group bg-[#111111] border border-[#262626] rounded-xl p-6 hover:border-[#333] transition-all flex flex-col md:flex-row justify-between gap-6 shadow-sm"
              >
                {/* Visual Metadata Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider font-bold uppercase rounded bg-[#1A1A1A] border border-[#262626] text-[#A1A1A1] line-clamp-1 max-w-[120px]">
                      {domain ? domain.title : 'Internal'}
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase flex items-center gap-1 shrink-0 ${
                      program.health === 'Healthy' ? 'text-[#22C55E]' :
                      program.health === 'At Risk' ? 'text-amber-500' : 'text-red-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        program.health === 'Healthy' ? 'bg-[#22C55E]' :
                        program.health === 'At Risk' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <span>{program.health}</span>
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-semibold text-white leading-none">{program.title}</h3>
                    
                    <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => onTriggerEdit(program)}
                        className="p-1 rounded text-[#666] hover:text-[#EDEDED] hover:bg-[#1A1A1A] transition cursor-pointer"
                        title="Edit Focus Area"
                      >
                        <Edit3 size={11} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmationId(program.id)}
                        className="p-1 rounded text-[#666] hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                        title="Delete Focus Area"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>

                  {/* Objective Outcome Indicators */}
                  <p className="text-xs text-[#A1A1A1] mt-2.5 leading-relaxed">{program.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-[10px] bg-[#0A0A0A]/55 border border-[#262626] p-3.5 rounded-lg font-mono">
                    <div>
                      <span className="text-[#666] block uppercase font-bold tracking-wider mb-0.5">Goal or Purpose</span>
                      <span className="text-[#EDEDED] font-sans text-xs">{program.objective || 'Not specified.'}</span>
                    </div>
                    <div>
                      <span className="text-[#666] block uppercase font-bold tracking-wider mb-0.5">Target Outcome</span>
                      <span className="text-[#EDEDED] font-sans text-xs">{program.target_outcome || 'Not specified.'}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Widgets (Status bars + Controls) */}
                <div className="md:w-64 flex flex-col justify-between shrink-0 border-t md:border-t-0 md:border-l border-[#262626] pt-4 md:pt-0 md:pl-6">
                  
                  <div className="space-y-2 text-[10px] font-mono leading-tight">
                    <div className="flex justify-between">
                      <span className="text-[#666] uppercase">Status</span>
                      <span className={`font-bold uppercase ${
                        program.status === 'Active' ? 'text-white' :
                        program.status === 'Blocked' ? 'text-red-400 font-bold' : 'text-[#666]'
                      }`}>{program.status}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#666] uppercase">Risk Level</span>
                      <span className="text-[#EDEDED] font-bold">{program.risk_level}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#666] uppercase">Review Schedule</span>
                      <span className="text-[#A1A1A1] flex items-center gap-1">
                        <RefreshCw size={10} />
                        <span>{program.review_frequency}</span>
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-t border-[#262626]/40 pt-2.5 mt-2">
                      <span className="text-[#666] uppercase">Active Projects</span>
                      <button 
                        onClick={onNavigateToProjects}
                        className="text-[#EDEDED] font-bold hover:underline cursor-pointer"
                      >
                        {activeProjects.length} projects
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-2">
                    <button
                      onClick={onNavigateToProjects}
                      className="w-full flex items-center justify-between p-2 rounded-md bg-[#1A1A1A] border border-[#262626] hover:bg-[#262626]/40 hover:text-white text-xs font-mono text-[#A1A1A1] transition cursor-pointer"
                    >
                      <span>View Projects</span>
                      <CheckSquare size={13} className="text-[#666]" />
                    </button>
                  </div>
                </div>

                {/* Cascade Warning Overlays */}
                {deleteConfirmationId === program.id && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#111111] border border-[#262626] rounded-xl p-6 max-w-sm w-full font-sans text-left shadow-2xl">
                      <h4 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-[#262626] pb-3 mb-3">
                        <ShieldAlert size={16} className="text-red-500" />
                        <span>Delete Focus Area and All Its Projects?</span>
                      </h4>
                      <p className="text-xs text-[#A1A1A1] leading-relaxed mb-4">
                        Deleting the focus area <strong className="text-white">“{program.title}”</strong> is permanent and will delete everything inside it:
                      </p>
                      <div className="p-3 bg-red-500/5 border border-red-500/20 font-mono text-[9px] text-red-400 uppercase tracking-widest rounded-lg mb-4 space-y-1">
                        <div className="flex justify-between"><span>Projects inside:</span> <span className="font-bold">WILL BE DELETED</span></div>
                        <div className="flex justify-between"><span>Tasks inside:</span> <span className="font-bold">WILL BE DELETED</span></div>
                      </div>
                      <div className="flex justify-end gap-3 text-xs font-mono">
                        <button
                          onClick={() => setDeleteConfirmationId(null)}
                          className="px-3 py-1.5 rounded-md hover:bg-[#1A1A1A] text-[#A1A1A1] transition cursor-pointer"
                        >
                          No, Keep It
                        </button>
                        <button
                          onClick={() => handleDelete(program.id)}
                          className="px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-650 text-white transition font-bold cursor-pointer"
                        >
                          Yes, Delete Focus Area
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

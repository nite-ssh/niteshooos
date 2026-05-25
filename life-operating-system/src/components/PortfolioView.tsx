/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sliders, Plus, Edit3, Trash2, Shield, Eye, Compass, Anchor, LayoutGrid, Heart } from 'lucide-react';
import { db } from '../db';
import { Portfolio, Program } from '../types';

interface PortfolioViewProps {
  onTriggerCreate: () => void;
  onTriggerEdit: (portfolio: Portfolio) => void;
  onNavigateToPrograms: () => void;
}

export default function PortfolioView({ onTriggerCreate, onTriggerEdit, onNavigateToPrograms }: PortfolioViewProps) {
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  
  const portfolios = db.getPortfolios();
  const programs = db.getPrograms();

  const handleDelete = (id: string) => {
    db.deletePortfolio(id);
    setDeleteConfirmationId(null);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0A0A0A] p-6 sm:p-8 font-sans text-[#EDEDED]">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#262626] pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sliders size={18} className="text-[#A1A1A1]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#666]">My Life OS</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Life Categories</h2>
          <p className="text-xs text-[#666] font-mono mt-1">Broad areas of your life that you want to prioritize and focus on.</p>
        </div>

        <button
          onClick={onTriggerCreate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-200 text-black text-xs font-bold uppercase rounded-md transition cursor-pointer"
        >
          <Plus size={14} />
          <span>New Category</span>
        </button>
      </header>

      {/* CORE STATS MATRIX FOR PORTFOLIOS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 font-mono">
        <div className="p-5 bg-[#111111] border border-[#262626] rounded-xl shadow-sm">
          <span className="text-[10px] text-[#666] uppercase tracking-wider block">Created Categories</span>
          <span className="block text-2xl font-bold text-white mt-1">{portfolios.length}</span>
        </div>
        <div className="p-5 bg-[#111111] border border-[#262626] rounded-xl shadow-sm">
          <span className="text-[10px] text-[#666] uppercase tracking-wider block">Average Health</span>
          <span className="block text-2xl font-bold text-[#22C55E] mt-1">
            {portfolios.length > 0 
              ? Math.round(portfolios.reduce((sum, p) => sum + p.health_score, 0) / portfolios.length)
              : 0}%
          </span>
        </div>
        <div className="p-5 bg-[#111111] border border-[#262626] rounded-xl shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-[#666] uppercase tracking-wider block">Active Habits</span>
          <span className="block text-xs font-medium text-[#A1A1A1] mt-1.5 truncate">
            {programs.length} habits or routines set up
          </span>
        </div>
      </div>

      {/* CARDS LISTING WITH RELATIONAL COUNTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portfolios.map((portfolio) => {
          const domainPrograms = programs.filter(p => p.portfolio_id === portfolio.id);
          const activeDomainProgCount = domainPrograms.filter(p => p.status === 'Active').length;
          
          return (
            <div
              key={portfolio.id}
              className="group bg-[#111111] border border-[#262626] rounded-xl p-6 hover:border-[#333] transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* Visual Accent Title */}
                <div className="flex items-start justify-between border-b border-[#262626] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1 px-2 text-[10px] font-mono rounded bg-[#1A1A1A] text-[#A1A1A1] uppercase tracking-wider font-semibold border border-[#262626]">
                      Category
                    </div>
                    <h3 className="text-sm font-semibold text-white leading-none">{portfolio.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onTriggerEdit(portfolio)}
                      className="p-1 rounded text-[#666] hover:text-[#EDEDED] hover:bg-[#1A1A1A] transition cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmationId(portfolio.id)}
                      className="p-1 rounded text-[#666] hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Scope Metadata */}
                <div className="my-4 font-sans">
                  <p className="text-xs text-[#A1A1A1] leading-relaxed font-normal">{portfolio.description}</p>
                </div>

                {/* Core Vision Lock (Second Brain GTD) */}
                {portfolio.vision && (
                  <div className="border border-[#262626] bg-[#0A0A0A]/55 p-3 rounded-lg mb-4 font-mono">
                    <span className="text-[9px] uppercase text-[#666] leading-none block tracking-widest font-bold">Long-Term Vision</span>
                    <p className="text-[11px] text-[#A1A1A1] mt-1 leading-normal italic font-sans flex items-start gap-1">
                      <span>“</span>
                      <span>{portfolio.vision}</span>
                      <span>”</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Resource Allocation Footer Indicators */}
              <div className="border-t border-[#262626]/60 pt-4 mt-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#A1A1A1]">
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <span className="text-[#666] block text-[9px] uppercase tracking-wide">Focus Areas & Habits</span>
                      <button 
                        onClick={onNavigateToPrograms} 
                        className="text-[#EDEDED] font-bold hover:underline cursor-pointer"
                      >
                        {domainPrograms.length} added ({activeDomainProgCount} active)
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[#666] block text-[9px] uppercase tracking-wide">Category Health</span>
                    <span className={`font-bold text-xs ${
                      portfolio.health_score >= 85 ? 'text-[#22C55E]' :
                      portfolio.health_score >= 70 ? 'text-amber-500' : 'text-red-400'
                    }`}>
                      {portfolio.health_score}%
                    </span>
                  </div>
                </div>

                {/* Health progress bar line */}
                <div className="w-full bg-[#0A0A0A] h-1.5 rounded-full overflow-hidden mt-3 border border-[#262626]/40">
                  <div 
                    className={`h-full transition-all rounded-full ${
                      portfolio.health_score >= 85 ? 'bg-[#22C55E]' :
                      portfolio.health_score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${portfolio.health_score}%` }} 
                  />
                </div>
              </div>

              {/* Cascade Delete Modal Warning overlays */}
              {deleteConfirmationId === portfolio.id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
                  <div className="bg-[#111111] border border-[#262626] rounded-xl p-6 max-w-sm w-full font-sans text-left shadow-2xl">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-[#262626] pb-3 mb-3">
                      <Trash2 size={16} className="text-red-500" />
                      <span>Delete Category and All Its Content?</span>
                    </h4>
                    <p className="text-xs text-[#A1A1A1] leading-relaxed mb-4">
                      Warning: Deleting the category <strong className="text-[#EDEDED]">“{portfolio.title}”</strong> is permanent and will delete everything inside it:
                    </p>
                    <div className="p-3 bg-red-500/5 border border-red-500/20 font-mono text-[9px] text-red-400 uppercase tracking-widest rounded-lg mb-4 space-y-1">
                      <div className="flex justify-between"><span>Focus areas & Habits:</span> <span className="font-bold">WILL BE DELETED</span></div>
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
                        onClick={() => handleDelete(portfolio.id)}
                        className="px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-650 text-white transition font-bold cursor-pointer"
                      >
                        Yes, Delete Everything
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}

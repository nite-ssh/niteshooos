/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  CheckSquare,
  Plus,
  Edit3,
  Trash2,
  List,
  Kanban,
  Calendar as CalendarIcon,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  ChevronDown,
  Clock,
  Eye,
  Bookmark,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { db } from '../db';
import { Task, Project } from '../types';

interface TaskViewProps {
  onTriggerCreate: () => void;
  onTriggerEdit: (task: Task) => void;
}

export default function TaskView({ onTriggerCreate, onTriggerEdit }: TaskViewProps) {
  const [viewType, setViewType] = useState<'list' | 'kanban' | 'calendar' | 'focus'>('list');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [energyFilter, setEnergyFilter] = useState<string>('all');
  
  // Focus Mode Specific State
  const [focusEnergy, setFocusEnergy] = useState<'all' | 'Low' | 'Medium' | 'High'>('all');
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const projects = db.getProjects();
  const tasks = db.getTasks();

  const handleDelete = (id: string) => {
    db.deleteTask(id);
  };

  // Checkbox toggle
  const handleToggleComplete = (task: Task) => {
    const nextStatus = task.status === 'Done' ? 'Todo' : 'Done';
    db.saveTask({
      ...task,
      status: nextStatus as any,
    });
  };

  // Inline status modifier
  const handleUpdateStatus = (task: Task, nextStatus: Task['status']) => {
    db.saveTask({
      ...task,
      status: nextStatus,
    });
  };

  // Filters application
  const filteredTasks = tasks.filter(task => {
    const matchesQuery = task.title.toLowerCase().includes(query.toLowerCase()) || 
                         (task.notes && task.notes.toLowerCase().includes(query.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesEnergy = energyFilter === 'all' || task.energy_required === energyFilter;

    return matchesQuery && matchesStatus && matchesPriority && matchesEnergy;
  });

  // Focus mode filtering (filter out Done and matching energy)
  const focusTasks = tasks.filter(t => {
    if (t.status === 'Done' || t.status === 'Cancelled') return false;
    if (focusEnergy !== 'all' && t.energy_required !== focusEnergy) return false;
    return true;
  }).sort((a, b) => {
    const priorityWeight = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
  });

  // Timer runner logic
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(sec => {
          if (sec === 0) {
            setTimerMinutes(min => {
              if (min === 0) {
                // Timer complete
                setIsTimerRunning(false);
                if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                // Alert/notification
                alert('Focus time is up! Great job. Take a short break or start another task.');
                return 25;
              }
              return min - 1;
            });
            return 59;
          }
          return sec - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerMinutes(25);
    setTimerSeconds(0);
  };

  // Kanban definitions
  const KANBAN_COLUMNS: Task['status'][] = ['Todo', 'In Progress', 'Waiting', 'Blocked', 'Done', 'Cancelled'];

  // Basic Calendar matrix generation for current Month (May 2026)
  const daysInMay = 31;
  const calendarDays = Array.from({ length: daysInMay }, (_, i) => i + 1);

  return (
    <div className="flex-1 overflow-y-auto bg-[#0A0A0A] p-6 sm:p-8 font-sans text-[#EDEDED]">
      
      {/* Header section with tab switcher */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#262626] pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <CheckSquare size={18} className="text-[#A1A1A1]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#666]">Action Tasks</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Action Tasks</h2>
          <p className="text-xs text-[#666] font-mono mt-1">The master list of your daily tasks and to-do items.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          {/* Main View select tabs */}
          <div className="flex border border-[#262626] p-0.5 rounded-lg bg-[#0C0C0C] font-mono text-[10px]">
            <button
              onClick={() => setViewType('list')}
              className={`p-1 px-2.5 uppercase font-bold rounded-md flex items-center gap-1.5 cursor-pointer transition ${
                viewType === 'list' ? 'bg-[#1A1A1A] text-white border border-[#262626]/60 shadow-sm' : 'text-[#666] hover:text-[#A1A1A1]'
              }`}
            >
              <List size={10} />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewType('kanban')}
              className={`p-1 px-2.5 uppercase font-bold rounded-md flex items-center gap-1.5 cursor-pointer transition ${
                viewType === 'kanban' ? 'bg-[#1A1A1A] text-white border border-[#262626]/60 shadow-sm' : 'text-[#666] hover:text-[#A1A1A1]'
              }`}
            >
              <Kanban size={10} />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewType('calendar')}
              className={`p-1 px-2.5 uppercase font-bold rounded-md flex items-center gap-1.5 cursor-pointer transition ${
                viewType === 'calendar' ? 'bg-[#1A1A1A] text-white border border-[#262626]/60 shadow-sm' : 'text-[#666] hover:text-[#A1A1A1]'
              }`}
            >
              <CalendarIcon size={10} />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setViewType('focus')}
              className={`p-1 px-2.5 uppercase font-bold rounded-md flex items-center gap-1.5 cursor-pointer transition ${
                viewType === 'focus' ? 'bg-red-500/10 text-red-400 border border-red-500/20 font-extrabold' : 'text-[#666] hover:text-red-400'
              }`}
            >
              <Timer size={10} />
              <span>Focus Mode</span>
            </button>
          </div>

          <button
            onClick={onTriggerCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-200 text-black text-xs font-bold uppercase rounded-md transition cursor-pointer"
          >
            <Plus size={14} />
            <span>New Task</span>
          </button>
        </div>
      </header>

      {/* SEARCH AND FILTERS (hides in FOCUS mode to reduce sensory noise) */}
      {viewType !== 'focus' && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6 font-mono text-xs">
          <input
            type="text"
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#0C0C0C] border border-[#262626] rounded-md px-3 py-1.5 text-white placeholder-[#666] focus:outline-none focus:border-[#333]"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0C0C0C] border border-[#262626] rounded-md px-3 py-1.5 text-[#A1A1A1] focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {KANBAN_COLUMNS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#0C0C0C] border border-[#262626] rounded-md px-3 py-1.5 text-[#A1A1A1] focus:outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical Path</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={energyFilter}
            onChange={(e) => setEnergyFilter(e.target.value)}
            className="bg-[#0C0C0C] border border-[#262626] rounded-md px-3 py-1.5 text-[#A1A1A1] focus:outline-none cursor-pointer"
          >
            <option value="all">All Energy Levels</option>
            <option value="Low">Low Energy</option>
            <option value="Medium">Medium Energy</option>
            <option value="High">High Energy</option>
          </select>
        </div>
      )}

      {/* --- STANDARD LIST VIEW --- */}
      {viewType === 'list' && (
        <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden select-none shadow-sm">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-[#666] text-xs font-mono border-dashed border border-[#262626] rounded-xl m-4">
              No tasks found matching these filters. Click 'New Task' to add one!
            </div>
          ) : (
            <div className="divide-y divide-[#262626]/40">
              {filteredTasks.map(task => {
                const proj = projects.find(p => p.id === task.project_id);
                const isCompleted = task.status === 'Done';
                return (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 px-5 hover:bg-[#1A1A1A]/40 transition-colors gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        onClick={() => handleToggleComplete(task)}
                        className={`mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                          isCompleted ? 'bg-white border-white text-black' : 'border-[#262626] hover:border-[#666] bg-transparent'
                        }`}
                      >
                        {isCompleted && <CheckCircle size={11} strokeWidth={3} className="text-black fill-current" />}
                      </button>

                      <div className="min-w-0" onClick={() => onTriggerEdit(task)}>
                        <h4 className={`text-xs font-medium cursor-pointer ${isCompleted ? 'line-through text-[#666]' : 'text-[#EDEDED] hover:text-white'}`}>
                          {task.title}
                        </h4>
                        {task.notes && (
                          <p className="text-[10px] text-[#666] font-mono leading-normal mt-0.5 line-clamp-1">{task.notes}</p>
                        )}
                        <span className="text-[9px] font-mono text-[#666] mt-1 block uppercase tracking-wider">
                          {proj ? proj.title : 'Single Task'} • {task.context}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 shrink-0 font-mono text-[9px] text-[#666]">
                      <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                        task.status === 'In Progress' ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20' :
                        task.status === 'Done' ? 'bg-[#1A1A1A] text-[#666]' : 'bg-transparent text-[#A1A1A1]'
                      }`}>{task.status}</span>

                      <span className={`px-1 rounded uppercase font-bold ${
                        task.priority === 'Critical' ? 'text-red-400' :
                        task.priority === 'High' ? 'text-orange-400' : 'text-[#666]'
                      }`}>{task.priority}</span>

                      <span className="px-1.5 py-0.5 bg-[#0C0C0C] border border-[#262626] rounded text-[#A1A1A1]">{task.estimated_time}m estimate</span>
                      {task.due_date && <span className="text-[#A1A1A1] flex items-center gap-1"><Clock size={10} /> {task.due_date}</span>}

                      <div className="flex gap-1">
                        <button onClick={() => onTriggerEdit(task)} className="p-1 hover:text-white transition cursor-pointer">
                          <Edit3 size={11} />
                        </button>
                        <button onClick={() => handleDelete(task.id)} className="p-1 hover:text-red-400 transition cursor-pointer">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* --- KANBAN BOARD VIEW --- */}
      {viewType === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start select-none">
          {KANBAN_COLUMNS.map(colStatus => {
            const colTasks = filteredTasks.filter(t => t.status === colStatus);
            return (
              <div key={colStatus} className="bg-[#111111] border border-[#262626] p-3.5 rounded-xl flex flex-col min-h-[420px] shadow-sm">
                
                <div className="flex justify-between items-center pb-2 border-b border-[#262626]/50 mb-3 text-[10px] font-mono text-[#666] uppercase font-bold tracking-wider">
                  <span>{colStatus}</span>
                  <span className="px-1.5 py-0.5 bg-[#1A1A1A] rounded border border-[#262626] text-[#A1A1A1]">{colTasks.length}</span>
                </div>

                <div className="space-y-2 flex-1 max-h-[360px] overflow-y-auto scrollbar-none pr-0.5">
                  {colTasks.length === 0 ? (
                    <div className="p-4 text-center text-[#666] text-[10px] font-mono border border-dashed border-[#262626]/40 rounded-lg">
                      Empty
                    </div>
                  ) : (
                    colTasks.map(task => {
                      const proj = projects.find(p => p.id === task.project_id);
                      return (
                        <div
                          key={task.id}
                          className="bg-[#0C0C0C]/50 border border-[#262626] hover:border-[#333] p-3 rounded-lg transition duration-200 cursor-pointer text-left group shadow-inner"
                        >
                          <div className="flex justify-between items-start gap-1 font-mono text-[8px] text-[#666]">
                            <span className="truncate max-w-[80px] uppercase">{proj ? proj.title : 'Internal'}</span>
                            <span className={task.priority === 'Critical' ? 'text-red-400 font-bold' : ''}>{task.priority}</span>
                          </div>
                          
                          <h4 
                            onClick={() => onTriggerEdit(task)}
                            className="text-[10px] font-medium text-[#EDEDED] group-hover:text-white mt-1 line-clamp-2 leading-snug"
                          >
                            {task.title}
                          </h4>

                          <div className="border-t border-[#262626]/40 pt-2 mt-2 flex items-center justify-between text-[8px] font-mono text-[#666]">
                            <span>{task.due_date || 'No Date'}</span>
                            <div className="flex gap-2">
                              {/* Simple status move buttons to mock Kanban dragging */}
                              <button
                                onClick={() => handleUpdateStatus(task, colStatus === 'Todo' ? 'In Progress' : colStatus === 'In Progress' ? 'Done' : 'Todo')}
                                className="hover:text-white text-[#A1A1A1] underline cursor-pointer"
                              >
                                {colStatus === 'Todo' ? 'Start' : colStatus === 'In Progress' ? 'Complete' : 'Reopen'}
                              </button>
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

      {/* --- MONTHLY CALENDAR VIEW --- */}
      {viewType === 'calendar' && (
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-5 shadow-sm">
          <div className="border-b border-[#262626] pb-3 mb-4 flex justify-between items-center font-mono">
            <h4 className="text-xs font-bold uppercase text-[#A1A1A1]">Deadlines for May 2026</h4>
            <span className="text-[10px] text-[#666]">Organized by due date</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Week days label */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(wd => (
              <div key={wd} className="text-center font-mono text-[9px] uppercase font-bold text-[#666] border-b border-[#262626] pb-2">
                {wd}
              </div>
            ))}

            {/* Calendar numbers with filter matching tasks inline */}
            {calendarDays.map(day => {
              const dayStr = `2026-05-${day < 10 ? '0' + day : day}`;
              const dayTasks = tasks.filter(t => t.due_date === dayStr);

              return (
                <div key={day} className="bg-[#0C0C0C]/40 border border-[#262626]/60 p-2 min-h-[75px] rounded-lg flex flex-col justify-between shadow-inner">
                  <span className="text-[9px] font-mono font-bold text-[#666]">{day}</span>
                  
                  <div className="space-y-1 mt-1 max-h-[50px] overflow-y-auto scrollbar-none">
                    {dayTasks.map(t => (
                      <div
                        key={t.id}
                        onClick={() => onTriggerEdit(t)}
                        className="text-[8px] font-sans px-1 py-0.5 rounded bg-[#111111] border border-[#262626] text-[#EDEDED] truncate cursor-pointer hover:border-[#444] line-clamp-1 transition"
                        title={t.title}
                      >
                        {t.status === 'Done' ? '✓ ' : ''}{t.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- EXECUTION FOCUS MODE --- */}
      {viewType === 'focus' && (
        <div className="max-w-xl mx-auto space-y-6">
          
          {/* SENSORY DISTRACTION CONTROL BOX */}
          <div className="bg-[#111111] border border-[#262626] rounded-xl p-6 text-center select-none shadow-sm">
            
            {/* Energy Match Selectors */}
            <div className="flex justify-center items-center gap-2.5 mb-6 text-xs font-mono">
              <span className="text-[#666]">Energy level:</span>
              <div className="flex border border-[#262626] rounded-lg bg-[#0C0C0C] p-0.5 font-bold">
                {(['all', 'Low', 'Medium', 'High'] as const).map(eng => (
                  <button
                    key={eng}
                    onClick={() => setFocusEnergy(eng)}
                    className={`px-2.5 py-1 text-[10px] rounded-md uppercase cursor-pointer transition ${
                      focusEnergy === eng ? 'bg-[#1A1A1A] text-white font-extrabold border border-[#262626]/60' : 'text-[#666] hover:text-[#A1A1A1]'
                    }`}
                  >
                    {eng}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro Deep Work Timer */}
            <div className="my-8 font-mono">
              <div className="text-5xl font-extrabold tracking-widest text-[#EDEDED] flex justify-center items-center gap-1">
                <span>{timerMinutes < 10 ? '0' + timerMinutes : timerMinutes}</span>
                <span className="animate-pulse">:</span>
                <span>{timerSeconds < 10 ? '0' + timerSeconds : timerSeconds}</span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-[#666] font-bold block mt-3">Focus Timer</span>
            </div>

            {/* Timer Controllers */}
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`p-2 px-5 rounded-full flex items-center gap-1.5 text-xs font-mono font-bold uppercase shadow-sm cursor-pointer transition ${
                  isTimerRunning 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                    : 'bg-white hover:bg-gray-200 text-black'
                }`}
              >
                {isTimerRunning ? <Pause size={12} strokeWidth={2.5} /> : <Play size={12} strokeWidth={2.5} />}
                <span>{isTimerRunning ? 'Pause Timer' : 'Start Timer'}</span>
              </button>

              <button
                onClick={resetTimer}
                className="p-2 border border-[#262626] rounded-full text-[#A1A1A1] hover:text-[#EDEDED] hover:bg-[#1A1A1A] transition cursor-pointer"
                title="Reset Focus Timer"
              >
                <RotateCcw size={12} />
              </button>
            </div>

          </div>

          {/* FOCUS ACTION CHANNELS (QUEUE) */}
          <div className="bg-[#111111] border border-[#262626] rounded-xl p-5 shadow-sm">
            <div className="border-b border-[#262626] pb-3 mb-4 flex justify-between items-center font-mono">
              <span className="text-xs font-bold uppercase text-red-400 tracking-wider">Up Next (Top 3 Priority Tasks)</span>
              <span className="text-[10px] text-[#666]">{focusTasks.length} left</span>
            </div>

            {focusTasks.length === 0 ? (
              <div className="p-8 text-center text-[#666] text-xs font-mono border border-dashed border-[#262626]/60 rounded-xl">
                All done! Go ahead and choose another energy level or take a break.
              </div>
            ) : (
              <div className="space-y-2 select-none">
                {focusTasks.slice(0, 3).map((task, idx) => {
                  const proj = projects.find(p => p.id === task.project_id);
                  return (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-lg bg-[#0C0C0C]/40 border border-[#262626] flex items-center justify-between gap-4 cursor-pointer hover:border-[#333] transition-all shadow-inner"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className="mt-0.5 shrink-0 w-4 h-4 rounded border border-[#262626] hover:border-[#666] bg-transparent flex items-center justify-center text-[#EDEDED] cursor-pointer"
                        >
                          {/* empty box trigger */}
                        </button>
                        
                        <div className="min-w-0">
                          <h4 
                            onClick={() => onTriggerEdit(task)}
                            className="text-xs font-semibold text-[#EDEDED] hover:text-white"
                          >
                            {task.title}
                          </h4>
                          {task.notes && (
                            <p className="text-[10px] text-[#666] leading-normal mt-1 max-w-sm line-clamp-2">{task.notes}</p>
                          )}
                          <span className="text-[8px] font-mono text-[#666] block uppercase tracking-wider mt-1.5">
                            {proj ? proj.title : 'Internal'} • Priority: {task.priority}
                          </span>
                        </div>
                      </div>

                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-md bg-[#1A1A1A] border border-[#262626] text-[#A1A1A1] shrink-0">
                        {task.energy_required} Focus
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}

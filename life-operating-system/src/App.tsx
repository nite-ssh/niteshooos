/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import PortfolioView from './components/PortfolioView';
import ProgramView from './components/ProgramView';
import ProjectView from './components/ProjectView';
import TaskView from './components/TaskView';
import WeeklyReviewView from './components/WeeklyReviewView';
import DbSettings from './components/DbSettings';
import UserManualView from './components/UserManualView';
import AuthScreen from './components/AuthScreen';
import CommandPalette from './components/CommandPalette';
import ModalForm from './components/ModalForm';
import { db } from './db';
import { UserProfile, DbConnectionSettings, Task, Project, Program, Portfolio } from './types';

export default function App() {
  const [authUser, setAuthUser] = useState<UserProfile | null>(() => db.getAuthUser());
  const [dbSettings, setDbSettings] = useState<DbConnectionSettings>(() => db.getSettings());
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Modal manager states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'Portfolio' | 'Program' | 'Project' | 'Task'>('Task');
  const [editItem, setEditItem] = useState<any | null>(null);
  const [prefilledParentId, setPrefilledParentId] = useState<string | undefined>(undefined);

  // Command Palette toggler
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Simple state update ticks to re-fetch on database changes
  const [updateTick, setUpdateTick] = useState(0);

  useEffect(() => {
    // Listen to localStorage database changes and force a React re-render
    const unsubscribe = db.onChange(() => {
      setUpdateTick(tick => tick + 1);
      setAuthUser(db.getAuthUser());
      setDbSettings(db.getSettings());
    });
    return () => unsubscribe();
  }, []);

  // Global command palette hotkey (cmd+k / ctrl+k)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Logins, Logouts
  const handleAuthSuccess = (email: string, fullName: string) => {
    setAuthUser(db.getAuthUser());
  };

  const handleLogout = () => {
    db.logout();
    setAuthUser(null);
  };

  const handleSaveSettings = (nextSettings: DbConnectionSettings) => {
    db.saveSettings(nextSettings);
  };

  const triggerCreateEntity = (type: 'Portfolio' | 'Program' | 'Project' | 'Task', parentId?: string) => {
    setModalType(type);
    setEditItem(null);
    setPrefilledParentId(parentId);
    setIsModalOpen(true);
  };

  const triggerEditEntity = (type: 'Portfolio' | 'Program' | 'Project' | 'Task', item: any) => {
    setModalType(type);
    setEditItem(item);
    setPrefilledParentId(undefined);
    setIsModalOpen(true);
  };

  if (!authUser) {
    return <AuthScreen onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-zinc-100 select-none font-sans relative">
      
      {/* Sidebar Command Rail */}
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        authUser={authUser}
        dbSettings={dbSettings}
        onLogout={handleLogout}
        onOpenCommandPalette={() => setIsPaletteOpen(true)}
        onTriggerCreate={(type) => triggerCreateEntity(type)}
      />

      {/* Main Working View Panel */}
      <main className="flex-1 flex flex-col justify-between overflow-hidden relative">
        {currentView === 'dashboard' && (
          <DashboardView
            onNavigate={setCurrentView}
            onEditTask={(task) => triggerEditEntity('Task', task)}
            onEditProject={(project) => triggerEditEntity('Project', project)}
            onEditProgram={(program) => triggerEditEntity('Program', program)}
          />
        )}

        {currentView === 'portfolios' && (
          <PortfolioView
            onTriggerCreate={() => triggerCreateEntity('Portfolio')}
            onTriggerEdit={(item) => triggerEditEntity('Portfolio', item)}
            onNavigateToPrograms={() => setCurrentView('programs')}
          />
        )}

        {currentView === 'programs' && (
          <ProgramView
            onTriggerCreate={() => triggerCreateEntity('Program')}
            onTriggerEdit={(item) => triggerEditEntity('Program', item)}
            onNavigateToProjects={() => setCurrentView('projects')}
          />
        )}

        {currentView === 'projects' && (
          <ProjectView
            onTriggerCreate={() => triggerCreateEntity('Project')}
            onTriggerEdit={(item) => triggerEditEntity('Project', item)}
            onNavigateToTasks={() => setCurrentView('tasks')}
          />
        )}

        {currentView === 'tasks' && (
          <TaskView
            onTriggerCreate={() => triggerCreateEntity('Task')}
            onTriggerEdit={(item) => triggerEditEntity('Task', item)}
          />
        )}

        {currentView === 'weekly-review' && (
          <WeeklyReviewView
            onNavigateToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'settings' && (
          <DbSettings
            settings={dbSettings}
            onSaveSettings={handleSaveSettings}
          />
        )}

        {currentView === 'manual' && (
          <UserManualView
            onNavigate={setCurrentView}
          />
        )}
      </main>

      {/* COMMAND PALETTE TOGGLERS */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onNavigate={setCurrentView}
        onTriggerCreate={(type) => triggerCreateEntity(type)}
        onTriggerWeeklyReview={() => setCurrentView('weekly-review')}
      />

      {/* UNIFIED ENTITY CREATION MODALS */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        editItem={editItem}
        prefilledParentId={prefilledParentId}
      />

    </div>
  );
}

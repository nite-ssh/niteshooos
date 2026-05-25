/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Portfolio, Program, Project, Task, WeeklyReviewSession, ActivityLog, UserProfile, DbConnectionSettings } from './types';

// Helper to generate UUIDs locally
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const STORAGE_KEYS = {
  PORTFOLIOS: 'life_os_portfolios',
  PROGRAMS: 'life_os_programs',
  PROJECTS: 'life_os_projects',
  TASKS: 'life_os_tasks',
  REVIEWS: 'life_os_reviews',
  LOGS: 'life_os_logs',
  AUTH: 'life_os_auth_user',
  SETTINGS: 'life_os_db_settings',
};

// Seed Data
const DEFAULT_PORTFOLIOS: Portfolio[] = [
  {
    id: 'p-health',
    title: 'Health',
    description: 'Physical longevity, biometric consistency, and mental endurance.',
    vision: 'To maintain a resilient body and sharp intellect capable of performing at my peak indefinitely.',
    status: 'Active',
    health_score: 90,
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date('2026-05-25').toISOString(),
  },
  {
    id: 'p-business',
    title: 'Business & Ventures',
    description: 'Enterprise building, systems automation, and high-leverage assets.',
    vision: 'Construct cash-flowing systems that deliver exceptional global impact and build long-term venture value.',
    status: 'Active',
    health_score: 82,
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date('2026-05-25').toISOString(),
  },
  {
    id: 'p-finance',
    title: 'Finance & Capital',
    description: 'Portfolio allocation, wealth protection, and liquidity management.',
    vision: 'Sovereign financial security allowing high-conviction long-term planning without capital stress.',
    status: 'Active',
    health_score: 95,
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date('2026-05-25').toISOString(),
  },
  {
    id: 'p-learning',
    title: 'Learning & Mastery',
    description: 'Acquiring skillsets, deep tech competencies, and cultural languages.',
    vision: 'A lifetime learner operating at the frontier of technology, culture, and science.',
    status: 'Active',
    health_score: 75,
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date('2026-05-25').toISOString(),
  },
  {
    id: 'p-relationships',
    title: 'Relationships & Family',
    description: 'Deepening social nodes, core family support, and high-frequency friendships.',
    vision: 'To build secure, authentic relationships anchored in shared high-agency pursuits.',
    status: 'Active',
    health_score: 88,
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date('2026-05-25').toISOString(),
  }
];

const DEFAULT_PROGRAMS: Program[] = [
  {
    id: 'prog-education',
    portfolio_id: 'p-business',
    title: 'Nepali Education Venture',
    description: 'Building schools, digital classrooms, and teacher SOP engines in rural Nepal.',
    objective: 'Establish a self-sustaining educational framework supporting 10,000 students.',
    owner: 'Nitesh Poudel',
    status: 'Active',
    health: 'Healthy',
    risk_level: 'Low',
    target_outcome: '5 fully operational hub schools with complete digital curriculums.',
    review_frequency: 'Weekly',
    created_at: new Date('2026-01-10').toISOString(),
    updated_at: new Date('2026-05-25').toISOString(),
  },
  {
    id: 'prog-strength',
    portfolio_id: 'p-health',
    title: 'Strength Recovery',
    description: 'Hypertrophy, structural alignment, cardiovascular performance, and sleep recovery.',
    objective: 'Reach a squat depth check, 10% body fat, and a resting heart rate below 50 bpm.',
    owner: 'Nitesh Poudel',
    status: 'Active',
    health: 'Healthy',
    risk_level: 'Low',
    target_outcome: 'Pristine biomechanics and biometric baseline under 12% body fat.',
    review_frequency: 'Weekly',
    created_at: new Date('2026-01-15').toISOString(),
    updated_at: new Date('2026-05-25').toISOString(),
  },
  {
    id: 'prog-youtube',
    portfolio_id: 'p-business',
    title: 'YouTube Growth',
    description: 'Visual essays covering complex systems design, programming methodology, and philosophy.',
    objective: 'Deliver high-retention technical content and build a robust, technical-minded subscriber node.',
    owner: 'Nitesh Poudel',
    status: 'At Risk',
    health: 'At Risk',
    risk_level: 'Medium',
    target_outcome: '2 published high-fidelity pieces per month with consistent click-through optimization.',
    review_frequency: 'Weekly',
    created_at: new Date('2026-02-01').toISOString(),
    updated_at: new Date('2026-05-25').toISOString(),
  },
  {
    id: 'prog-wealth',
    portfolio_id: 'p-finance',
    title: 'Wealth Building',
    description: 'Automated capital sweeps, systematic investments, and real estate review cycles.',
    objective: 'Configure hands-off wealth engines that compounding reliably.',
    owner: 'Nitesh Poudel',
    status: 'Active',
    health: 'Healthy',
    risk_level: 'Low',
    target_outcome: 'Maximized investment capture and streamlined tax structuring.',
    review_frequency: 'Monthly',
    created_at: new Date('2026-01-05').toISOString(),
    updated_at: new Date('2026-05-25').toISOString(),
  },
  {
    id: 'prog-french',
    portfolio_id: 'p-learning',
    title: 'French Learning System',
    description: 'Acquiring professional French fluency (B2+) focusing on written speed and auditory parsing.',
    objective: 'Achieve conversational ease and parse technical literature within 6 months.',
    owner: 'Nitesh Poudel',
    status: 'Paused',
    health: 'Critical',
    risk_level: 'High',
    target_outcome: 'B2 CEFR certification.',
    review_frequency: 'Biweekly',
    created_at: new Date('2026-03-01').toISOString(),
    updated_at: new Date('2026-05-25').toISOString(),
  }
];

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-cohort',
    program_id: 'prog-education',
    title: 'Launch Cohort 1',
    description: 'Syllabus alignment, student verification, and zoom hub setups for the premiere batch.',
    objective: 'Successfully onboard 150 digital learning scholars.',
    definition_of_done: '150 active students attending and completing Week 1 assessments.',
    priority: 'Critical',
    status: 'Active',
    deadline: '2026-06-15',
    progress_percentage: 65,
    energy_level_required: 'High',
    created_at: new Date('2026-04-10').toISOString(),
    updated_at: new Date('2026-05-25').toISOString(),
  },
  {
    id: 'proj-sop',
    program_id: 'prog-education',
    title: 'Teacher SOP System',
    description: 'Drafting clear, non-negotiable runbooks for local Nepali teachers to manage hardware.',
    objective: 'Ensure zero-touch IT troubleshooting by teachers.',
    definition_of_done: 'Host and test a 3-part SOP handbook on local systems.',
    priority: 'High',
    status: 'Active',
    deadline: '2026-06-30',
    progress_percentage: 40,
    energy_level_required: 'Medium',
    created_at: new Date('2026-04-15').toISOString(),
    updated_at: new Date('2026-05-25').toISOString(),
  },
  {
    id: 'proj-funnel',
    program_id: 'prog-youtube',
    title: 'Build Lead Funnel',
    description: 'Lead magnets, free blueprints, and newsletter automation logic built behind the channel.',
    objective: 'Establish a systematic audience capturing engine.',
    definition_of_done: 'Fully integrated ConvertKit series triggered by the free system design guide.',
    priority: 'High',
    status: 'Blocked',
    deadline: '2026-06-10',
    progress_percentage: 20,
    energy_level_required: 'High',
    created_at: new Date('2026-05-01').toISOString(),
    updated_at: new Date('2026-05-25').toISOString(),
  },
  {
    id: 'proj-routine',
    program_id: 'prog-strength',
    title: 'Rebuild Morning Routine',
    description: 'Strict circadian locks, movement pre-hab, cold exposure, and high-fidelity journaling.',
    objective: 'Re-align nervous system immediately upon waking.',
    definition_of_done: '7 consecutive mornings completing hydration, 15m somatic flows, and direct daylight capture.',
    priority: 'Medium',
    status: 'Active',
    deadline: '2026-05-30',
    progress_percentage: 85,
    energy_level_required: 'Low',
    created_at: new Date('2026-05-01').toISOString(),
    updated_at: new Date('2026-05-25').toISOString(),
  }
];

const DEFAULT_TASKS: Task[] = [
  {
    id: 't-1',
    project_id: 'proj-cohort',
    title: 'Write onboarding email sequence',
    notes: 'Create three messages: (1) System access credentials, (2) Software installation links, (3) Week 1 calendar links.',
    status: 'In Progress',
    due_date: '2026-05-26',
    estimated_time: 120,
    actual_time: 45,
    energy_required: 'High',
    context: 'Work',
    priority: 'High',
    created_at: new Date('2026-05-20').toISOString(),
    completed_at: null,
  },
  {
    id: 't-2',
    project_id: 'proj-cohort',
    title: 'Edit webinar reel overview',
    notes: 'Slice the best 45-second explanation of systems design from last week\'s call. Subtitle it for micro-learnings.',
    status: 'Todo',
    due_date: '2026-05-28',
    estimated_time: 90,
    actual_time: 0,
    energy_required: 'Medium',
    context: 'Work',
    priority: 'Medium',
    created_at: new Date('2026-05-22').toISOString(),
    completed_at: null,
  },
  {
    id: 't-3',
    project_id: 'proj-sop',
    title: 'Call teacher candidates to check system access',
    notes: 'Verify they have received the pre-installed Chromebooks and can login successfully.',
    status: 'Todo',
    due_date: '2026-05-27',
    estimated_time: 45,
    actual_time: 0,
    energy_required: 'Low',
    context: 'Call',
    priority: 'High',
    created_at: new Date('2026-05-23').toISOString(),
    completed_at: null,
  },
  {
    id: 't-4',
    project_id: 'proj-routine',
    title: 'Buy somatic flow accessories (resistance bands)',
    notes: 'Need standard 25lb and 40lb loop bands for pre-hab routines.',
    status: 'Done',
    due_date: '2026-05-24',
    estimated_time: 15,
    actual_time: 10,
    energy_required: 'Low',
    context: 'Errand',
    priority: 'Low',
    created_at: new Date('2026-05-21').toISOString(),
    completed_at: new Date('2026-05-24T10:00:00Z').toISOString(),
  },
  {
    id: 't-5',
    project_id: 'proj-funnel',
    title: 'Review ConvertKit API integration constraints',
    notes: 'We need to verify if the opt-in form requires double-opt-in for Nepalese email domains to avoid spam flags.',
    status: 'Blocked',
    due_date: '2026-05-25',
    estimated_time: 60,
    actual_time: 0,
    energy_required: 'High',
    context: 'Work',
    priority: 'Critical',
    created_at: new Date('2026-05-22').toISOString(),
    completed_at: null,
  },
  {
    id: 't-6',
    project_id: 'proj-cohort',
    title: 'Verify Google Classroom roster upload',
    notes: 'Ensure all emails align with the backend school database records.',
    status: 'Done',
    due_date: '2026-05-24',
    estimated_time: 30,
    actual_time: 35,
    energy_required: 'Low',
    context: 'Work',
    priority: 'High',
    created_at: new Date('2026-05-23').toISOString(),
    completed_at: new Date('2026-05-24T18:00:00Z').toISOString(),
  }
];

const DEFAULT_REVIEWS: WeeklyReviewSession[] = [
  {
    id: 'rev-prev',
    review_date: '2026-05-18',
    completed_at: new Date('2026-05-18T22:00:00Z').toISOString(),
    uncompleted_tasks_reviewed_count: 5,
    health_checks_completed_count: 5,
    adjustments_made: 'Paused French Learning system due to high-priority Cohort Launch. Re-focused Health goals on Morning somatic routine.',
    reflection_notes: 'System is running smoothly. Business projects require high energy; sleep recovery must be protected at all costs.',
  }
];

const DEFAULT_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    entity_type: 'Task',
    entity_id: 't-4',
    entity_title: 'Buy somatic flow accessories (resistance bands)',
    action: 'Completed',
    details: 'Completed Task: Buy somatic flow accessories (resistance bands)',
    created_at: new Date('2026-05-24T10:00:00Z').toISOString(),
  },
  {
    id: 'log-2',
    entity_type: 'Task',
    entity_id: 't-6',
    entity_title: 'Verify Google Classroom roster upload',
    action: 'Completed',
    details: 'Completed Task: Verify Google Classroom roster upload',
    created_at: new Date('2026-05-24T18:00:00Z').toISOString(),
  },
  {
    id: 'log-3',
    entity_type: 'Project',
    entity_id: 'proj-funnel',
    entity_title: 'Build Lead Funnel',
    action: 'Updated Status',
    details: 'Changed status to Blocked: Awaiting ConvertKit API configuration rules.',
    created_at: new Date('2026-05-25T09:12:00Z').toISOString(),
  }
];

const DEFAULT_USER: UserProfile = {
  id: 'usr-nitesh',
  email: 'np.niteshpoudel@gmail.com',
  full_name: 'Nitesh Poudel',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
};

const DEFAULT_SETTINGS: DbConnectionSettings = {
  url: '',
  anonKey: '',
  useSupabase: false,
};

// Low-friction, Event-driven localStorage helper
class LifeOSDatabase {
  private updateListeners: Set<() => void> = new Set();

  private get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(item);
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notifyListeners();
    } catch (e) {
      console.error('Error writing to localStorage', e);
    }
  }

  onChange(listener: () => void) {
    this.updateListeners.add(listener);
    return () => this.updateListeners.delete(listener);
  }

  private notifyListeners() {
    this.updateListeners.forEach((l) => l());
  }

  // Clear / Reset to Defaults
  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.PORTFOLIOS, JSON.stringify(DEFAULT_PORTFOLIOS));
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(DEFAULT_PROGRAMS));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(DEFAULT_TASKS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(DEFAULT_LOGS));
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(DEFAULT_USER));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    this.notifyListeners();
  }

  // --- GETTERS ---
  getPortfolios(): Portfolio[] {
    return this.get<Portfolio[]>(STORAGE_KEYS.PORTFOLIOS, DEFAULT_PORTFOLIOS);
  }

  getPrograms(): Program[] {
    return this.get<Program[]>(STORAGE_KEYS.PROGRAMS, DEFAULT_PROGRAMS);
  }

  getProjects(): Project[] {
    return this.get<Project[]>(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
  }

  getTasks(): Task[] {
    return this.get<Task[]>(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
  }

  getReviews(): WeeklyReviewSession[] {
    return this.get<WeeklyReviewSession[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
  }

  getActivityLogs(): ActivityLog[] {
    return this.get<ActivityLog[]>(STORAGE_KEYS.LOGS, DEFAULT_LOGS).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getAuthUser(): UserProfile | null {
    return this.get<UserProfile | null>(STORAGE_KEYS.AUTH, DEFAULT_USER);
  }

  getSettings(): DbConnectionSettings {
    return this.get<DbConnectionSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  // --- MUTATORS (CASCADING) ---

  // Portfolio Operations
  savePortfolio(portfolio: Portfolio): Portfolio {
    const list = this.getPortfolios();
    const existingIndex = list.findIndex((p) => p.id === portfolio.id);
    const updated = { ...portfolio, updated_at: new Date().toISOString() };

    if (existingIndex > -1) {
      list[existingIndex] = updated;
      this.logActivity('Portfolio', updated.id, updated.title, 'Updated', 'Modified portfolio vision and baseline metadata.');
    } else {
      list.push(updated);
      this.logActivity('Portfolio', updated.id, updated.title, 'Created', 'Initialized a new core strategic life domain.');
    }
    this.set(STORAGE_KEYS.PORTFOLIOS, list);
    return updated;
  }

  deletePortfolio(id: string) {
    const portfolios = this.getPortfolios();
    const portfolio = portfolios.find(p => p.id === id);
    if (!portfolio) return;

    // Cascade delete: get associated programs
    const programs = this.getPrograms();
    const programsToDelete = programs.filter(p => p.portfolio_id === id);

    for (const prog of programsToDelete) {
      this.deleteProgram(prog.id, true); // trigger cascade without full notifications on intermediate steps
    }

    const filteredPortfolios = portfolios.filter(p => p.id !== id);
    this.logActivity('Portfolio', id, portfolio.title, 'Deleted', 'Permanently removed portfolio life domain and cascading entities.');
    this.set(STORAGE_KEYS.PORTFOLIOS, filteredPortfolios);
  }

  // Program Operations
  saveProgram(program: Program): Program {
    const list = this.getPrograms();
    const existingIndex = list.findIndex((p) => p.id === program.id);
    const updated = { ...program, updated_at: new Date().toISOString() };

    // Calculate Portfolio health change preview... (optionally)
    if (existingIndex > -1) {
      list[existingIndex] = updated;
      this.logActivity('Program', updated.id, updated.title, 'Updated Status', `Status configured to ${updated.status} with health ${updated.health}.`);
    } else {
      list.push(updated);
      this.logActivity('Program', updated.id, updated.title, 'Created', 'Initialized a new core operational area of continuity.');
    }
    this.set(STORAGE_KEYS.PROGRAMS, list);
    this.recalculatePortfolioHealth(updated.portfolio_id);
    return updated;
  }

  deleteProgram(id: string, cascade = false) {
    const programs = this.getPrograms();
    const program = programs.find(p => p.id === id);
    if (!program) return;

    // Cascade delete: get associated projects
    const projects = this.getProjects();
    const projectsToDelete = projects.filter(p => p.program_id === id);

    for (const proj of projectsToDelete) {
      this.deleteProject(proj.id, true);
    }

    const filteredPrograms = programs.filter(p => p.id !== id);
    if (!cascade) {
      this.logActivity('Program', id, program.title, 'Deleted', 'Core operational program and cascading projects deleted.');
    }
    this.set(STORAGE_KEYS.PROGRAMS, filteredPrograms);
    if (!cascade) {
      this.recalculatePortfolioHealth(program.portfolio_id);
    }
  }

  // Project Operations
  saveProject(project: Project): Project {
    const list = this.getProjects();
    const existingIndex = list.findIndex((p) => p.id === project.id);
    const updated = { ...project, updated_at: new Date().toISOString() };

    if (existingIndex > -1) {
      list[existingIndex] = updated;
      this.logActivity('Project', updated.id, updated.title, 'Updated Status', `Status set to ${updated.status} (Energy: ${updated.energy_level_required}).`);
    } else {
      list.push(updated);
      this.logActivity('Project', updated.id, updated.title, 'Created', 'Initialized a finite initiative with defined outcomes.');
    }
    this.set(STORAGE_KEYS.PROJECTS, list);
    this.recalculateProgramHealthFromProjects(updated.program_id);
    return updated;
  }

  deleteProject(id: string, cascade = false) {
    const projects = this.getProjects();
    const project = projects.find(p => p.id === id);
    if (!project) return;

    // Cascade delete: get associated tasks
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(t => t.project_id !== id);
    this.set(STORAGE_KEYS.TASKS, filteredTasks);

    const filteredProjects = projects.filter(p => p.id !== id);
    if (!cascade) {
      this.logActivity('Project', id, project.title, 'Deleted', 'Finite project initiative and cascading tasks removed.');
    }
    this.set(STORAGE_KEYS.PROJECTS, filteredProjects);
    if (!cascade) {
      this.recalculateProgramHealthFromProjects(project.program_id);
    }
  }

  // Task Operations
  saveTask(task: Task): Task {
    const list = this.getTasks();
    const existingIndex = list.findIndex((t) => t.id === task.id);
    const now = new Date().toISOString();

    const isCompletion = task.status === 'Done' && (existingIndex === -1 || list[existingIndex].status !== 'Done');
    const isUncompletion = task.status !== 'Done' && existingIndex > -1 && list[existingIndex].status === 'Done';

    const updated: Task = {
      ...task,
      completed_at: isCompletion ? now : isUncompletion ? null : task.completed_at,
    };

    if (existingIndex > -1) {
      list[existingIndex] = updated;
      if (isCompletion) {
        this.logActivity('Task', updated.id, updated.title, 'Completed', `Completed under ${updated.context} in ${updated.actual_time || updated.estimated_time}m.`);
      } else {
        this.logActivity('Task', updated.id, updated.title, 'Updated', `Modified task variables (Priority: ${updated.priority}, Status: ${updated.status}).`);
      }
    } else {
      list.push(updated);
      this.logActivity('Task', updated.id, updated.title, 'Created', 'Logged an atomic actionable task node.');
    }

    this.set(STORAGE_KEYS.TASKS, list);
    this.recalculateProjectProgress(updated.project_id);
    return updated;
  }

  deleteTask(id: string) {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const filtered = tasks.filter(t => t.id !== id);
    this.logActivity('Task', id, task.title, 'Deleted', 'Removed task node.');
    this.set(STORAGE_KEYS.TASKS, filtered);
    this.recalculateProjectProgress(task.project_id);
  }

  // Weekly Reviews Log
  saveReview(review: Omit<WeeklyReviewSession, 'id' | 'completed_at'>): WeeklyReviewSession {
    const list = this.getReviews();
    const completedSession: WeeklyReviewSession = {
      id: 'rev-' + Date.now(),
      completed_at: new Date().toISOString(),
      ...review,
    };
    list.unshift(completedSession);
    this.set(STORAGE_KEYS.REVIEWS, list);
    this.logActivity('Review', completedSession.id, `Weekly Review - ${completedSession.review_date}`, 'Completed', 'Logged system alignment, task sweeps, and strategic decisions.');
    return completedSession;
  }

  // Auth Operations (simulate profile edits and authentication setups)
  saveProfile(profile: UserProfile) {
    this.set(STORAGE_KEYS.AUTH, profile);
    this.logActivity('Review', profile.id, profile.full_name, 'Updated', 'Operational identity coordinates modified.');
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    this.notifyListeners();
  }

  login(email: string, fullName: string) {
    const user: UserProfile = {
      id: 'usr-' + Date.now(),
      email,
      full_name: fullName,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    };
    this.set(STORAGE_KEYS.AUTH, user);
    this.logActivity('Review', user.id, user.full_name, 'Created', 'User session established on the local control terminal.');
  }

  saveSettings(settings: DbConnectionSettings) {
    this.set(STORAGE_KEYS.SETTINGS, settings);
    this.notifyListeners();
  }

  // --- SERVICE LOGGING & AGGREGATE CALCULATIONS ---

  private logActivity(type: ActivityLog['entity_type'], id: string, title: string, action: string, details: string) {
    const logs = this.get<ActivityLog[]>(STORAGE_KEYS.LOGS, DEFAULT_LOGS);
    const newLog: ActivityLog = {
      id: generateUUID(),
      entity_type: type,
      entity_id: id,
      entity_title: title,
      action,
      details,
      created_at: new Date().toISOString(),
    };
    logs.unshift(newLog);
    // cap logs at 200 for local storage hygiene
    if (logs.length > 200) logs.pop();
    this.set(STORAGE_KEYS.LOGS, logs);
  }

  private recalculateProjectProgress(projectId: string) {
    const tasks = this.getTasks().filter(t => t.project_id === projectId);
    const completed = tasks.filter(t => t.status === 'Done').length;
    let progress = 0;
    if (tasks.length > 0) {
      progress = Math.round((completed / tasks.length) * 100);
    }

    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === projectId);
    if (index > -1) {
      const proj = projects[index];
      proj.progress_percentage = progress;
      if (progress === 100 && proj.status !== 'Completed') {
        proj.status = 'Completed';
      } else if (progress < 100 && proj.status === 'Completed') {
        proj.status = 'Active';
      }
      proj.updated_at = new Date().toISOString();
      projects[index] = proj;
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      
      // Cascade health recalculation upward
      this.recalculateProgramHealthFromProjects(proj.program_id);
    }
  }

  private recalculateProgramHealthFromProjects(programId: string) {
    const projects = this.getProjects().filter(p => p.program_id === programId);
    let health: Program['health'] = 'Healthy';
    let risk_level: Program['risk_level'] = 'Low';

    const blockedCount = projects.filter(p => p.status === 'Blocked').length;
    const pausedCount = projects.filter(p => p.status === 'Paused').length;
    const activeCount = projects.filter(p => p.status === 'Active').length;

    // Basic health derivation matrix
    if (blockedCount > 0) {
      health = 'Critical';
      risk_level = 'High';
    } else if (pausedCount > 1 || projects.some(p => p.status === 'Killed')) {
      health = 'At Risk';
      risk_level = 'Medium';
    } else {
      health = 'Healthy';
      risk_level = 'Low';
    }

    const programs = this.getPrograms();
    const index = programs.findIndex(p => p.id === programId);
    if (index > -1) {
      const prog = programs[index];
      prog.health = health;
      prog.risk_level = risk_level;
      
      // Auto upgrade status if blocked
      if (health === 'Critical' && prog.status === 'Active') {
        prog.status = 'Blocked';
      } else if (health === 'Healthy' && (prog.status === 'Blocked' || prog.status === 'At Risk')) {
        prog.status = 'Active';
      }
      
      prog.updated_at = new Date().toISOString();
      programs[index] = prog;
      localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));

      this.recalculatePortfolioHealth(prog.portfolio_id);
    }
  }

  private recalculatePortfolioHealth(portfolioId: string) {
    const programs = this.getPrograms().filter(prog => prog.portfolio_id === portfolioId);
    if (programs.length === 0) return;

    let points = 0;
    programs.forEach(prog => {
      if (prog.health === 'Healthy') points += 100;
      else if (prog.health === 'At Risk') points += 60;
      else points += 20; // Critical
    });

    const averageScore = Math.round(points / programs.length);
    const portfolios = this.getPortfolios();
    const index = portfolios.findIndex(p => p.id === portfolioId);
    if (index > -1) {
      portfolios[index].health_score = averageScore;
      portfolios[index].updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.PORTFOLIOS, JSON.stringify(portfolios));
    }
  }
}

export const db = new LifeOSDatabase();

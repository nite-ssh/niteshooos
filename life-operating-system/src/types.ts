/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Portfolio {
  id: string;
  title: string;
  description: string;
  vision: string;
  status: 'Active' | 'Paused' | 'Archived';
  health_score: number; // 0 - 100
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  portfolio_id: string;
  title: string;
  description: string;
  objective: string;
  owner: string;
  status: 'Active' | 'At Risk' | 'Blocked' | 'Paused' | 'Dead' | 'Completed';
  health: 'Healthy' | 'At Risk' | 'Critical';
  risk_level: 'Low' | 'Medium' | 'High';
  target_outcome: string;
  review_frequency: 'Weekly' | 'Biweekly' | 'Monthly';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  program_id: string;
  title: string;
  description: string;
  objective: string;
  definition_of_done: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Planned' | 'Active' | 'Blocked' | 'Paused' | 'Completed' | 'Killed';
  deadline: string;
  progress_percentage: number; // 0 - 100
  energy_level_required: 'Low' | 'Medium' | 'High';
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  notes: string;
  status: 'Todo' | 'In Progress' | 'Waiting' | 'Blocked' | 'Done' | 'Cancelled';
  due_date: string;
  estimated_time: number; // in minutes
  actual_time: number; // in minutes
  energy_required: 'Low' | 'Medium' | 'High';
  context: string; // e.g. 'Work', 'Personal', 'Call', 'Errand', 'Computer'
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  created_at: string;
  completed_at: string | null;
}

export interface WeeklyReviewSession {
  id: string;
  review_date: string;
  completed_at: string;
  uncompleted_tasks_reviewed_count: number;
  health_checks_completed_count: number;
  adjustments_made: string; // JSON text or description
  reflection_notes: string;
}

export interface ActivityLog {
  id: string;
  entity_type: 'Portfolio' | 'Program' | 'Project' | 'Task' | 'Review';
  entity_id: string;
  entity_title: string;
  action: string; // 'Created', 'Updated Status', 'Completed', 'Archived', 'Deleted', etc.
  details: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
}

export interface DbConnectionSettings {
  url: string;
  anonKey: string;
  useSupabase: boolean;
}

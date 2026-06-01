import { apiRequest } from "./client";

export interface InstructorDashboardItem {
  title: string;
  value: string;
  delta: string;
}

export interface InstructorCourseItem {
  id: number;
  title: string;
  students: number;
  progress: number;
  status: string;
}

export function getInstructorDashboard() {
  return apiRequest<{ stats: InstructorDashboardItem[]; courses: InstructorCourseItem[] }>('/api/v1/instructor/dashboard');
}

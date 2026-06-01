import { apiRequest } from "./client";

export interface CourseListItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  level: string;
  rating: number;
  lessons: number;
  price: string;
  progress?: number;
}

export interface CourseDetail {
  id: number;
  title: string;
  slug: string;
  category: string;
  level: string;
  rating: number;
  lessons: number;
  duration: string;
  instructor: string;
  updatedAt: string;
  description: string;
  progress: number;
  outcomes: string[];
  lessonsList: { title: string; time: string }[];
}

export function getCourses() {
  return apiRequest<CourseListItem[]>('/api/v1/courses');
}

export function getCourse(id: string | number) {
  return apiRequest<CourseDetail>(`/api/v1/courses/${id}`);
}

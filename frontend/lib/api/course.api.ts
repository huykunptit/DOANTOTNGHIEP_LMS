import { apiRequest, Page } from "./client";
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

export interface LessonResponse {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  orderIndex: number;
  preview: boolean;
  type: string;
  isCompleted?: boolean;
}

export interface SectionResponse {
  id: number;
  title: string;
  position: number;
  lessons: LessonResponse[];
}

export interface SectionRequest {
  courseId: number;
  title: string;
  position?: number;
}

export interface LessonRequest {
  sectionId: number;
  title: string;
  description?: string;
  type: string;
  videoUrl?: string;
  duration?: number;
  orderIndex?: number;
  preview?: boolean;
}

export interface MediaFileResponse {
  id: number;
  fileName: string;
  filePath: string;
  fileSize: number;
}
export interface CourseResponse {
  id: number;
  name: string;
  code: string;
  slug: string;
  description: string;
  price: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  title: string;
  code: string;
  description?: string;
  price?: number;
  courseMode?: string;
  creditBearing?: boolean;
  creditValue?: number;
  active?: boolean;
}

export function createCourse(data: CreateCourseRequest) {
  return apiRequest<CourseResponse>("/api/v1/courses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCourse(id: number | string, data: Partial<CreateCourseRequest>) {
  return apiRequest<CourseResponse>(`/api/v1/courses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function getCourses(page = 0, size = 10, search = "") {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  if (search) params.append("search", search);
  
  return apiRequest<Page<CourseResponse>>(`/api/v1/courses?${params.toString()}`);
}

export function getCourse(id: string | number) {
  return apiRequest<CourseResponse>(`/api/v1/courses/${id}`);
}

export function getCourseContent(id: string | number) {
  return apiRequest<SectionResponse[]>(`/api/v1/courses/${id}/content`);
}

export function createSection(data: SectionRequest) {
  return apiRequest<SectionResponse>("/api/v1/sections", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function createLesson(data: LessonRequest) {
  return apiRequest<LessonResponse>("/api/v1/lessons", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function uploadMedia(file: File, scope: string = "general") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("scope", scope);

  const token = localStorage.getItem("accessToken");
  const response = await fetch("http://localhost:8081/api/v1/media-files/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }
  return response.json() as Promise<MediaFileResponse>;
}
export interface AnswerRequest {
  content: string;
  isCorrect: boolean;
  explanation?: string;
  orderIndex?: number;
}

export interface QuestionRequest {
  content: string;
  type: string;
  difficulty: number;
  defaultScore: number;
  explanation?: string;
  answers: AnswerRequest[];
}

export interface QuizRequest {
  courseId: number;
  lessonId?: number;
  scope: string;
  title: string;
  description?: string;
  timeLimit?: number;
  passScore?: number;
}

export function createQuiz(data: QuizRequest) {
  return apiRequest<any>("/api/v1/quizzes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getQuizForTeacher(id: string | number) {
  return apiRequest<any>(`/api/v1/quizzes/${id}`);
}

export function addQuestionToQuiz(quizId: string | number, data: QuestionRequest) {
  return apiRequest<any>(`/api/v1/quizzes/${quizId}/questions`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getQuizForStudent(id: string | number) {
  return apiRequest<any>(`/api/v1/quizzes/${id}/student`);
}

export function submitQuiz(quizId: string | number, answers: Record<number, number>) {
  return apiRequest<any>(`/api/v1/quizzes/${quizId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
}

export function enrollCourse(courseId: string | number) {
  return apiRequest<void>(`/api/v1/courses/${courseId}/enroll`, {
    method: "POST",
  });
}

export function tickLessonProgress(lessonId: string | number) {
  return apiRequest<void>(`/api/v1/lessons/${lessonId}/progress/tick`, {
    method: "POST",
  });
}

export function getEnrolledCourses() {
  return apiRequest<CourseResponse[]>("/api/v1/courses/enrolled");
}

// --- Phase 7: Assignment ---
export interface AssignmentSubmitRequest {
  fileUrl: string;
  content: string;
}

export interface AssignmentSubmissionResponse {
  id: number;
  status: string;
  score?: number;
  feedback?: string;
  fileUrl?: string;
  content?: string;
}

export function submitAssignment(assignmentId: string | number, data: AssignmentSubmitRequest) {
  return apiRequest<AssignmentSubmissionResponse>(`/api/v1/assignments/${assignmentId}/submit`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getMySubmission(assignmentId: string | number) {
  return apiRequest<AssignmentSubmissionResponse>(`/api/v1/assignments/${assignmentId}/my-submission`);
}

// --- Phase 7: Gradebook ---
export function getMyGrades(courseId: string | number) {
  return apiRequest<any>(`/api/v1/gradebook/course/${courseId}/my-grades`);
}

// --- Phase 7: Forum ---
export interface QARequest {
  lessonId?: number;
  title: string;
  content: string;
}

export function postQuestion(courseId: string | number, data: QARequest) {
  return apiRequest<any>(`/api/v1/forum/course/${courseId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getQuestions(courseId: string | number) {
  const data = await apiRequest<any>(`/api/v1/forum/course/${courseId}`);
  if (data && Array.isArray(data.content)) return data.content;
  if (Array.isArray(data)) return data;
  return [];
}

// --- Phase 8: Instructor Dashboard ---
export function getInstructorCourses() {
  return apiRequest<CourseResponse[]>("/api/v1/instructor/courses");
}

export function getInstructorCourseStudents(courseId: string | number) {
  return apiRequest<any[]>(`/api/v1/instructor/courses/${courseId}/students`);
}

export function getInstructorCourseAssignments(courseId: string | number) {
  return apiRequest<any[]>(`/api/v1/instructor/courses/${courseId}/assignments`);
}

export interface StudentStats {
  enrolledCourses: number;
  completedLessons: number;
  inProgressLessons: number;
}

export interface InstructorStats {
  totalCourses: number;
  totalStudents: number;
  pendingGrading: number;
}

export function getStudentStats() {
  return apiRequest<StudentStats>("/api/v1/student/stats");
}

export function getInstructorStats() {
  return apiRequest<InstructorStats>("/api/v1/instructor/stats");
}

export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  link?: string;
  readAt?: string;
  createdAt: string;
}

export function getMyNotifications() {
  return apiRequest<NotificationItem[]>("/api/v1/notifications");
}

export function getUnreadNotificationCount() {
  return apiRequest<number>("/api/v1/notifications/unread-count");
}

export function markNotificationRead(id: number) {
  return apiRequest<void>(`/api/v1/notifications/${id}/read`, { method: "PUT" });
}

// --- Instructor: Grade assignment submission ---
export interface GradeRequest {
  score: number;
  feedback?: string;
}
export function gradeSubmission(submissionId: number, data: GradeRequest) {
  return apiRequest<AssignmentSubmissionResponse>(`/api/v1/assignments/submissions/${submissionId}/grade`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// --- Student: Quiz attempt history ---
export function getMyQuizAttempts(quizId: string | number) {
  return apiRequest<any[]>(`/api/v1/quizzes/${quizId}/my-attempts`);
}

// --- Student: Gradebook per course ---
export function getCourseGradebook(courseId: string | number) {
  return apiRequest<any>(`/api/v1/gradebook/course/${courseId}/my-grades`);
}

// --- Forum: Reply to a question ---
export interface ReplyRequest {
  content: string;
}
export function replyQuestion(questionId: string | number, data: ReplyRequest) {
  return apiRequest<any>(`/api/v1/forum/questions/${questionId}/replies`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getQuestionReplies(questionId: string | number) {
  return apiRequest<any[]>(`/api/v1/forum/questions/${questionId}/replies`);
}

export function getAssignmentByLesson(lessonId: number | string) {
  return apiRequest<any>(`/api/v1/assignments/lesson/${lessonId}`);
}

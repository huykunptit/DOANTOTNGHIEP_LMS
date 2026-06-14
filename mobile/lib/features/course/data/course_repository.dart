import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';

final courseRepositoryProvider = Provider<CourseRepository>((ref) {
  return CourseRepository(dio: ref.watch(dioProvider));
});

final courseListProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  return ref.watch(courseRepositoryProvider).getCourses();
});

final enrolledCoursesProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  return ref.watch(courseRepositoryProvider).getEnrolledCourses();
});

final studentStatsProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  return ref.watch(courseRepositoryProvider).getStudentStats();
});

final courseDetailProvider = FutureProvider.family<Map<String, dynamic>, int>((ref, courseId) async {
  return ref.watch(courseRepositoryProvider).getCourse(courseId);
});

final courseContentProvider = FutureProvider.family<List<dynamic>, int>((ref, courseId) async {
  return ref.watch(courseRepositoryProvider).getCourseContent(courseId);
});

final quizStudentProvider = FutureProvider.family<Map<String, dynamic>, int>((ref, quizId) async {
  return ref.watch(courseRepositoryProvider).getQuizForStudent(quizId);
});

final isEnrolledProvider = Provider.family<bool, int>((ref, courseId) {
  final enrolledAsync = ref.watch(enrolledCoursesProvider);
  return enrolledAsync.maybeWhen(
    data: (courses) => courses.any((c) => c['id'] == courseId),
    orElse: () => false,
  );
});

final forumQuestionsProvider = FutureProvider.family<List<Map<String, dynamic>>, int>((ref, courseId) async {
  return ref.watch(courseRepositoryProvider).getForumQuestions(courseId);
});

class CourseRepository {
  final Dio _dio;

  CourseRepository({required Dio dio}) : _dio = dio;

  Future<List<Map<String, dynamic>>> getCourses({int page = 0, int size = 20, String? search}) async {
    final params = <String, dynamic>{'page': page, 'size': size};
    if (search != null && search.isNotEmpty) params['search'] = search;
    final response = await _dio.get('/courses', queryParameters: params);
    final data = response.data;
    if (data is Map && data.containsKey('content')) {
      return (data['content'] as List).cast<Map<String, dynamic>>();
    }
    if (data is List) return data.cast<Map<String, dynamic>>();
    return [];
  }

  Future<List<Map<String, dynamic>>> getEnrolledCourses() async {
    final response = await _dio.get('/courses/enrolled');
    final data = response.data;
    if (data is List) return data.cast<Map<String, dynamic>>();
    if (data is Map && data.containsKey('content')) {
      return (data['content'] as List).cast<Map<String, dynamic>>();
    }
    return [];
  }

  Future<Map<String, dynamic>> getCourse(int id) async {
    final response = await _dio.get('/courses/$id');
    return response.data as Map<String, dynamic>;
  }

  Future<List<dynamic>> getCourseContent(int courseId) async {
    final response = await _dio.get('/courses/$courseId/content');
    return response.data as List<dynamic>;
  }

  Future<void> enroll(int courseId) async {
    await _dio.post('/courses/$courseId/enroll');
  }

  Future<void> tickProgress(int lessonId) async {
    await _dio.post('/lessons/$lessonId/progress/tick');
  }

  Future<Map<String, dynamic>> getStudentStats() async {
    final response = await _dio.get('/student/stats');
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> getQuizForStudent(int quizId) async {
    final response = await _dio.get('/quizzes/$quizId/student');
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> submitQuiz(int quizId, Map<String, dynamic> answers) async {
    final response = await _dio.post('/quizzes/$quizId/submit', data: {'answers': answers});
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> getGradebook(int courseId) async {
    final response = await _dio.get('/gradebook/course/$courseId/my-grades');
    return response.data as Map<String, dynamic>;
  }

  Future<List<Map<String, dynamic>>> getForumQuestions(int courseId) async {
    try {
      final response = await _dio.get('/forum/course/$courseId');
      final data = response.data;
      if (data is Map && data.containsKey('content')) {
        return (data['content'] as List).cast<Map<String, dynamic>>();
      }
      if (data is List) return data.cast<Map<String, dynamic>>();
      return [];
    } catch (_) {
      return [];
    }
  }

  Future<Map<String, dynamic>> postForumQuestion(int courseId, String title, String content, {int? lessonId}) async {
    final body = <String, dynamic>{'title': title, 'content': content};
    if (lessonId != null) body['lessonId'] = lessonId.toString();
    final response = await _dio.post('/forum/course/$courseId', data: body);
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>?> getAssignmentByLesson(int lessonId) async {
    try {
      final response = await _dio.get('/assignments/lesson/$lessonId');
      return response.data as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  Future<Map<String, dynamic>> submitAssignment(int assignmentId, String content, String fileUrl) async {
    final response = await _dio.post('/assignments/$assignmentId/submit', data: {
      'content': content,
      'fileUrl': fileUrl,
    });
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>?> getMySubmission(int assignmentId) async {
    try {
      final response = await _dio.get('/assignments/$assignmentId/my-submission');
      return response.data as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  Future<List<Map<String, dynamic>>> getQuizAttempts(int quizId) async {
    try {
      final response = await _dio.get('/quizzes/$quizId/my-attempts');
      final data = response.data;
      if (data is List) return data.cast<Map<String, dynamic>>();
      return [];
    } catch (_) {
      return [];
    }
  }

  Future<List<Map<String, dynamic>>> getNotifications() async {
    final response = await _dio.get('/notifications');
    final data = response.data;
    if (data is List) return data.cast<Map<String, dynamic>>();
    return [];
  }

  Future<int> getUnreadCount() async {
    final response = await _dio.get('/notifications/unread-count');
    return (response.data as num).toInt();
  }

  Future<void> markNotificationRead(int id) async {
    await _dio.put('/notifications/$id/read');
  }
}

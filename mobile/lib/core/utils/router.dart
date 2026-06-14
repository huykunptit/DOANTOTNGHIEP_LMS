import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'package:lms_mobile/features/auth/data/auth_repository.dart';
import 'package:lms_mobile/features/auth/view/change_password_screen.dart';
import 'package:lms_mobile/features/auth/view/forgot_password_screen.dart';
import 'package:lms_mobile/features/auth/view/login_screen.dart';
import 'package:lms_mobile/features/auth/view/profile_screen.dart';
import 'package:lms_mobile/features/auth/view/register_screen.dart';
import 'package:lms_mobile/features/auth/view/reset_password_screen.dart';
import 'package:lms_mobile/features/auth/view/verify_email_screen.dart';
import 'package:lms_mobile/features/course/view/course_detail_screen.dart';
import 'package:lms_mobile/features/course/view/gradebook_screen.dart';
import 'package:lms_mobile/features/course/view/home_screen.dart';
import 'package:lms_mobile/features/course/view/learning_screen.dart';
import 'package:lms_mobile/features/course/view/quiz_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/login',
    redirect: (context, state) {
      final loggedIn = ref.read(isLoggedInProvider);
      final loc = state.matchedLocation;
      const publicRoutes = {
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
      };
      final isPublic = publicRoutes.contains(loc);
      if (!loggedIn && !isPublic) return '/login';
      if (loggedIn && (loc == '/login' || loc == '/register')) return '/home';
      return null;
    },
    routes: [
      // ── Auth ──────────────────────────────────────────────────────────────
      GoRoute(path: '/login', builder: (_, _) => const LoginScreen()),
      GoRoute(path: '/register', builder: (_, _) => const RegisterScreen()),
      GoRoute(path: '/forgot-password', builder: (_, _) => const ForgotPasswordScreen()),
      GoRoute(
        path: '/reset-password',
        builder: (_, state) => ResetPasswordScreen(
          initialToken: state.uri.queryParameters['token'],
        ),
      ),
      GoRoute(
        path: '/verify-email',
        builder: (_, state) => VerifyEmailScreen(
          initialToken: state.uri.queryParameters['token'],
        ),
      ),

      // ── Main ──────────────────────────────────────────────────────────────
      GoRoute(path: '/home', builder: (_, _) => const HomeScreen()),

      // ── Profile ───────────────────────────────────────────────────────────
      GoRoute(path: '/profile', builder: (_, _) => const ProfileScreen()),
      GoRoute(path: '/profile/change-password', builder: (_, _) => const ChangePasswordScreen()),

      // ── Courses ───────────────────────────────────────────────────────────
      GoRoute(
        path: '/course/:id',
        builder: (_, state) {
          final id = int.parse(state.pathParameters['id']!);
          return CourseDetailScreen(courseId: id);
        },
      ),

      // ── Learning ──────────────────────────────────────────────────────────
      GoRoute(
        path: '/learn/:courseId',
        builder: (_, state) {
          final courseId = int.parse(state.pathParameters['courseId']!);
          return LearningScreen(courseId: courseId);
        },
      ),

      // ── Quiz ──────────────────────────────────────────────────────────────
      // /quiz/:quizId/:courseId — quizId là ID của quiz object, courseId để back
      GoRoute(
        path: '/quiz/:quizId/:courseId',
        builder: (_, state) {
          final quizId = int.parse(state.pathParameters['quizId']!);
          final courseId = int.parse(state.pathParameters['courseId']!);
          return QuizScreen(quizId: quizId, courseId: courseId);
        },
      ),

      // ── Gradebook ─────────────────────────────────────────────────────────
      GoRoute(
        path: '/gradebook/:courseId',
        builder: (_, state) {
          final courseId = int.parse(state.pathParameters['courseId']!);
          return GradebookScreen(courseId: courseId);
        },
      ),
    ],
  );
});

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../../core/network/dio_client.dart';
import 'auth_models.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(
    dio: ref.watch(dioProvider),
    storage: ref.watch(secureStorageProvider),
    onAuthChange: (user) =>
        ref.read(currentUserProvider.notifier).set(user),
  );
});

final currentUserProvider =
    NotifierProvider<CurrentUserNotifier, UserResponse?>(CurrentUserNotifier.new);

class CurrentUserNotifier extends Notifier<UserResponse?> {
  @override
  UserResponse? build() => null;

  void set(UserResponse? user) => state = user;
}

/// Whether an access token is currently persisted. Used by router redirects.
final isLoggedInProvider =
    NotifierProvider<IsLoggedInNotifier, bool>(IsLoggedInNotifier.new);

class IsLoggedInNotifier extends Notifier<bool> {
  @override
  bool build() => false;

  void setLoggedIn(bool value) => state = value;
}

class AuthRepository {
  final Dio _dio;
  final FlutterSecureStorage _storage;
  final void Function(UserResponse? user) onAuthChange;

  AuthRepository({
    required Dio dio,
    required FlutterSecureStorage storage,
    required this.onAuthChange,
  })  : _dio = dio,
        _storage = storage;

  Future<AuthResponse> login(String email, String password) async {
    final res = await _dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    final auth = AuthResponse.fromJson(res.data as Map<String, dynamic>);
    await _persistTokens(auth);
    _emitUserFrom(auth);
    return auth;
  }

  Future<AuthResponse> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final res = await _dio.post('/auth/register', data: {
      'name': name,
      'email': email,
      'password': password,
    });
    final auth = AuthResponse.fromJson(res.data as Map<String, dynamic>);
    await _persistTokens(auth);
    _emitUserFrom(auth);
    return auth;
  }

  Future<void> logout() async {
    final refresh = await _storage.read(key: AuthTokens.refreshKey);
    if (refresh != null && refresh.isNotEmpty) {
      try {
        await _dio.post(
          '/auth/logout',
          options: Options(headers: {'X-Refresh-Token': refresh}),
        );
      } catch (_) {
        // ignore — clear local anyway
      }
    }
    await _clear();
  }

  Future<void> logoutAll() async {
    try {
      await _dio.post('/auth/logout-all');
    } catch (_) {
      // ignore
    }
    await _clear();
  }

  Future<UserResponse> getMe() async {
    final res = await _dio.get('/auth/me');
    final user = UserResponse.fromJson(res.data as Map<String, dynamic>);
    onAuthChange(user);
    return user;
  }

  Future<String> forgotPassword(String email) async {
    final res = await _dio.post('/auth/forgot-password', data: {'email': email});
    return (res.data as Map<String, dynamic>)['message'] as String;
  }

  Future<String> resetPassword({required String token, required String newPassword}) async {
    final res = await _dio.post('/auth/reset-password', data: {
      'token': token,
      'newPassword': newPassword,
    });
    return (res.data as Map<String, dynamic>)['message'] as String;
  }

  Future<String> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    final res = await _dio.post('/auth/change-password', data: {
      'currentPassword': currentPassword,
      'newPassword': newPassword,
    });
    await _clear();
    return (res.data as Map<String, dynamic>)['message'] as String;
  }

  Future<String> verifyEmail(String token) async {
    final res = await _dio.post('/auth/verify-email', data: {'token': token});
    return (res.data as Map<String, dynamic>)['message'] as String;
  }

  Future<String> resendVerification() async {
    final res = await _dio.post('/auth/resend-verification');
    return (res.data as Map<String, dynamic>)['message'] as String;
  }

  Future<UserResponse> updateProfile(UpdateProfileRequest request) async {
    final res = await _dio.patch('/auth/me', data: request.toJson());
    final user = UserResponse.fromJson(res.data as Map<String, dynamic>);
    onAuthChange(user);
    return user;
  }

  Future<bool> hasToken() async {
    final token = await _storage.read(key: AuthTokens.accessKey);
    return token != null && token.isNotEmpty;
  }

  Future<void> _persistTokens(AuthResponse auth) async {
    await _storage.write(key: AuthTokens.accessKey, value: auth.accessToken);
    await _storage.write(key: AuthTokens.refreshKey, value: auth.refreshToken);
  }

  void _emitUserFrom(AuthResponse auth) {
    onAuthChange(UserResponse(
      id: auth.userId,
      name: auth.name,
      email: auth.email,
      userType: null,
      active: true,
      roles: auth.roles,
    ));
  }

  Future<void> _clear() async {
    await _storage.delete(key: AuthTokens.accessKey);
    await _storage.delete(key: AuthTokens.refreshKey);
    onAuthChange(null);
  }
}

/// Helper to extract a friendly message from a DioException.
String dioErrorMessage(DioException e, String fallback) {
  final data = e.response?.data;
  if (data is Map) {
    final detail = data['detail'];
    if (detail is String && detail.isNotEmpty) return detail;
    final msg = data['message'];
    if (msg is String && msg.isNotEmpty) return msg;
  }
  return e.message ?? fallback;
}

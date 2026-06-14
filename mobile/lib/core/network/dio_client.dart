import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../features/auth/data/auth_models.dart';

final secureStorageProvider = Provider((ref) => const FlutterSecureStorage());

const _baseUrl = 'http://127.0.0.1:8080/api/v1';

final dioProvider = Provider<Dio>((ref) {
  final storage = ref.watch(secureStorageProvider);
  final dio = Dio(BaseOptions(
    baseUrl: _baseUrl,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 15),
  ));

  Future<String?>? refreshInFlight;

  Future<String?> doRefresh() {
    refreshInFlight ??= (() async {
      try {
        final refresh = await storage.read(key: AuthTokens.refreshKey);
        if (refresh == null || refresh.isEmpty) return null;
        final refreshDio = Dio(BaseOptions(baseUrl: _baseUrl));
        final res = await refreshDio.post(
          '/auth/refresh',
          options: Options(headers: {'X-Refresh-Token': refresh}),
        );
        final data = res.data as Map<String, dynamic>;
        final newAccess = data['accessToken'] as String;
        final newRefresh = data['refreshToken'] as String;
        await storage.write(key: AuthTokens.accessKey, value: newAccess);
        await storage.write(key: AuthTokens.refreshKey, value: newRefresh);
        return newAccess;
      } catch (_) {
        await storage.delete(key: AuthTokens.accessKey);
        await storage.delete(key: AuthTokens.refreshKey);
        return null;
      } finally {
        refreshInFlight = null;
      }
    })();
    return refreshInFlight!;
  }

  dio.interceptors.add(InterceptorsWrapper(
    onRequest: (options, handler) async {
      final token = await storage.read(key: AuthTokens.accessKey);
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }
      handler.next(options);
    },
    onError: (err, handler) async {
      final status = err.response?.statusCode;
      final path = err.requestOptions.path;
      final isAuthPath = path.startsWith('/auth/');
      final alreadyRetried = err.requestOptions.extra['__retried'] == true;

      if (status == 401 && !isAuthPath && !alreadyRetried) {
        final newToken = await doRefresh();
        if (newToken != null) {
          final req = err.requestOptions;
          req.extra['__retried'] = true;
          req.headers['Authorization'] = 'Bearer $newToken';
          try {
            final retried = await dio.fetch(req);
            return handler.resolve(retried);
          } catch (e) {
            if (e is DioException) return handler.next(e);
            rethrow;
          }
        }
      }
      handler.next(err);
    },
  ));

  return dio;
});

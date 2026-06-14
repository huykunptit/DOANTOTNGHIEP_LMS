import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../data/auth_repository.dart';

class VerifyEmailScreen extends ConsumerStatefulWidget {
  const VerifyEmailScreen({super.key, this.initialToken});

  final String? initialToken;

  @override
  ConsumerState<VerifyEmailScreen> createState() => _VerifyEmailScreenState();
}

class _VerifyEmailScreenState extends ConsumerState<VerifyEmailScreen> {
  late final TextEditingController _tokenController;
  bool _verifying = false;
  bool _resending = false;
  String? _result;
  bool _ok = false;

  @override
  void initState() {
    super.initState();
    _tokenController = TextEditingController(text: widget.initialToken ?? '');
    if (widget.initialToken != null && widget.initialToken!.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _verify());
    }
  }

  Future<void> _verify() async {
    final token = _tokenController.text.trim();
    if (token.isEmpty) return;
    setState(() {
      _verifying = true;
      _result = null;
    });
    try {
      final msg = await ref.read(authRepositoryProvider).verifyEmail(token);
      if (!mounted) return;
      setState(() {
        _result = msg;
        _ok = true;
      });
    } on DioException catch (e) {
      if (!mounted) return;
      setState(() {
        _result = dioErrorMessage(e, 'Xác thực email thất bại');
        _ok = false;
      });
    } finally {
      if (mounted) setState(() => _verifying = false);
    }
  }

  Future<void> _resend() async {
    setState(() => _resending = true);
    try {
      final msg = await ref.read(authRepositoryProvider).resendVerification();
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
    } on DioException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(dioErrorMessage(e, 'Gửi lại thất bại')), backgroundColor: Colors.red.shade700),
      );
    } finally {
      if (mounted) setState(() => _resending = false);
    }
  }

  @override
  void dispose() {
    _tokenController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Xác thực email')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
          child: Column(
            children: [
              const Text('Dán mã xác thực từ email của bạn để kích hoạt tài khoản.'),
              const SizedBox(height: 24),
              TextField(
                controller: _tokenController,
                decoration: const InputDecoration(labelText: 'Mã xác thực', prefixIcon: Icon(Icons.vpn_key_outlined)),
              ),
              if (_result != null) ...[
                const SizedBox(height: 16),
                Text(_result!, style: TextStyle(color: _ok ? Colors.green : Colors.red)),
              ],
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _verifying ? null : _verify,
                  child: _verifying
                      ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : const Text('XÁC THỰC'),
                ),
              ),
              const SizedBox(height: 8),
              TextButton(
                onPressed: _resending ? null : _resend,
                child: Text(_resending ? 'Đang gửi…' : 'Gửi lại email xác thực'),
              ),
              const SizedBox(height: 8),
              TextButton(
                onPressed: () => context.go('/home'),
                child: const Text('Bỏ qua'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

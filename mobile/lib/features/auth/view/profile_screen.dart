import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../data/auth_models.dart';
import '../data/auth_repository.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _bioController = TextEditingController();
  final _genderController = TextEditingController();
  final _dobController = TextEditingController();
  final _hometownController = TextEditingController();
  final _addressController = TextEditingController();

  bool _loading = false;
  bool _saving = false;
  String? _msg;
  bool _msgOk = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadProfile());
  }

  Future<void> _loadProfile() async {
    setState(() => _loading = true);
    try {
      final user = await ref.read(authRepositoryProvider).getMe();
      if (!mounted) return;
      _nameController.text = user.name;
    } catch (_) {
      // ignore — providers stay null
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _save() async {
    setState(() {
      _saving = true;
      _msg = null;
    });
    try {
      await ref.read(authRepositoryProvider).updateProfile(UpdateProfileRequest(
            name: _nameController.text.trim().isEmpty ? null : _nameController.text.trim(),
            phone: _phoneController.text.trim().isEmpty ? null : _phoneController.text.trim(),
            bio: _bioController.text.trim().isEmpty ? null : _bioController.text.trim(),
            gender: _genderController.text.trim().isEmpty ? null : _genderController.text.trim(),
            dateOfBirth: _dobController.text.trim().isEmpty ? null : _dobController.text.trim(),
            hometown: _hometownController.text.trim().isEmpty ? null : _hometownController.text.trim(),
            permanentAddress: _addressController.text.trim().isEmpty ? null : _addressController.text.trim(),
          ));
      if (!mounted) return;
      setState(() {
        _msg = 'Cập nhật hồ sơ thành công';
        _msgOk = true;
      });
    } on DioException catch (e) {
      if (!mounted) return;
      setState(() {
        _msg = dioErrorMessage(e, 'Cập nhật thất bại');
        _msgOk = false;
      });
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _logout() async {
    await ref.read(authRepositoryProvider).logout();
    if (!mounted) return;
    ref.read(isLoggedInProvider.notifier).setLoggedIn(false);
    context.go('/login');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _bioController.dispose();
    _genderController.dispose();
    _dobController.dispose();
    _hometownController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(currentUserProvider);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hồ sơ'),
        actions: [
          IconButton(icon: const Icon(Icons.logout), onPressed: _logout, tooltip: 'Đăng xuất'),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    if (user != null) ...[
                      Text(user.email, style: const TextStyle(color: Colors.grey)),
                      const SizedBox(height: 4),
                      Text('Roles: ${user.roles.join(", ")}', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                      const SizedBox(height: 16),
                    ],
                    _field('Họ tên', _nameController),
                    _field('Số điện thoại', _phoneController),
                    _field('Giới tính', _genderController),
                    _field('Ngày sinh (YYYY-MM-DD)', _dobController),
                    _field('Quê quán', _hometownController),
                    _field('Địa chỉ thường trú', _addressController),
                    _field('Tiểu sử', _bioController, maxLines: 3),
                    const SizedBox(height: 12),
                    if (_msg != null)
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: (_msgOk ? Colors.green : Colors.red).withValues(alpha: 0.08),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(_msg!, style: TextStyle(color: _msgOk ? Colors.green : Colors.red)),
                      ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: _saving ? null : _save,
                      child: _saving
                          ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                          : const Text('LƯU THAY ĐỔI'),
                    ),
                    const SizedBox(height: 8),
                    OutlinedButton(
                      onPressed: () => context.push('/profile/change-password'),
                      child: const Text('Đổi mật khẩu'),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _field(String label, TextEditingController c, {int maxLines = 1}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextField(
        controller: c,
        maxLines: maxLines,
        decoration: InputDecoration(labelText: label),
      ),
    );
  }
}

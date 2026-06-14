import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../features/auth/data/auth_repository.dart';
import '../../../features/course/data/course_repository.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _tab = 0;

  final _pages = const [
    _DashboardTab(),
    _MyCoursesTabPlaceholder(),
    _NotificationsTabPlaceholder(),
  ];

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(currentUserProvider);
    final unreadAsync = ref.watch(_unreadCountProvider);
    final unread = unreadAsync.asData?.value ?? 0;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          _tab == 0
              ? 'Xin chào${user != null ? ", ${user.name.split(' ').last}" : ""}!'
              : _tab == 1
                  ? 'Khóa học của tôi'
                  : 'Thông báo',
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_outline),
            tooltip: 'Hồ sơ',
            onPressed: () => context.push('/profile'),
          ),
        ],
      ),
      body: _pages[_tab],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        destinations: [
          const NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Trang chủ',
          ),
          const NavigationDestination(
            icon: Icon(Icons.book_outlined),
            selectedIcon: Icon(Icons.book),
            label: 'Khóa học',
          ),
          NavigationDestination(
            icon: Badge(
              isLabelVisible: unread > 0,
              label: Text(unread > 9 ? '9+' : '$unread'),
              child: const Icon(Icons.notifications_outlined),
            ),
            selectedIcon: Badge(
              isLabelVisible: unread > 0,
              label: Text(unread > 9 ? '9+' : '$unread'),
              child: const Icon(Icons.notifications),
            ),
            label: 'Thông báo',
          ),
        ],
      ),
    );
  }
}

final _unreadCountProvider = FutureProvider<int>((ref) {
  return ref.watch(courseRepositoryProvider).getUnreadCount();
});

// ═══════════════════════════════ TAB 0: DASHBOARD ═══════════════════════════

class _DashboardTab extends ConsumerWidget {
  const _DashboardTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(studentStatsProvider);
    final enrolledAsync = ref.watch(enrolledCoursesProvider);
    final allAsync = ref.watch(courseListProvider);

    return RefreshIndicator(
      onRefresh: () async {
        ref.invalidate(studentStatsProvider);
        ref.invalidate(enrolledCoursesProvider);
        ref.invalidate(courseListProvider);
      },
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // ── Stats ──
          statsAsync.when(
            loading: () => const _StatsLoading(),
            error: (_, _) => const SizedBox.shrink(),
            data: (stats) => _StatsRow(stats: stats),
          ),
          const SizedBox(height: 24),

          // ── My Courses ──
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Đang học',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
              TextButton(
                onPressed: () {},
                child: const Text('Xem tất cả'),
              ),
            ],
          ),
          const SizedBox(height: 8),
          enrolledAsync.when(
            loading: () => const Center(heightFactor: 2, child: CircularProgressIndicator()),
            error: (e, _) => _ErrorCard(message: '$e'),
            data: (courses) => courses.isEmpty
                ? _EmptyCard(
                    icon: Icons.school_outlined,
                    message: 'Chưa đăng ký khóa học nào.\nKhám phá ngay bên dưới!',
                  )
                : SizedBox(
                    height: 160,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: courses.length,
                      separatorBuilder: (_, _) => const SizedBox(width: 12),
                      itemBuilder: (ctx, i) => _EnrolledCourseCard(course: courses[i]),
                    ),
                  ),
          ),
          const SizedBox(height: 24),

          // ── Explore ──
          Text('Khám phá khóa học',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          allAsync.when(
            loading: () => const Center(heightFactor: 2, child: CircularProgressIndicator()),
            error: (e, _) => _ErrorCard(message: '$e'),
            data: (courses) => ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: courses.length,
              separatorBuilder: (_, _) => const SizedBox(height: 8),
              itemBuilder: (ctx, i) => _ExploreCourseCard(course: courses[i]),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatsRow extends StatelessWidget {
  const _StatsRow({required this.stats});
  final Map<String, dynamic> stats;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _StatCard(
            label: 'Đang học',
            value: '${stats['enrolledCourses'] ?? 0}',
            icon: Icons.book,
            color: Colors.blue,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _StatCard(
            label: 'Bài hoàn thành',
            value: '${stats['completedLessons'] ?? 0}',
            icon: Icons.check_circle,
            color: Colors.green,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _StatCard(
            label: 'Đang học',
            value: '${stats['inProgressLessons'] ?? 0}',
            icon: Icons.play_circle,
            color: Colors.orange,
          ),
        ),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({required this.label, required this.value, required this.icon, required this.color});
  final String label, value;
  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        child: Column(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 6),
            Text(value,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: color,
                    )),
            const SizedBox(height: 2),
            Text(label,
                style: Theme.of(context).textTheme.bodySmall,
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis),
          ],
        ),
      ),
    );
  }
}

class _StatsLoading extends StatelessWidget {
  const _StatsLoading();
  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(
        3,
        (_) => Expanded(
          child: Card(
            child: SizedBox(
              height: 80,
              child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
            ),
          ),
        ),
      ),
    );
  }
}

class _EnrolledCourseCard extends ConsumerWidget {
  const _EnrolledCourseCard({required this.course});
  final Map<String, dynamic> course;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final title = course['title'] ?? course['name'] ?? 'Khóa học';
    final code = course['code'] ?? '';
    final id = course['id'];

    return SizedBox(
      width: 200,
      child: Card(
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: () => context.push('/learn/$id'),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                height: 72,
                color: Colors.blue.shade50,
                child: Center(
                  child: Icon(Icons.play_circle_outline, size: 36, color: Colors.blue.shade400),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title,
                        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 4),
                    Text(code,
                        style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ExploreCourseCard extends StatelessWidget {
  const _ExploreCourseCard({required this.course});
  final Map<String, dynamic> course;

  @override
  Widget build(BuildContext context) {
    final title = course['title'] ?? course['name'] ?? 'Khóa học';
    final code = course['code'] ?? '';
    final price = course['price'];
    final priceText = (price != null && price > 0) ? '${price.toStringAsFixed(0)} ₫' : 'Miễn phí';
    final isFree = price == null || price <= 0;

    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Colors.blue.shade50,
          child: Icon(Icons.book_outlined, color: Colors.blue.shade600),
        ),
        title: Text(title, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w500)),
        subtitle: Text(code),
        trailing: Text(
          priceText,
          style: TextStyle(
            color: isFree ? Colors.green : Colors.orange.shade700,
            fontWeight: FontWeight.bold,
            fontSize: 12,
          ),
        ),
        onTap: () => context.push('/course/${course['id']}'),
      ),
    );
  }
}

// ═══════════════════════════════ TAB 1 + 2: PLACEHOLDER ═════════════════════

class _MyCoursesTabPlaceholder extends ConsumerWidget {
  const _MyCoursesTabPlaceholder();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final enrolledAsync = ref.watch(enrolledCoursesProvider);
    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(enrolledCoursesProvider),
      child: enrolledAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => _ErrorCard(message: '$e'),
        data: (courses) => courses.isEmpty
            ? _EmptyCard(
                icon: Icons.school_outlined,
                message: 'Chưa đăng ký khóa học nào.',
              )
            : ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: courses.length,
                separatorBuilder: (_, _) => const SizedBox(height: 8),
                itemBuilder: (ctx, i) {
                  final c = courses[i];
                  final title = c['title'] ?? c['name'] ?? 'Khóa học';
                  final code = c['code'] ?? '';
                  final id = c['id'];
                  return Card(
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: Colors.blue.shade50,
                        child: Icon(Icons.book, color: Colors.blue.shade600),
                      ),
                      title: Text(title, maxLines: 1, overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontWeight: FontWeight.w500)),
                      subtitle: Text(code),
                      trailing: const Icon(Icons.play_arrow, color: Colors.blue),
                      onTap: () => context.push('/learn/$id'),
                    ),
                  );
                },
              ),
      ),
    );
  }
}

class _NotificationsTabPlaceholder extends ConsumerWidget {
  const _NotificationsTabPlaceholder();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return FutureBuilder<List<Map<String, dynamic>>>(
      future: ref.watch(courseRepositoryProvider).getNotifications(),
      builder: (context, snap) {
        if (snap.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        final notifs = snap.data ?? [];
        if (notifs.isEmpty) {
          return const _EmptyCard(icon: Icons.notifications_none, message: 'Không có thông báo nào.');
        }
        return ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: notifs.length,
          separatorBuilder: (_, _) => const Divider(height: 1),
          itemBuilder: (ctx, i) {
            final n = notifs[i];
            final isRead = n['readAt'] != null;
            return ListTile(
              leading: CircleAvatar(
                backgroundColor: isRead ? Colors.grey.shade100 : Colors.blue.shade50,
                child: Icon(
                  Icons.notifications,
                  color: isRead ? Colors.grey : Colors.blue,
                ),
              ),
              title: Text(n['title'] ?? '', style: TextStyle(fontWeight: isRead ? FontWeight.normal : FontWeight.bold)),
              subtitle: Text(n['message'] ?? '', maxLines: 2, overflow: TextOverflow.ellipsis),
              onTap: isRead
                  ? null
                  : () async {
                      await ref.read(courseRepositoryProvider).markNotificationRead(n['id']);
                      ref.invalidate(_unreadCountProvider);
                    },
            );
          },
        );
      },
    );
  }
}

// ═══════════════════════════════ SHARED WIDGETS ══════════════════════════════

class _EmptyCard extends StatelessWidget {
  const _EmptyCard({required this.icon, required this.message});
  final IconData icon;
  final String message;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 56, color: Colors.grey.shade300),
            const SizedBox(height: 16),
            Text(message, textAlign: TextAlign.center, style: TextStyle(color: Colors.grey.shade500)),
          ],
        ),
      ),
    );
  }
}

class _ErrorCard extends StatelessWidget {
  const _ErrorCard({required this.message});
  final String message;

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.red.shade50,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Text('Lỗi: $message', style: const TextStyle(color: Colors.red)),
      ),
    );
  }
}

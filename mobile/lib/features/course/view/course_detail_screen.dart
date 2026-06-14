import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../data/course_repository.dart';

class CourseDetailScreen extends ConsumerStatefulWidget {
  final int courseId;
  const CourseDetailScreen({super.key, required this.courseId});

  @override
  ConsumerState<CourseDetailScreen> createState() => _CourseDetailScreenState();
}

class _CourseDetailScreenState extends ConsumerState<CourseDetailScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isEnrolling = false;

  @override
  void initState() {
    super.initState();
    // Start with 2 tabs, will dynamically update or use 2 standard tabs: About & Lessons
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _enroll() async {
    setState(() => _isEnrolling = true);
    try {
      await ref.read(courseRepositoryProvider).enroll(widget.courseId);
      ref.invalidate(enrolledCoursesProvider);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Successfully enrolled in this course!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to enroll: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isEnrolling = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final detailAsync = ref.watch(courseDetailProvider(widget.courseId));
    final contentAsync = ref.watch(courseContentProvider(widget.courseId));
    final isEnrolled = ref.watch(isEnrolledProvider(widget.courseId));

    return Scaffold(
      bottomNavigationBar: isEnrolled
          ? SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
                child: Row(
                  children: [
                    Expanded(
                      flex: 3,
                      child: FilledButton.icon(
                        onPressed: () => context.push('/learn/${widget.courseId}'),
                        icon: const Icon(Icons.play_arrow, size: 20),
                        label: const Text('Vào học'),
                        style: FilledButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      flex: 2,
                      child: OutlinedButton.icon(
                        onPressed: () => context.push('/gradebook/${widget.courseId}'),
                        icon: const Icon(Icons.grade_outlined, size: 18),
                        label: const Text('Xem điểm'),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            )
          : null,
      body: detailAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Scaffold(
          appBar: AppBar(title: const Text('Error')),
          body: Center(child: Text('Failed to load course details: $err')),
        ),
        data: (course) {
          final title = course['title'] ?? course['name'] ?? 'Course Detail';
          final code = course['code'] ?? '';
          final desc = course['description'] ?? 'No description provided.';
          final price = course['price'] ?? 0;
          final isFree = price == 0;

          return NestedScrollView(
            headerSliverBuilder: (context, innerBoxIsScrolled) {
              return [
                SliverAppBar(
                  expandedHeight: 220,
                  pinned: true,
                  floating: false,
                  flexibleSpace: FlexibleSpaceBar(
                    title: Text(
                      code,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        shadows: [Shadow(color: Colors.black54, blurRadius: 4)],
                      ),
                    ),
                    background: Stack(
                      fit: StackFit.expand,
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                Colors.indigo.shade800,
                                Colors.purple.shade700,
                              ],
                            ),
                          ),
                          child: const Center(
                            child: Icon(
                              Icons.menu_book,
                              size: 80,
                              color: Colors.white70,
                            ),
                          ),
                        ),
                        // Dark overlay gradient for readable text
                        Container(
                          decoration: const BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Colors.black38,
                                Colors.transparent,
                                Colors.black87,
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                if (isEnrolled)
                  SliverPersistentHeader(
                    pinned: true,
                    delegate: _SliverAppBarDelegate(
                      TabBar(
                        controller: _tabController,
                        labelColor: Colors.indigo,
                        unselectedLabelColor: Colors.grey,
                        indicatorColor: Colors.indigo,
                        indicatorSize: TabBarIndicatorSize.tab,
                        tabs: const [
                          Tab(icon: Icon(Icons.info_outline), text: 'About'),
                          Tab(icon: Icon(Icons.play_lesson_outlined), text: 'Lessons'),
                        ],
                      ),
                    ),
                  ),
              ];
            },
            body: isEnrolled
                ? TabBarView(
                    controller: _tabController,
                    children: [
                      _buildAboutTab(title, desc, code, isFree, price),
                      _buildLessonsTab(contentAsync),
                    ],
                  )
                : SingleChildScrollView(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: Colors.indigo.shade900,
                              ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Chip(
                              label: Text(code),
                              backgroundColor: Colors.indigo.shade50,
                              labelStyle: TextStyle(color: Colors.indigo.shade700, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(width: 8),
                            Chip(
                              label: Text(isFree ? 'Free' : '\$$price'),
                              backgroundColor: isFree ? Colors.green.shade50 : Colors.orange.shade50,
                              labelStyle: TextStyle(
                                color: isFree ? Colors.green.shade700 : Colors.orange.shade700,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        const Divider(height: 32),
                        Text(
                          'Course Overview',
                          style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          desc,
                          style: const TextStyle(fontSize: 16, height: 1.5, color: Colors.black87),
                        ),
                        const SizedBox(height: 40),
                        SizedBox(
                          width: double.infinity,
                          height: 56,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.indigo,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                              elevation: 2,
                            ),
                            onPressed: _isEnrolling ? null : _enroll,
                            child: _isEnrolling
                                ? const CircularProgressIndicator(color: Colors.white)
                                : const Text('Đăng ký khóa học', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          ),
                        ),
                      ],
                    ),
                  ),
          );
        },
      ),
    );
  }

  Widget _buildAboutTab(String title, String desc, String code, bool isFree, dynamic price) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Colors.indigo.shade900,
                ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Chip(
                label: Text(code),
                backgroundColor: Colors.indigo.shade50,
                labelStyle: TextStyle(color: Colors.indigo.shade700, fontWeight: FontWeight.bold),
              ),
              const SizedBox(width: 8),
              Chip(
                label: Text(isFree ? 'Free' : '\$$price'),
                backgroundColor: isFree ? Colors.green.shade50 : Colors.orange.shade50,
                labelStyle: TextStyle(
                  color: isFree ? Colors.green.shade700 : Colors.orange.shade700,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(width: 8),
              Chip(
                label: const Text('Enrolled'),
                backgroundColor: Colors.blue.shade50,
                labelStyle: TextStyle(color: Colors.blue.shade700, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const Divider(height: 32),
          Text(
            'Course Overview',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Text(
            desc,
            style: const TextStyle(fontSize: 16, height: 1.5, color: Colors.black87),
          ),
        ],
      ),
    );
  }

  Widget _buildLessonsTab(AsyncValue<List<dynamic>> contentAsync) {
    return contentAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, stack) => Center(child: Text('Failed to load sections: $err')),
      data: (sections) {
        if (sections.isEmpty) {
          return const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.auto_stories, size: 64, color: Colors.grey),
                SizedBox(height: 16),
                Text('No lessons or sections have been created for this course yet.', style: TextStyle(color: Colors.grey)),
              ],
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: sections.length,
          itemBuilder: (context, index) {
            final s = sections[index] as Map<String, dynamic>;
            final lessons = (s['lessons'] as List? ?? []);
            final sectionTitle = s['title'] ?? 'Section ${index + 1}';

            return Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: Colors.grey.shade200),
              ),
              margin: const EdgeInsets.only(bottom: 16),
              clipBehavior: Clip.antiAlias,
              child: ExpansionTile(
                title: Text(
                  sectionTitle,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.black87),
                ),
                subtitle: Text('${lessons.length} activities', style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
                leading: CircleAvatar(
                  backgroundColor: Colors.indigo.shade50,
                  child: Text('${index + 1}', style: TextStyle(color: Colors.indigo.shade800, fontWeight: FontWeight.bold)),
                ),
                children: lessons.map<Widget>((lessonData) {
                  final lesson = lessonData as Map<String, dynamic>;
                  final String lTitle = lesson['title'] ?? '';
                  final String lType = lesson['type'] ?? 'VIDEO';
                  final bool isCompleted = lesson['isCompleted'] ?? false;

                  IconData typeIcon;
                  Color iconColor;
                  switch (lType.toUpperCase()) {
                    case 'VIDEO':
                      typeIcon = Icons.play_circle_fill;
                      iconColor = Colors.red.shade600;
                      break;
                    case 'DOCUMENT':
                      typeIcon = Icons.description;
                      iconColor = Colors.blue.shade600;
                      break;
                    case 'QUIZ':
                      typeIcon = Icons.quiz;
                      iconColor = Colors.orange.shade600;
                      break;
                    case 'ASSIGNMENT':
                      typeIcon = Icons.assignment;
                      iconColor = Colors.purple.shade600;
                      break;
                    default:
                      typeIcon = Icons.help_outline;
                      iconColor = Colors.grey.shade600;
                  }

                  return ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
                    leading: Icon(typeIcon, color: iconColor),
                    title: Text(lTitle),
                    subtitle: Text(lType, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w500)),
                    trailing: isCompleted
                        ? const Icon(Icons.check_circle, color: Colors.green)
                        : Icon(Icons.radio_button_unchecked, color: Colors.grey.shade400),
                    onTap: () => _openActivity(context, lesson),
                  );
                }).toList(),
              ),
            );
          },
        );
      },
    );
  }

  void _openActivity(BuildContext context, Map<String, dynamic> lesson) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => ActivityWorkspaceScreen(
          lesson: lesson,
          onCompleted: () {
            ref.invalidate(courseContentProvider(widget.courseId));
          },
        ),
      ),
    );
  }
}

class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  final TabBar _tabBar;
  _SliverAppBarDelegate(this._tabBar);

  @override
  double get minExtent => _tabBar.preferredSize.height;
  @override
  double get maxExtent => _tabBar.preferredSize.height;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      color: Theme.of(context).scaffoldBackgroundColor,
      child: _tabBar,
    );
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY WORKSPACE SCREEN
// ─────────────────────────────────────────────────────────────────────────────

class ActivityWorkspaceScreen extends ConsumerStatefulWidget {
  final Map<String, dynamic> lesson;
  final VoidCallback onCompleted;

  const ActivityWorkspaceScreen({
    super.key,
    required this.lesson,
    required this.onCompleted,
  });

  @override
  ConsumerState<ActivityWorkspaceScreen> createState() => _ActivityWorkspaceScreenState();
}

class _ActivityWorkspaceScreenState extends ConsumerState<ActivityWorkspaceScreen> {
  bool _submitting = false;
  bool _localCompleted = false;

  // Local state for interactive mockup elements
  int _selectedQuizAnswerIndex = -1;
  bool _quizSubmitted = false;
  double _quizScore = 0.0;

  final TextEditingController _assignmentTextController = TextEditingController();
  bool _assignmentSubmitted = false;
  String? _assignmentFile;

  @override
  void initState() {
    super.initState();
    _localCompleted = widget.lesson['isCompleted'] ?? false;
  }

  @override
  void dispose() {
    _assignmentTextController.dispose();
    super.dispose();
  }

  Future<void> _markCompleted() async {
    setState(() => _submitting = true);
    try {
      final lessonId = widget.lesson['id'] as int;
      await ref.read(courseRepositoryProvider).tickProgress(lessonId);
      setState(() {
        _localCompleted = true;
      });
      widget.onCompleted();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Activity marked as completed!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to update progress: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final title = widget.lesson['title'] ?? 'Activity';
    final desc = widget.lesson['description'] ?? 'No activity description provided.';
    final type = (widget.lesson['type'] as String? ?? 'VIDEO').toUpperCase();

    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        actions: [
          if (_localCompleted)
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Icon(Icons.check_circle, color: Colors.green),
                  SizedBox(width: 4),
                  Text('Completed', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Banner/Header based on activity type
            _buildTypeHeader(type),
            const SizedBox(height: 20),

            // Description
            Text(
              'Activity Instructions & Details',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              desc,
              style: const TextStyle(fontSize: 15, height: 1.5, color: Colors.black87),
            ),
            const Divider(height: 40),

            // Workspace Area
            _buildWorkspaceArea(type),

            const SizedBox(height: 30),

            // Standard Completion Button if not automatically handled by specific interactive state
            if (!_localCompleted && (type == 'VIDEO' || type == 'DOCUMENT'))
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  icon: _submitting
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Icon(Icons.check_circle_outline),
                  label: const Text('Mark as Completed', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  onPressed: _submitting ? null : _markCompleted,
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildTypeHeader(String type) {
    Color cardColor;
    IconData icon;
    String label;

    switch (type) {
      case 'VIDEO':
        cardColor = Colors.red.shade50;
        icon = Icons.play_circle_outline;
        label = 'Video Lecture';
        break;
      case 'DOCUMENT':
        cardColor = Colors.blue.shade50;
        icon = Icons.file_present_outlined;
        label = 'Reading Material';
        break;
      case 'QUIZ':
        cardColor = Colors.orange.shade50;
        icon = Icons.quiz_outlined;
        label = 'Interactive Quiz';
        break;
      case 'ASSIGNMENT':
        cardColor = Colors.purple.shade50;
        icon = Icons.assignment_outlined;
        label = 'Course Assignment';
        break;
      default:
        cardColor = Colors.grey.shade50;
        icon = Icons.help_center_outlined;
        label = 'General Activity';
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: cardColor.withValues(alpha: 0.5)),
      ),
      child: Row(
        children: [
          Icon(icon, size: 40, color: Theme.of(context).primaryColor),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 2),
              Text(
                'Type: $type',
                style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
              ),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildWorkspaceArea(String type) {
    switch (type) {
      case 'VIDEO':
        return _buildVideoWorkspace();
      case 'DOCUMENT':
        return _buildDocumentWorkspace();
      case 'QUIZ':
        return _buildQuizWorkspace();
      case 'ASSIGNMENT':
        return _buildAssignmentWorkspace();
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildVideoWorkspace() {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        color: Colors.black,
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Stack(
        alignment: Alignment.center,
        children: [
          Center(
            child: Icon(
              Icons.play_arrow,
              color: Colors.white,
              size: 64,
            ),
          ),
          Positioned(
            bottom: 12,
            left: 12,
            right: 12,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('0:00 / 10:45', style: TextStyle(color: Colors.white, fontSize: 12)),
                Icon(Icons.fullscreen, color: Colors.white),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDocumentWorkspace() {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        side: BorderSide(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.picture_as_pdf, color: Colors.red.shade700, size: 36),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('lecture_notes.pdf', style: TextStyle(fontWeight: FontWeight.bold)),
                      Text('Size: 2.4 MB • Read Time: 15 mins', style: TextStyle(fontSize: 12, color: Colors.grey)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            OutlinedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Downloading file...')),
                );
              },
              icon: const Icon(Icons.download),
              label: const Text('Download PDF'),
              style: OutlinedButton.styleFrom(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildQuizWorkspace() {
    if (_quizSubmitted) {
      return Card(
        color: Colors.green.shade50,
        shape: RoundedRectangleBorder(
          side: BorderSide(color: Colors.green.shade200),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              const Icon(Icons.verified, size: 48, color: Colors.green),
              const SizedBox(height: 12),
              const Text(
                'Quiz Completed!',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.green),
              ),
              const SizedBox(height: 8),
              Text(
                'Your Score: ${_quizScore.toStringAsFixed(1)} / 10.0',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
              ),
              const SizedBox(height: 8),
              const Text('Your progress has been updated automatically.'),
            ],
          ),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Question 1: What is the primary benefit of Object-Oriented Programming (OOP)?',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
        ),
        const SizedBox(height: 12),
        ...List.generate(4, (index) {
          final options = [
            'A. To write code that executes faster',
            'B. Code reusability, modularity, and easier maintenance',
            'C. To ensure security via cryptography',
            'D. To support multi-threaded databases'
          ];
          final isSelected = _selectedQuizAnswerIndex == index;

          return Card(
            elevation: 0,
            shape: RoundedRectangleBorder(
              side: BorderSide(color: isSelected ? Colors.indigo : Colors.grey.shade300),
              borderRadius: BorderRadius.circular(8),
            ),
            margin: const EdgeInsets.only(bottom: 8),
            child: InkWell(
              onTap: () {
                setState(() {
                  _selectedQuizAnswerIndex = index;
                });
              },
              borderRadius: BorderRadius.circular(8),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: [
                    Icon(
                      isSelected ? Icons.radio_button_checked : Icons.radio_button_unchecked,
                      color: isSelected ? Colors.indigo : Colors.grey,
                    ),
                    const SizedBox(width: 12),
                    Expanded(child: Text(options[index])),
                  ],
                ),
              ),
            ),
          );
        }),
        const SizedBox(height: 16),
        SizedBox(
          width: double.infinity,
          height: 48,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.orange.shade700,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: _selectedQuizAnswerIndex == -1 || _submitting
                ? null
                : () async {
                    setState(() {
                      _submitting = true;
                    });
                    // Call completion tick API
                    try {
                      final lessonId = widget.lesson['id'] as int;
                      await ref.read(courseRepositoryProvider).tickProgress(lessonId);
                      setState(() {
                        _quizSubmitted = true;
                        _quizScore = _selectedQuizAnswerIndex == 1 ? 10.0 : 2.5; // B is correct
                        _localCompleted = true;
                      });
                      widget.onCompleted();
                    } catch (e) {
                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Failed to submit quiz: $e'), backgroundColor: Colors.red),
                        );
                      }
                    } finally {
                      setState(() {
                        _submitting = false;
                      });
                    }
                  },
            child: _submitting
                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Text('Submit Quiz', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ),
      ],
    );
  }

  Widget _buildAssignmentWorkspace() {
    if (_assignmentSubmitted) {
      return Card(
        color: Colors.purple.shade50,
        shape: RoundedRectangleBorder(
          side: BorderSide(color: Colors.purple.shade200),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Icon(Icons.check_circle, color: Colors.purple),
                  SizedBox(width: 8),
                  Text('Assignment Submitted Successfully!', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.purple)),
                ],
              ),
              const SizedBox(height: 12),
              if (_assignmentFile != null) ...[
                const Text('Submitted File:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.black54)),
                Text(_assignmentFile!, style: const TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
              ],
              const Text('Submission Text:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.black54)),
              Text(_assignmentTextController.text, style: const TextStyle(fontStyle: FontStyle.italic)),
              const Divider(height: 24),
              const Text(
                'Status: Waiting for grading',
                style: TextStyle(fontWeight: FontWeight.bold, color: Colors.deepPurple),
              )
            ],
          ),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Submission Text',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _assignmentTextController,
          maxLines: 4,
          decoration: InputDecoration(
            hintText: 'Enter your assignment answers or description here...',
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
            contentPadding: const EdgeInsets.all(12),
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'Upload File Attachment',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
        ),
        const SizedBox(height: 8),
        InkWell(
          onTap: () {
            setState(() {
              _assignmentFile = 'my_assignment_report.pdf';
            });
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('File attached: my_assignment_report.pdf')),
            );
          },
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey.shade400, style: BorderStyle.solid),
              borderRadius: BorderRadius.circular(10),
              color: Colors.grey.shade50,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.attach_file, color: Colors.grey),
                const SizedBox(width: 8),
                Text(
                  _assignmentFile ?? 'Click to attach assignment PDF or Doc',
                  style: TextStyle(color: _assignmentFile != null ? Colors.black87 : Colors.grey.shade600),
                )
              ],
            ),
          ),
        ),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          height: 48,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.purple.shade700,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: (_assignmentTextController.text.trim().isEmpty && _assignmentFile == null) || _submitting
                ? null
                : () async {
                    setState(() {
                      _submitting = true;
                    });
                    try {
                      // Trigger completion tick on backend
                      final lessonId = widget.lesson['id'] as int;
                      await ref.read(courseRepositoryProvider).tickProgress(lessonId);
                      setState(() {
                        _assignmentSubmitted = true;
                        _localCompleted = true;
                      });
                      widget.onCompleted();
                    } catch (e) {
                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Failed to submit assignment: $e'), backgroundColor: Colors.red),
                        );
                      }
                    } finally {
                      setState(() {
                        _submitting = false;
                      });
                    }
                  },
            child: _submitting
                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Text('Submit Assignment', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        )
      ],
    );
  }
}

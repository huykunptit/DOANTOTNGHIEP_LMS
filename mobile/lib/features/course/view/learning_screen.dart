import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../data/course_repository.dart';
import '../../../features/auth/data/auth_repository.dart';

class LearningScreen extends ConsumerStatefulWidget {
  final int courseId;
  const LearningScreen({super.key, required this.courseId});

  @override
  ConsumerState<LearningScreen> createState() => _LearningScreenState();
}

class _LearningScreenState extends ConsumerState<LearningScreen> {
  Map<String, dynamic>? _activeLesson;
  bool _showSidebar = false;

  // Forum
  final TextEditingController _questionController = TextEditingController();
  bool _submittingQuestion = false;

  // Assignment
  final TextEditingController _assignmentContentController = TextEditingController();
  final TextEditingController _assignmentFileUrlController = TextEditingController();
  bool _submittingAssignment = false;

  @override
  void initState() {
    super.initState();
    // Auto-select first lesson after content loads
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final content = ref.read(courseContentProvider(widget.courseId)).asData?.value;
      if (content != null) _autoSelectFirst(content);
    });
  }

  @override
  void dispose() {
    _questionController.dispose();
    _assignmentContentController.dispose();
    _assignmentFileUrlController.dispose();
    super.dispose();
  }

  Future<void> _submitQuestion() async {
    final text = _questionController.text.trim();
    if (text.isEmpty) return;
    setState(() => _submittingQuestion = true);
    try {
      await ref.read(courseRepositoryProvider).postForumQuestion(
            widget.courseId,
            text,
            text,
            lessonId: _activeLesson?['id'] as int?,
          );
      _questionController.clear();
      ref.invalidate(forumQuestionsProvider(widget.courseId));
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Đã đăng câu hỏi'), backgroundColor: Colors.green),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _submittingQuestion = false);
    }
  }

  void _autoSelectFirst(List<dynamic> sections) {
    for (final sec in sections) {
      final lessons = (sec as Map)['lessons'] as List?;
      if (lessons != null && lessons.isNotEmpty) {
        setState(() => _activeLesson = lessons.first as Map<String, dynamic>);
        return;
      }
    }
  }

  Future<void> _tickProgress() async {
    if (_activeLesson == null) return;
    final lessonId = _activeLesson!['id'] as int;
    try {
      await ref.read(courseRepositoryProvider).tickProgress(lessonId);
      ref.invalidate(courseContentProvider(widget.courseId));
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('✓ Đã đánh dấu hoàn thành'), backgroundColor: Colors.green),
        );
      }
      setState(() => _activeLesson = {..._activeLesson!, 'isCompleted': true});
    } on DioException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(dioErrorMessage(e, 'Lỗi khi lưu tiến độ')), backgroundColor: Colors.red),
        );
      }
    }
  }

  Map<String, dynamic>? _nextLesson(List<dynamic> sections) {
    if (_activeLesson == null) return null;
    final id = _activeLesson!['id'];
    bool found = false;
    for (final sec in sections) {
      for (final lesson in (sec as Map)['lessons'] as List? ?? []) {
        if (found) return lesson as Map<String, dynamic>;
        if ((lesson as Map)['id'] == id) found = true;
      }
    }
    return null;
  }

  int _completedCount(List<dynamic> sections) {
    int count = 0;
    for (final sec in sections) {
      for (final l in (sec as Map)['lessons'] as List? ?? []) {
        if ((l as Map)['isCompleted'] == true) count++;
      }
    }
    return count;
  }

  int _totalCount(List<dynamic> sections) {
    int count = 0;
    for (final sec in sections) {
      count += ((sec as Map)['lessons'] as List? ?? []).length;
    }
    return count;
  }

  @override
  Widget build(BuildContext context) {
    final contentAsync = ref.watch(courseContentProvider(widget.courseId));
    final courseAsync = ref.watch(courseDetailProvider(widget.courseId));

    final courseTitle = courseAsync.asData?.value['title'] ??
        courseAsync.asData?.value['name'] ??
        'Khóa học';

    return Scaffold(
      appBar: AppBar(
        title: Text(courseTitle, overflow: TextOverflow.ellipsis),
        actions: [
          IconButton(
            icon: Icon(_showSidebar ? Icons.menu_open : Icons.menu),
            onPressed: () => setState(() => _showSidebar = !_showSidebar),
            tooltip: 'Danh sách bài',
          ),
        ],
      ),
      body: contentAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Lỗi: $e')),
        data: (sections) {
          if (_activeLesson == null && sections.isNotEmpty) {
            WidgetsBinding.instance.addPostFrameCallback((_) => _autoSelectFirst(sections));
          }

          final completed = _completedCount(sections);
          final total = _totalCount(sections);
          final progress = total > 0 ? completed / total : 0.0;
          final next = _nextLesson(sections);

          return Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Main content ──
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (_activeLesson != null) ...[
                        // Video area
                        _ContentArea(lesson: _activeLesson!),

                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Title + actions
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      _activeLesson!['title'] ?? '',
                                      style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                ],
                              ),
                              if (_activeLesson!['description'] != null) ...[
                                const SizedBox(height: 8),
                                Text(_activeLesson!['description'] ?? '', style: Theme.of(context).textTheme.bodyMedium),
                              ],
                              const SizedBox(height: 16),

                              // Action row
                              Row(
                                children: [
                                  if (_activeLesson!['isCompleted'] != true)
                                    Expanded(
                                      child: FilledButton.icon(
                                        onPressed: _tickProgress,
                                        icon: const Icon(Icons.check_circle_outline, size: 18),
                                        label: const Text('Đánh dấu hoàn thành'),
                                        style: FilledButton.styleFrom(backgroundColor: Colors.green),
                                      ),
                                    )
                                  else
                                    Expanded(
                                      child: FilledButton.icon(
                                        onPressed: null,
                                        icon: const Icon(Icons.check_circle, size: 18),
                                        label: const Text('Đã hoàn thành'),
                                        style: FilledButton.styleFrom(backgroundColor: Colors.green.shade300),
                                      ),
                                    ),

                                  // Quiz button
                                  if (_activeLesson!['type'] == 'QUIZ') ...[
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: FilledButton.icon(
                                        onPressed: () => context.push(
                                            '/quiz/${_activeLesson!['id']}/${widget.courseId}'),
                                        icon: const Icon(Icons.quiz_outlined, size: 18),
                                        label: const Text('Làm bài kiểm tra'),
                                      ),
                                    ),
                                  ],
                                ],
                              ),

                              // Next lesson
                              if (next != null) ...[
                                const SizedBox(height: 12),
                                OutlinedButton.icon(
                                  onPressed: () => setState(() => _activeLesson = next),
                                  icon: const Icon(Icons.arrow_forward, size: 18),
                                  label: Text('Bài tiếp: ${next['title']}', overflow: TextOverflow.ellipsis),
                                  style: OutlinedButton.styleFrom(
                                    minimumSize: const Size(double.infinity, 44),
                                  ),
                                ),
                              ],

                              // Progress
                              const SizedBox(height: 16),
                              Row(
                                children: [
                                  Text('Tiến độ: $completed/$total bài',
                                      style: Theme.of(context).textTheme.bodySmall),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: ClipRRect(
                                      borderRadius: BorderRadius.circular(4),
                                      child: LinearProgressIndicator(
                                        value: progress,
                                        minHeight: 8,
                                        color: Colors.green,
                                        backgroundColor: Colors.grey.shade200,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text('${(progress * 100).round()}%',
                                      style: Theme.of(context).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ],
                          ),
                        ),

                        // ── Assignment section ──────────────────────────────
                        _AssignmentSection(
                          activeLesson: _activeLesson!,
                          repository: ref.read(courseRepositoryProvider),
                          contentController: _assignmentContentController,
                          fileUrlController: _assignmentFileUrlController,
                          submitting: _submittingAssignment,
                          onSubmit: (assignmentId) async {
                            final content = _assignmentContentController.text.trim();
                            final fileUrl = _assignmentFileUrlController.text.trim();
                            if (content.isEmpty) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Vui lòng nhập nội dung bài làm'), backgroundColor: Colors.orange),
                              );
                              return;
                            }
                            setState(() => _submittingAssignment = true);
                            try {
                              await ref.read(courseRepositoryProvider).submitAssignment(assignmentId, content, fileUrl);
                              _assignmentContentController.clear();
                              _assignmentFileUrlController.clear();
                              if (mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Nộp bài tập thành công'), backgroundColor: Colors.green),
                                );
                                setState(() {});
                              }
                            } catch (e) {
                              if (mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('Lỗi: $e'), backgroundColor: Colors.red),
                                );
                              }
                            } finally {
                              if (mounted) setState(() => _submittingAssignment = false);
                            }
                          },
                        ),

                        // ── Forum section ───────────────────────────────────
                        _ForumSection(
                          courseId: widget.courseId,
                          questionController: _questionController,
                          submitting: _submittingQuestion,
                          onSubmit: _submitQuestion,
                        ),
                      ] else
                        const Padding(
                          padding: EdgeInsets.all(32),
                          child: Center(child: Text('Chọn bài học bên phải')),
                        ),
                    ],
                  ),
                ),
              ),

              // ── Sidebar ──
              if (_showSidebar)
                SizedBox(
                  width: 260,
                  child: _LessonSidebar(
                    sections: sections,
                    activeId: _activeLesson?['id'],
                    onSelect: (lesson) {
                      setState(() {
                        _activeLesson = lesson;
                        _showSidebar = false;
                      });
                    },
                  ),
                ),
            ],
          );
        },
      ),
    );
  }
}

// ─── Content area ─────────────────────────────────────────────────────────────

class _ContentArea extends StatelessWidget {
  const _ContentArea({required this.lesson});
  final Map<String, dynamic> lesson;

  @override
  Widget build(BuildContext context) {
    final type = lesson['type'] ?? 'VIDEO';
    final videoUrl = lesson['videoUrl'] as String?;

    if (type == 'QUIZ') {
      return Container(
        color: Colors.blue.shade50,
        padding: const EdgeInsets.all(32),
        child: Column(
          children: [
            Icon(Icons.quiz, size: 56, color: Colors.blue.shade400),
            const SizedBox(height: 12),
            const Text('Bài kiểm tra', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          ],
        ),
      );
    }

    if (videoUrl != null && videoUrl.isNotEmpty) {
      return AspectRatio(
        aspectRatio: 16 / 9,
        child: Container(
          color: Colors.black,
          child: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.play_circle_outline, size: 64, color: Colors.white.withValues(alpha: 0.7)),
                const SizedBox(height: 8),
                const Text('Nhấn để xem video', style: TextStyle(color: Colors.white70)),
              ],
            ),
          ),
        ),
      );
    }

    // Document / Text
    return Container(
      color: Colors.grey.shade50,
      padding: const EdgeInsets.all(32),
      child: Column(
        children: [
          Icon(Icons.description_outlined, size: 48, color: Colors.grey.shade400),
          const SizedBox(height: 8),
          const Text('Tài liệu bài học', style: TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }
}

// ─── Assignment section ───────────────────────────────────────────────────────

class _AssignmentSection extends StatefulWidget {
  const _AssignmentSection({
    required this.activeLesson,
    required this.repository,
    required this.contentController,
    required this.fileUrlController,
    required this.submitting,
    required this.onSubmit,
  });
  final Map<String, dynamic> activeLesson;
  final CourseRepository repository;
  final TextEditingController contentController;
  final TextEditingController fileUrlController;
  final bool submitting;
  final void Function(int assignmentId) onSubmit;

  @override
  State<_AssignmentSection> createState() => _AssignmentSectionState();
}

class _AssignmentSectionState extends State<_AssignmentSection> {
  late Future<Map<String, dynamic>?> _assignmentFuture;
  int? _assignmentId;
  late Future<Map<String, dynamic>?> _submissionFuture;

  @override
  void initState() {
    super.initState();
    _loadAssignment();
  }

  @override
  void didUpdateWidget(_AssignmentSection old) {
    super.didUpdateWidget(old);
    if (old.activeLesson['id'] != widget.activeLesson['id']) {
      _loadAssignment();
    }
  }

  void _loadAssignment() {
    final lessonId = widget.activeLesson['id'] as int;
    _assignmentFuture = widget.repository.getAssignmentByLesson(lessonId);
    _assignmentFuture.then((a) {
      if (a != null && mounted) {
        final id = (a['id'] as num).toInt();
        setState(() {
          _assignmentId = id;
          _submissionFuture = widget.repository.getMySubmission(id);
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Map<String, dynamic>?>(
      future: _assignmentFuture,
      builder: (context, snap) {
        if (!snap.hasData || snap.data == null) return const SizedBox.shrink();
        final assignment = snap.data!;
        final assignmentId = _assignmentId ?? (assignment['id'] as num).toInt();

        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Divider(height: 32),
              Row(
                children: [
                  Icon(Icons.assignment_outlined, color: Colors.green.shade700, size: 20),
                  const SizedBox(width: 8),
                  Text('Bài tập',
                      style: Theme.of(context)
                          .textTheme
                          .titleMedium
                          ?.copyWith(fontWeight: FontWeight.bold, color: Colors.green.shade700)),
                ],
              ),
              const SizedBox(height: 12),
              Text(assignment['title'] ?? '',
                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
              if (assignment['description'] != null) ...[
                const SizedBox(height: 6),
                Text(assignment['description'] as String,
                    style: Theme.of(context).textTheme.bodyMedium),
              ],
              const SizedBox(height: 16),
              FutureBuilder<Map<String, dynamic>?>(
                future: _submissionFuture,
                builder: (context, subSnap) {
                  if (subSnap.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator(strokeWidth: 2));
                  }
                  final submission = subSnap.data;
                  if (submission != null) {
                    final status = submission['status'] as String? ?? 'SUBMITTED';
                    final score = submission['score'];
                    final isGraded = status == 'GRADED';
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Chip(
                              label: Text(isGraded ? 'Đã chấm điểm' : 'Đã nộp',
                                  style: const TextStyle(fontSize: 12, color: Colors.white)),
                              backgroundColor: isGraded ? Colors.green : Colors.orange,
                              padding: EdgeInsets.zero,
                            ),
                            if (isGraded && score != null) ...[
                              const SizedBox(width: 12),
                              Text('Điểm: $score',
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                            ],
                          ],
                        ),
                      ],
                    );
                  }

                  // No submission yet — show form
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      TextField(
                        controller: widget.contentController,
                        maxLines: 4,
                        decoration: InputDecoration(
                          hintText: 'Nội dung bài làm...',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                          contentPadding: const EdgeInsets.all(12),
                        ),
                      ),
                      const SizedBox(height: 10),
                      TextField(
                        controller: widget.fileUrlController,
                        decoration: InputDecoration(
                          hintText: 'URL file đính kèm (tuỳ chọn)',
                          prefixIcon: const Icon(Icons.attach_file, size: 18),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                        ),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: FilledButton.icon(
                          onPressed: widget.submitting ? null : () => widget.onSubmit(assignmentId),
                          icon: widget.submitting
                              ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                              : const Icon(Icons.upload_outlined, size: 18),
                          label: const Text('Nộp bài tập'),
                          style: FilledButton.styleFrom(
                            backgroundColor: Colors.green,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                        ),
                      ),
                    ],
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }
}

// ─── Forum section ────────────────────────────────────────────────────────────

class _ForumSection extends ConsumerWidget {
  const _ForumSection({
    required this.courseId,
    required this.questionController,
    required this.submitting,
    required this.onSubmit,
  });
  final int courseId;
  final TextEditingController questionController;
  final bool submitting;
  final VoidCallback onSubmit;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final forumAsync = ref.watch(forumQuestionsProvider(courseId));

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Divider(height: 32),
          Row(
            children: [
              Icon(Icons.forum_outlined, color: Colors.green.shade700, size: 20),
              const SizedBox(width: 8),
              Text('Hỏi & Đáp',
                  style: Theme.of(context)
                      .textTheme
                      .titleMedium
                      ?.copyWith(fontWeight: FontWeight.bold, color: Colors.green.shade700)),
            ],
          ),
          const SizedBox(height: 12),

          // Input row
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: TextField(
                  controller: questionController,
                  maxLines: 3,
                  minLines: 1,
                  decoration: InputDecoration(
                    hintText: 'Nhập câu hỏi của bạn...',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              FilledButton(
                onPressed: submitting ? null : onSubmit,
                style: FilledButton.styleFrom(
                  backgroundColor: Colors.green,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                  minimumSize: const Size(0, 48),
                ),
                child: submitting
                    ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : const Icon(Icons.send_rounded, size: 20),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Questions list
          forumAsync.when(
            loading: () => const Center(child: CircularProgressIndicator(strokeWidth: 2)),
            error: (err, st) => const Text('Không thể tải câu hỏi', style: TextStyle(color: Colors.grey)),
            data: (questions) {
              if (questions.isEmpty) {
                return const Padding(
                  padding: EdgeInsets.symmetric(vertical: 16),
                  child: Center(
                    child: Text('Chưa có câu hỏi nào. Hãy là người đầu tiên!',
                        style: TextStyle(color: Colors.grey, fontSize: 13)),
                  ),
                );
              }
              return ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: questions.length,
                separatorBuilder: (ctx2, idx) => const SizedBox(height: 8),
                itemBuilder: (ctx, i) {
                  final q = questions[i];
                  final author = q['authorName'] as String? ?? q['author'] as String? ?? '?';
                  final initial = author.isNotEmpty ? author[0].toUpperCase() : '?';
                  final replies = (q['replyCount'] as num?)?.toInt() ?? (q['replies'] as List?)?.length ?? 0;
                  return Card(
                    margin: EdgeInsets.zero,
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          CircleAvatar(
                            radius: 18,
                            backgroundColor: Colors.green.shade100,
                            child: Text(initial,
                                style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.green.shade800,
                                    fontSize: 14)),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(author,
                                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                                const SizedBox(height: 4),
                                Text(q['title'] as String? ?? q['content'] as String? ?? '',
                                    style: const TextStyle(fontSize: 13)),
                                const SizedBox(height: 6),
                                Row(
                                  children: [
                                    Icon(Icons.chat_bubble_outline, size: 13, color: Colors.grey.shade500),
                                    const SizedBox(width: 4),
                                    Text('$replies trả lời',
                                        style: TextStyle(fontSize: 11, color: Colors.grey.shade500)),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              );
            },
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}

// ─── Lesson sidebar ──────────────────────────────────────────────────────────

class _LessonSidebar extends StatelessWidget {
  const _LessonSidebar({required this.sections, required this.activeId, required this.onSelect});
  final List<dynamic> sections;
  final int? activeId;
  final void Function(Map<String, dynamic>) onSelect;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border(left: BorderSide(color: Colors.grey.shade200)),
        color: Colors.grey.shade50,
      ),
      child: ListView.builder(
        itemCount: sections.length,
        itemBuilder: (ctx, si) {
          final sec = sections[si] as Map;
          final lessons = (sec['lessons'] as List?) ?? [];
          return ExpansionTile(
            initiallyExpanded: true,
            title: Text(sec['title'] ?? 'Section ${si + 1}',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            children: lessons.map<Widget>((l) {
              final lesson = l as Map<String, dynamic>;
              final isActive = lesson['id'] == activeId;
              final isDone = lesson['isCompleted'] == true;
              final type = lesson['type'] ?? 'VIDEO';

              return ListTile(
                dense: true,
                selected: isActive,
                selectedColor: Colors.blue,
                selectedTileColor: Colors.blue.shade50,
                leading: Icon(
                  isDone
                      ? Icons.check_circle
                      : type == 'QUIZ'
                          ? Icons.quiz_outlined
                          : Icons.play_circle_outline,
                  size: 18,
                  color: isDone
                      ? Colors.green
                      : isActive
                          ? Colors.blue
                          : Colors.grey,
                ),
                title: Text(lesson['title'] ?? '',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis),
                subtitle: lesson['duration'] != null
                    ? Text('${lesson['duration']} phút', style: const TextStyle(fontSize: 10))
                    : null,
                onTap: () => onSelect(lesson),
              );
            }).toList(),
          );
        },
      ),
    );
  }
}

import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../data/course_repository.dart';
import '../../../features/auth/data/auth_repository.dart';

class QuizScreen extends ConsumerStatefulWidget {
  final int quizId;
  final int courseId;

  const QuizScreen({super.key, required this.quizId, required this.courseId});

  @override
  ConsumerState<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends ConsumerState<QuizScreen> {
  // States: start → taking → submitting → result
  _QuizState _state = _QuizState.start;
  Map<String, dynamic>? _quiz;
  Map<int, int> _answers = {}; // questionId → answerId
  Timer? _timer;
  int _secondsLeft = 0;
  Map<String, dynamic>? _result;
  String? _error;

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startQuiz(Map<String, dynamic> quiz) {
    final timeLimit = (quiz['timeLimit'] as num?)?.toInt() ?? 30;
    setState(() {
      _quiz = quiz;
      _answers = {};
      _secondsLeft = timeLimit * 60;
      _state = _QuizState.taking;
    });
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_secondsLeft <= 1) {
        t.cancel();
        _submit();
      } else {
        setState(() => _secondsLeft--);
      }
    });
  }

  Future<void> _submit() async {
    _timer?.cancel();
    setState(() => _state = _QuizState.submitting);
    try {
      // Convert Map<int, int> → Map<String, dynamic> (JSON key must be string)
      final answersPayload = _answers.map((k, v) => MapEntry(k.toString(), v));
      final result = await ref.read(courseRepositoryProvider).submitQuiz(widget.quizId, answersPayload);
      setState(() {
        _result = result;
        _state = _QuizState.result;
      });
    } on DioException catch (e) {
      setState(() {
        _error = dioErrorMessage(e, 'Nộp bài thất bại');
        _state = _QuizState.result;
      });
    }
  }

  String _formatTime(int seconds) {
    final m = seconds ~/ 60;
    final s = seconds % 60;
    return '${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Bài kiểm tra'),
        leading: _state == _QuizState.taking
            ? IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => showDialog(
                  context: context,
                  builder: (_) => AlertDialog(
                    title: const Text('Thoát bài thi?'),
                    content: const Text('Tiến độ sẽ không được lưu.'),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(context), child: const Text('Huỷ')),
                      FilledButton(
                        onPressed: () {
                          Navigator.pop(context);
                          context.pop();
                        },
                        child: const Text('Thoát'),
                      ),
                    ],
                  ),
                ),
              )
            : null,
        automaticallyImplyLeading: _state != _QuizState.taking,
        actions: _state == _QuizState.taking
            ? [
                Center(
                  child: Padding(
                    padding: const EdgeInsets.only(right: 12),
                    child: Text(
                      _formatTime(_secondsLeft),
                      style: TextStyle(
                        fontFamily: 'monospace',
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                        color: _secondsLeft < 60 ? Colors.red : null,
                      ),
                    ),
                  ),
                ),
              ]
            : null,
      ),
      body: switch (_state) {
        _QuizState.start => _StartPage(quizId: widget.quizId, onStart: _startQuiz),
        _QuizState.taking => _TakingPage(quiz: _quiz!, answers: _answers, onSelect: (qId, aId) {
            setState(() => _answers[qId] = aId);
          }, onSubmit: _submit),
        _QuizState.submitting => const Center(child: CircularProgressIndicator()),
        _QuizState.result => _ResultPage(
            quizId: widget.quizId,
            result: _result,
            error: _error,
            passScore: (_quiz?['passScore'] as num?)?.toDouble() ?? 0,
            onRetry: () {
              setState(() {
                _state = _QuizState.start;
                _result = null;
                _error = null;
              });
            },
            onBack: () => context.pop(),
          ),
      },
    );
  }
}

enum _QuizState { start, taking, submitting, result }

// ─── Start page ───────────────────────────────────────────────────────────────

class _StartPage extends ConsumerWidget {
  const _StartPage({required this.quizId, required this.onStart});
  final int quizId;
  final void Function(Map<String, dynamic>) onStart;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final quizAsync = ref.watch(quizStudentProvider(quizId));
    return quizAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('Lỗi: $e')),
      data: (quiz) {
        final questions = (quiz['questions'] as List?) ?? [];
        final timeLimit = quiz['timeLimit'] ?? 30;
        final passScore = quiz['passScore'] ?? 50;

        return SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 16),
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: Colors.blue.shade50,
                  shape: BoxShape.circle,
                ),
                child: Icon(Icons.quiz, size: 42, color: Colors.blue.shade600),
              ),
              const SizedBox(height: 16),
              Text(quiz['title'] ?? 'Quiz',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center),
              if (quiz['description'] != null) ...[
                const SizedBox(height: 8),
                Text(quiz['description'] ?? '', style: Theme.of(context).textTheme.bodyMedium, textAlign: TextAlign.center),
              ],
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(child: _InfoTile(icon: Icons.help_outline, label: 'Câu hỏi', value: '${questions.length}')),
                  const SizedBox(width: 12),
                  Expanded(child: _InfoTile(icon: Icons.timer_outlined, label: 'Thời gian', value: '$timeLimit phút')),
                  const SizedBox(width: 12),
                  Expanded(child: _InfoTile(icon: Icons.star_outline, label: 'Điểm qua', value: '$passScore')),
                ],
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: questions.isEmpty ? null : () => onStart(quiz),
                  icon: const Icon(Icons.play_arrow),
                  label: Text(questions.isEmpty ? 'Chưa có câu hỏi' : 'Bắt đầu làm bài'),
                  style: FilledButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _InfoTile extends StatelessWidget {
  const _InfoTile({required this.icon, required this.label, required this.value});
  final IconData icon;
  final String label, value;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Icon(icon, color: Colors.blue),
            const SizedBox(height: 4),
            Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            Text(label, style: const TextStyle(fontSize: 11, color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}

// ─── Taking page ──────────────────────────────────────────────────────────────

class _TakingPage extends StatelessWidget {
  const _TakingPage({required this.quiz, required this.answers, required this.onSelect, required this.onSubmit});
  final Map<String, dynamic> quiz;
  final Map<int, int> answers;
  final void Function(int questionId, int answerId) onSelect;
  final VoidCallback onSubmit;

  @override
  Widget build(BuildContext context) {
    final questions = (quiz['questions'] as List?) ?? [];
    return Column(
      children: [
        // Progress
        LinearProgressIndicator(
          value: questions.isEmpty ? 0 : answers.length / questions.length,
          backgroundColor: Colors.grey.shade200,
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Đã trả lời: ${answers.length}/${questions.length}',
                  style: const TextStyle(fontSize: 12, color: Colors.grey)),
            ],
          ),
        ),
        Expanded(
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: questions.length,
            separatorBuilder: (_, _) => const SizedBox(height: 16),
            itemBuilder: (ctx, i) {
              final q = questions[i] as Map<String, dynamic>;
              final qId = (q['id'] as num).toInt();
              final selectedId = answers[qId];
              final answerList = (q['answers'] as List?) ?? [];

              return Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Câu ${i + 1}/${questions.length}',
                          style: const TextStyle(fontSize: 11, color: Colors.grey)),
                      const SizedBox(height: 8),
                      Text(q['content'] ?? '',
                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                      const SizedBox(height: 12),
                      ...answerList.map((a) {
                        final answer = a as Map<String, dynamic>;
                        final aId = (answer['id'] as num).toInt();
                        final isSelected = selectedId == aId;
                        return GestureDetector(
                          onTap: () => onSelect(qId, aId),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 150),
                            margin: const EdgeInsets.only(bottom: 8),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            decoration: BoxDecoration(
                              color: isSelected ? Colors.blue.shade50 : Colors.grey.shade50,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(
                                color: isSelected ? Colors.blue : Colors.grey.shade200,
                                width: isSelected ? 2 : 1,
                              ),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  isSelected ? Icons.radio_button_checked : Icons.radio_button_unchecked,
                                  color: isSelected ? Colors.blue : Colors.grey,
                                  size: 20,
                                ),
                                const SizedBox(width: 10),
                                Expanded(child: Text(answer['content'] ?? '', style: const TextStyle(fontSize: 14))),
                              ],
                            ),
                          ),
                        );
                      }),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(16),
          child: SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: onSubmit,
              style: FilledButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
              child: Text('Nộp bài (${answers.length}/${questions.length} câu)'),
            ),
          ),
        ),
      ],
    );
  }
}

// ─── Result page ──────────────────────────────────────────────────────────────

class _ResultPage extends ConsumerWidget {
  const _ResultPage({
    required this.quizId,
    required this.result,
    required this.error,
    required this.passScore,
    required this.onRetry,
    required this.onBack,
  });
  final int quizId;
  final Map<String, dynamic>? result;
  final String? error;
  final double passScore;
  final VoidCallback onRetry, onBack;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline, size: 56, color: Colors.red),
              const SizedBox(height: 12),
              Text(error!, textAlign: TextAlign.center),
              const SizedBox(height: 20),
              FilledButton(onPressed: onBack, child: const Text('Quay lại')),
            ],
          ),
        ),
      );
    }

    final passed = result?['passed'] == true;
    final score = (result?['score'] as num?)?.toDouble() ?? 0.0;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          const SizedBox(height: 16),
          Icon(
            passed ? Icons.emoji_events : Icons.replay,
            size: 80,
            color: passed ? Colors.amber : Colors.grey,
          ),
          const SizedBox(height: 16),
          Text(
            passed ? 'Chúc mừng! Bạn đã vượt qua!' : 'Chưa đạt — Thử lại nào!',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: passed ? Colors.green : Colors.orange,
                ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  Text(
                    score.toStringAsFixed(1),
                    style: TextStyle(
                      fontSize: 64,
                      fontWeight: FontWeight.bold,
                      color: passed ? Colors.green : Colors.orange,
                    ),
                  ),
                  Text('Điểm của bạn', style: TextStyle(color: Colors.grey.shade600)),
                  const Divider(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.flag_outlined, size: 16, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text('Điểm đạt: $passScore', style: const TextStyle(color: Colors.grey)),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: onBack,
                  icon: const Icon(Icons.arrow_back, size: 18),
                  label: const Text('Về bài học'),
                  style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
                ),
              ),
              if (!passed) ...[
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton.icon(
                    onPressed: onRetry,
                    icon: const Icon(Icons.replay, size: 18),
                    label: const Text('Làm lại'),
                    style: FilledButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
                  ),
                ),
              ],
            ],
          ),

          // ── Attempts history ──────────────────────────────────────────
          const SizedBox(height: 32),
          _AttemptsHistory(quizId: quizId, passScore: passScore),
        ],
      ),
    );
  }
}

// ─── Attempts history ─────────────────────────────────────────────────────────

class _AttemptsHistory extends ConsumerWidget {
  const _AttemptsHistory({required this.quizId, required this.passScore});
  final int quizId;
  final double passScore;

  String _formatDate(dynamic raw) {
    if (raw == null) return '';
    try {
      final dt = DateTime.parse(raw.toString()).toLocal();
      return '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year} '
          '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return raw.toString();
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return FutureBuilder<List<Map<String, dynamic>>>(
      future: ref.read(courseRepositoryProvider).getQuizAttempts(quizId),
      builder: (context, snap) {
        final attempts = snap.data ?? [];
        if (snap.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator(strokeWidth: 2));
        }
        if (attempts.isEmpty) return const SizedBox.shrink();

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.history_outlined, color: Colors.green.shade700, size: 20),
                const SizedBox(width: 8),
                Text(
                  'Lịch sử làm bài',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Colors.green.shade700,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: attempts.length,
              separatorBuilder: (ctx2, idx) => const SizedBox(height: 8),
              itemBuilder: (ctx, i) {
                final attempt = attempts[i];
                final attemptScore = (attempt['score'] as num?)?.toDouble() ?? 0.0;
                final attemptPassed = attempt['passed'] == true || attemptScore >= passScore;
                final submittedAt = attempt['submittedAt'] ?? attempt['createdAt'];
                return Card(
                  margin: EdgeInsets.zero,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 16,
                          backgroundColor:
                              attemptPassed ? Colors.green.shade50 : Colors.orange.shade50,
                          child: Text(
                            '${i + 1}',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                              color: attemptPassed ? Colors.green.shade700 : Colors.orange.shade700,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Lần ${i + 1}',
                                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                              if (submittedAt != null)
                                Text(_formatDate(submittedAt),
                                    style: TextStyle(fontSize: 11, color: Colors.grey.shade500)),
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              attemptScore.toStringAsFixed(1),
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: attemptPassed ? Colors.green : Colors.orange,
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: attemptPassed ? Colors.green.shade50 : Colors.orange.shade50,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: attemptPassed ? Colors.green.shade200 : Colors.orange.shade200,
                                ),
                              ),
                              child: Text(
                                attemptPassed ? 'Đạt' : 'Chưa đạt',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: attemptPassed ? Colors.green.shade700 : Colors.orange.shade700,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ],
        );
      },
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/course_repository.dart';

class GradebookScreen extends ConsumerWidget {
  final int courseId;
  const GradebookScreen({super.key, required this.courseId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bảng điểm')),
      body: FutureBuilder<Map<String, dynamic>>(
        future: ref.watch(courseRepositoryProvider).getGradebook(courseId),
        builder: (context, snap) {
          if (snap.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snap.hasError) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.error_outline, size: 48, color: Colors.red),
                  const SizedBox(height: 8),
                  Text('Không thể tải bảng điểm', style: TextStyle(color: Colors.grey.shade600)),
                ],
              ),
            );
          }

          final data = snap.data;
          if (data == null) return const Center(child: Text('Không có dữ liệu'));

          final items = (data['items'] as List?) ?? [];
          final totalScore = (data['totalScore'] as num?)?.toDouble();
          final maxScore = (data['maxScore'] as num?)?.toDouble();

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Summary card
              if (totalScore != null)
                Card(
                  color: Colors.blue.shade50,
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        const Icon(Icons.emoji_events, size: 36, color: Colors.amber),
                        const SizedBox(width: 16),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Điểm tổng kết', style: TextStyle(color: Colors.grey)),
                            Text(
                              '${totalScore.toStringAsFixed(1)}${maxScore != null ? ' / ${maxScore.toStringAsFixed(1)}' : ''}',
                              style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              if (totalScore != null) const SizedBox(height: 16),

              // Grade items
              if (items.isEmpty)
                const Card(
                  child: Padding(
                    padding: EdgeInsets.all(24),
                    child: Center(child: Text('Chưa có điểm nào được cập nhật.')),
                  ),
                )
              else
                ...items.map((item) {
                  final m = item as Map<String, dynamic>;
                  final score = (m['score'] as num?)?.toDouble();
                  final maxS = (m['maxScore'] as num?)?.toDouble() ?? 100.0;
                  final percent = score != null ? (score / maxS).clamp(0.0, 1.0) : null;

                  return Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: Padding(
                      padding: const EdgeInsets.all(14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                m['itemType'] == 'QUIZ' ? Icons.quiz_outlined : Icons.assignment_outlined,
                                size: 18,
                                color: Colors.blue,
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(m['name'] ?? 'Bài kiểm tra',
                                    style: const TextStyle(fontWeight: FontWeight.w600)),
                              ),
                              Text(
                                score != null ? score.toStringAsFixed(1) : '—',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                  color: score == null
                                      ? Colors.grey
                                      : (percent! >= 0.5 ? Colors.green : Colors.red),
                                ),
                              ),
                              Text(' / ${maxS.toStringAsFixed(0)}',
                                  style: const TextStyle(color: Colors.grey, fontSize: 13)),
                            ],
                          ),
                          if (percent != null) ...[
                            const SizedBox(height: 8),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(4),
                              child: LinearProgressIndicator(
                                value: percent,
                                minHeight: 6,
                                color: percent >= 0.5 ? Colors.green : Colors.red,
                                backgroundColor: Colors.grey.shade200,
                              ),
                            ),
                          ],
                          if (m['feedback'] != null && (m['feedback'] as String).isNotEmpty) ...[
                            const SizedBox(height: 8),
                            Text('Nhận xét: ${m['feedback']}',
                                style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
                          ],
                        ],
                      ),
                    ),
                  );
                }),
            ],
          );
        },
      ),
    );
  }
}

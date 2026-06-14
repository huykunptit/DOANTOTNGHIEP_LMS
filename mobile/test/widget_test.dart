import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lms_mobile/main.dart';

void main() {
  testWidgets('App boots to login screen', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: LmsApp()));
    await tester.pumpAndSettle();

    // Expect to see the login screen
    expect(find.text('Eript LMS'), findsOneWidget);
    expect(find.text('LOGIN'), findsOneWidget);
  });
}

package com.eript.lms.config;

import com.eript.lms.academic.entity.organization.Institution;
import com.eript.lms.academic.entity.organization.Position;
import com.eript.lms.academic.entity.organization.Unit;
import com.eript.lms.academic.entity.training.AcademicYear;
import com.eript.lms.academic.entity.training.Cohort;
import com.eript.lms.academic.entity.training.Major;
import com.eript.lms.academic.entity.training.Program;
import com.eript.lms.academic.entity.training.ProgramType;
import com.eript.lms.academic.entity.training.Term;
import com.eript.lms.academic.repository.organization.InstitutionRepository;
import com.eript.lms.academic.repository.organization.PositionRepository;
import com.eript.lms.academic.repository.organization.UnitRepository;
import com.eript.lms.academic.repository.training.AcademicYearRepository;
import com.eript.lms.academic.repository.training.CohortRepository;
import com.eript.lms.academic.repository.training.MajorRepository;
import com.eript.lms.academic.repository.training.ProgramRepository;
import com.eript.lms.academic.repository.training.ProgramTypeRepository;
import com.eript.lms.academic.repository.training.TermRepository;
import com.eript.lms.auth.entity.auth.User;
import com.eript.lms.auth.entity.rbac.Permission;
import com.eript.lms.auth.entity.rbac.Role;
import com.eript.lms.auth.repository.auth.PasswordResetTokenRepository;
import com.eript.lms.auth.repository.auth.RefreshTokenRepository;
import com.eript.lms.auth.repository.auth.UserRepository;
import com.eript.lms.auth.repository.rbac.PermissionRepository;
import com.eript.lms.auth.repository.rbac.RoleRepository;
import com.eript.lms.course.entity.CourseEnrollment;
import com.eript.lms.course.entity.LessonProgress;
import com.eript.lms.course.entity.assignment.AssignmentSubmission;
import com.eript.lms.course.entity.assignment.LessonAssignment;
import com.eript.lms.course.entity.content.Course;
import com.eript.lms.course.entity.content.Lesson;
import com.eript.lms.course.entity.content.Section;
import com.eript.lms.course.entity.forum.CourseQA;
import com.eript.lms.course.entity.forum.CourseQAReply;
import com.eript.lms.course.entity.grade.Grade;
import com.eript.lms.course.entity.grade.GradeItem;
import com.eript.lms.course.repository.CourseEnrollmentRepository;
import com.eript.lms.course.repository.CourseRepository;
import com.eript.lms.course.repository.LessonProgressRepository;
import com.eript.lms.course.repository.LessonRepository;
import com.eript.lms.course.repository.SectionRepository;
import com.eript.lms.course.repository.assignment.AssignmentSubmissionRepository;
import com.eript.lms.course.repository.assignment.LessonAssignmentRepository;
import com.eript.lms.course.repository.forum.CourseQARepository;
import com.eript.lms.course.repository.forum.CourseQAReplyRepository;
import com.eript.lms.course.repository.grade.GradeItemRepository;
import com.eript.lms.course.repository.grade.GradeRepository;
import com.eript.lms.exam.entity.assessment.Exam;
import com.eript.lms.exam.entity.assessment.Quiz;
import com.eript.lms.exam.entity.assessment.QuizQuestion;
import com.eript.lms.exam.entity.question.Answer;
import com.eript.lms.exam.entity.question.Question;
import com.eript.lms.exam.entity.question.QuestionBank;
import com.eript.lms.exam.entity.question.QuestionGroup;
import com.eript.lms.exam.repository.assessment.ExamRepository;
import com.eript.lms.exam.repository.assessment.QuizAttemptRepository;
import com.eript.lms.exam.repository.assessment.QuizQuestionRepository;
import com.eript.lms.exam.repository.assessment.QuizRepository;
import com.eript.lms.exam.repository.question.AnswerRepository;
import com.eript.lms.exam.repository.question.QuestionBankRepository;
import com.eript.lms.exam.repository.question.QuestionRepository;
import com.eript.lms.media.entity.MediaFile;
import com.eript.lms.media.repository.MediaFileRepository;
import com.eript.lms.notification.entity.Notification;
import com.eript.lms.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final InstitutionRepository institutionRepository;
    private final UnitRepository unitRepository;
    private final PositionRepository positionRepository;
    private final ProgramTypeRepository programTypeRepository;
    private final ProgramRepository programRepository;
    private final MajorRepository majorRepository;
    private final CohortRepository cohortRepository;
    private final AcademicYearRepository academicYearRepository;
    private final TermRepository termRepository;
    private final CourseRepository courseRepository;
    private final SectionRepository sectionRepository;
    private final LessonRepository lessonRepository;
    private final LessonAssignmentRepository lessonAssignmentRepository;
    private final GradeItemRepository gradeItemRepository;
    private final GradeRepository gradeRepository;
    private final CourseQARepository courseQARepository;
    private final CourseQAReplyRepository courseQAReplyRepository;
    private final CourseEnrollmentRepository courseEnrollmentRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final AssignmentSubmissionRepository assignmentSubmissionRepository;
    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final QuestionBankRepository questionBankRepository;
    private final ExamRepository examRepository;
    private final MediaFileRepository mediaFileRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DataSeeder.class);

    @Override
    public void run(String... args) {
        runSafe("seedRbac", this::seedRbac);
        runSafe("seedOrg", this::seedOrg);
        runSafe("seedAcademic", this::seedAcademic);
        runSafe("seedCourseContent", this::seedCourseContent);
        runSafe("seedStudentActivities", this::seedStudentActivities);
        runSafe("seedExamAndSupport", this::seedExamAndSupport);
    }

    private void runSafe(String name, Runnable task) {
        try {
            task.run();
        } catch (Exception e) {
            log.warn("DataSeeder.{} skipped: {}", name, e.getMessage());
        }
    }

    private void seedRbac() {
        Permission viewCourses = permissionRepository.findAll().stream()
                .filter(p -> "courses.view".equalsIgnoreCase(p.getName()))
                .findFirst()
                .orElseGet(() -> permissionRepository.save(Permission.builder().name("courses.view").guardName("web").build()));
        Permission manageCourses = permissionRepository.findAll().stream()
                .filter(p -> "courses.manage".equalsIgnoreCase(p.getName()))
                .findFirst()
                .orElseGet(() -> permissionRepository.save(Permission.builder().name("courses.manage").guardName("web").build()));

        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_ADMIN").guardName("web").build()));
        adminRole.getPermissions().add(viewCourses);
        adminRole.getPermissions().add(manageCourses);
        roleRepository.save(adminRole);

        Role instructorRole = roleRepository.findByName("ROLE_INSTRUCTOR")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_INSTRUCTOR").guardName("web").build()));
        instructorRole.getPermissions().add(viewCourses);
        instructorRole.getPermissions().add(manageCourses);
        roleRepository.save(instructorRole);

        Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_STUDENT").guardName("web").build()));
        studentRole.getPermissions().add(viewCourses);
        roleRepository.save(studentRole);

        User admin = userRepository.findByEmail("admin@lms.local").orElseGet(() -> userRepository.save(User.builder()
                .name("System Admin")
                .email("admin@lms.local")
                .password(passwordEncoder.encode("Admin@12345"))
                .userType("ADMIN")
                .active(true)
                .roles(Set.of(adminRole))
                .build()));

        userRepository.findByEmail("instructor@lms.local").orElseGet(() -> userRepository.save(User.builder()
                .name("Default Instructor")
                .email("instructor@lms.local")
                .password(passwordEncoder.encode("Instructor@12345"))
                .userType("STAFF")
                .staffCode("GV001")
                .active(true)
                .roles(Set.of(instructorRole))
                .build()));

        userRepository.findByEmail("student@lms.local").orElseGet(() -> userRepository.save(User.builder()
                .name("Default Student")
                .email("student@lms.local")
                .password(passwordEncoder.encode("Student@12345"))
                .userType("STUDENT")
                .studentCode("SV001")
                .studyStatus("ACTIVE")
                .active(true)
                .roles(Set.of(studentRole))
                .build()));
    }

    private void seedOrg() {
        Institution institution = institutionRepository.findAll().stream().findFirst()
                .orElseGet(() -> institutionRepository.save(Institution.builder()
                        .code("PTIT")
                        .name("PTIT Default Institution")
                        .shortName("PTIT")
                        .build()));
        unitRepository.findAll().stream().findFirst()
                .orElseGet(() -> unitRepository.save(Unit.builder()
                        .code("CNTT")
                        .name("Faculty of Information Technology")
                        .institution(institution)
                        .level(1)
                        .type("FACULTY")
                        .build()));
        positionRepository.findAll().stream().findFirst()
                .orElseGet(() -> positionRepository.save(Position.builder().name("Lecturer").build()));
    }

    private void seedAcademic() {
        ProgramType programType = programTypeRepository.findAll().stream().findFirst()
                .orElseGet(() -> programTypeRepository.save(ProgramType.builder()
                        .code("FULLTIME").name("Full-time").build()));
        Program program = programRepository.findAll().stream().findFirst()
                .orElseGet(() -> programRepository.save(Program.builder()
                        .code("CS").name("Computer Science").programType(programType).build()));
        majorRepository.findAll().stream().findFirst()
                .orElseGet(() -> majorRepository.save(Major.builder()
                        .code("SE").name("Software Engineering").program(program).build()));
        cohortRepository.findAll().stream().findFirst()
                .orElseGet(() -> cohortRepository.save(Cohort.builder()
                        .code("K18").name("K18").startYear(2022).endYear(2026).build()));
        academicYearRepository.findAll().stream().findFirst()
                .orElseGet(() -> academicYearRepository.save(AcademicYear.builder()
                        .code("2025-2026").name("2025-2026").build()));
        termRepository.findAll().stream().findFirst()
                .orElseGet(() -> termRepository.save(Term.builder()
                        .code("FALL2026").name("Fall 2026").build()));

        seedPtitItCurriculum(programType, program);
    }

    private void seedPtitItCurriculum(ProgramType programType, Program program) {
        User instructor = userRepository.findByEmail("instructor@lms.local").orElseThrow();
        CourseSeed[] courses = new CourseSeed[] {
                new CourseSeed("INT11176", "Nhập môn Internet và eLearning", 2, "HK1"),
                new CourseSeed("BAS1150", "Triết học Mác-Lênin", 3, "HK1"),
                new CourseSeed("BAS1201", "Đại số", 3, "HK1"),
                new CourseSeed("BAS1203", "Giải tích 1", 3, "HK1"),
                new CourseSeed("INT1154", "Tin học cơ sở 1", 2, "HK1"),
                new CourseSeed("BAS1151", "Kinh tế chính trị Mác-Lênin", 2, "HK1"),
                new CourseSeed("BAS1224", "Vật lý 1 và thí nghiệm", 4, "HK1"),
                new CourseSeed("SKD1103", "Kỹ năng tạo lập văn bản", 1, "HK1"),
                new CourseSeed("BAS1226", "Xác suất thống kê", 2, "HK2"),
                new CourseSeed("BAS1141", "Tiếng Anh A11", 3, "HK2"),
                new CourseSeed("BAS1204", "Giải tích 2", 3, "HK2"),
                new CourseSeed("INT1155", "Tin học cơ sở 2", 2, "HK2"),
                new CourseSeed("ELE1433", "Kỹ thuật số", 2, "HK2"),
                new CourseSeed("BAS1152", "Chủ nghĩa xã hội khoa học", 2, "HK2"),
                new CourseSeed("ELE1330", "Xử lý tín hiệu số", 2, "HK2"),
                new CourseSeed("BAS1227", "Vật lý 3 và thí nghiệm", 4, "HK2"),
                new CourseSeed("BAS1142", "Tiếng Anh A12", 4, "HK3"),
                new CourseSeed("INT1358", "Toán rời rạc 1", 3, "HK3"),
                new CourseSeed("INT1339", "Ngôn ngữ lập trình C++", 3, "HK3"),
                new CourseSeed("BAS1122", "Tư tưởng Hồ Chí Minh", 2, "HK3"),
                new CourseSeed("ELE1319", "Lý thuyết thông tin", 3, "HK3"),
                new CourseSeed("INT13145", "Kiến trúc máy tính", 3, "HK3")
        };

        for (int i = 0; i < courses.length; i++) {
            CourseSeed seed = courses[i];
            Course course = courseRepository.findByCode(seed.code).orElseGet(() -> courseRepository.save(Course.builder()
                    .code(seed.code)
                    .slug(slugify(seed.code + " " + seed.name))
                    .title(seed.name)
                    .description("PTIT " + seed.semester + " - " + seed.name)
                    .price(BigDecimal.ZERO)
                    .status("PUBLISHED")
                    .userId(instructor.getId())
                    .courseMode("ONLINE")
                    .creditBearing(true)
                    .creditValue(seed.credits)
                    .programTypeId(programType.getId())
                    .programId(program.getId())
                    .active(true)
                    .build()));

            Section section = sectionRepository.findAll().stream()
                    .filter(s -> s.getCourse() != null && course.getId().equals(s.getCourse().getId()) && s.getPosition() == 1)
                    .findFirst()
                    .orElseGet(() -> sectionRepository.save(Section.builder()
                            .course(course)
                            .position(1)
                            .title(seed.semester + " - Tổng quan")
                            .build()));

            lessonRepository.findAll().stream()
                    .filter(l -> l.getSection() != null && section.getId().equals(l.getSection().getId()))
                    .findFirst()
                    .orElseGet(() -> lessonRepository.save(Lesson.builder()
                            .course(course)
                            .section(section)
                            .title(seed.name + " - Bài học mở đầu")
                            .description("Giới thiệu và tài nguyên học tập cho " + seed.name)
                            .duration(20)
                            .orderIndex(1)
                            .preview(true)
                            .type("VIDEO")
                            .videoStatus("READY")
                            .build()));
        }
    }

    private String slugify(String input) {
        return input.toLowerCase()
                .replaceAll("[^a-z0-9\u00C0-\u1EF9]+", "-")
                .replaceAll("(^-|-$)", "");
    }

    private record CourseSeed(String code, String name, int credits, String semester) {}

    private void seedCourseContent() {
        User instructor = userRepository.findByEmail("instructor@lms.local").orElseThrow();
        Course course = courseRepository.findByCode("CS101").orElseGet(() -> courseRepository.save(Course.builder()
                .code("CS101")
                .slug("introduction-to-computer-science")
                .title("Introduction to Computer Science")
                .description("Starter course for LMS demo data")
                .price(BigDecimal.ZERO)
                .status("PUBLISHED")
                .userId(instructor.getId())
                .courseMode("ONLINE")
                .creditBearing(false)
                .active(true)
                .build()));

        Section section = sectionRepository.findAll().stream()
                .filter(s -> s.getCourse() != null && course.getId().equals(s.getCourse().getId()))
                .findFirst()
                .orElseGet(() -> sectionRepository.save(Section.builder()
                        .course(course)
                        .position(1)
                        .title("Getting Started")
                        .build()));

        Lesson lesson = lessonRepository.findAll().stream()
                .filter(l -> l.getSection() != null && section.getId().equals(l.getSection().getId()))
                .findFirst()
                .orElseGet(() -> lessonRepository.save(Lesson.builder()
                        .course(course)
                        .section(section)
                        .title("Welcome to the Course")
                        .description("Overview and setup")
                        .duration(10)
                        .orderIndex(1)
                        .preview(true)
                        .type("VIDEO")
                        .videoStatus("READY")
                        .build()));

        LessonAssignment assignment = lessonAssignmentRepository.findAll().stream()
                .filter(a -> a.getLesson() != null && lesson.getId().equals(a.getLesson().getId()))
                .findFirst()
                .orElseGet(() -> lessonAssignmentRepository.save(LessonAssignment.builder()
                        .lesson(lesson)
                        .instructions("Introduce yourself and explain what you want to learn.")
                        .maxScore(new BigDecimal("100.00"))
                        .allowLateSubmission(true)
                        .dueDate(LocalDateTime.now().plusDays(7))
                        .build()));

        GradeItem gradeItem = gradeItemRepository.findAll().stream()
                .filter(g -> g.getCourse() != null && course.getId().equals(g.getCourse().getId()))
                .findFirst()
                .orElseGet(() -> gradeItemRepository.save(GradeItem.builder()
                        .course(course)
                        .itemType("ASSIGNMENT")
                        .name("Welcome Assignment")
                        .maxScore(new BigDecimal("100.00"))
                        .weight(new BigDecimal("1.00"))
                        .sortOrder(1)
                        .build()));

        if (courseEnrollmentRepository.count() == 0) {
            courseEnrollmentRepository.save(CourseEnrollment.builder()
                    .course(course)
                    .userId(userRepository.findByEmail("student@lms.local").orElseThrow().getId())
                    .status("ENROLLED")
                    .progressPercent(15)
                    .enrolledAt(LocalDateTime.now().minusDays(2))
                    .lastAccessedAt(LocalDateTime.now())
                    .build());
        }

        if (lessonProgressRepository.count() == 0) {
            lessonProgressRepository.save(LessonProgress.builder()
                    .lesson(lesson)
                    .userId(userRepository.findByEmail("student@lms.local").orElseThrow().getId())
                    .completed(false)
                    .progressPercent(35)
                    .lastPosition(120)
                    .watchedSeconds(120)
                    .lastWatchedAt(LocalDateTime.now())
                    .build());
        }

        if (assignmentSubmissionRepository.count() == 0) {
            AssignmentSubmission submission = assignmentSubmissionRepository.save(AssignmentSubmission.builder()
                    .assignment(assignment)
                    .userId(userRepository.findByEmail("student@lms.local").orElseThrow().getId())
                    .status("SUBMITTED")
                    .content("Hello, I am ready to learn.")
                    .submittedAt(LocalDateTime.now().minusHours(3))
                    .build());

            if (gradeRepository.count() == 0) {
                gradeRepository.save(Grade.builder()
                        .gradeItem(gradeItem)
                        .userId(submission.getUserId())
                        .score(new BigDecimal("95.00"))
                        .feedback("Good start")
                        .gradedBy(instructor.getId())
                        .build());
            }
        }

        CourseQA qa = courseQARepository.findAll().stream()
                .filter(q -> q.getCourse() != null && course.getId().equals(q.getCourse().getId()))
                .findFirst()
                .orElseGet(() -> courseQARepository.save(CourseQA.builder()
                        .course(course)
                        .lesson(lesson)
                        .userId(userRepository.findByEmail("student@lms.local").orElseThrow().getId())
                        .title("How do I start?")
                        .content("What is the recommended study order?")
                        .build()));

        if (courseQAReplyRepository.count() == 0) {
            courseQAReplyRepository.save(CourseQAReply.builder()
                    .qa(qa)
                    .userId(instructor.getId())
                    .content("Start with the welcome lesson, then complete the assignment.")
                    .isInstructorReply(true)
                    .build());
        }
    }

    private void seedStudentActivities() {
        // Placeholder records for activity/support; guarded by count checks so seeder stays idempotent.
    }

    private void seedExamAndSupport() {
        Course course = courseRepository.findByCode("CS101").orElseThrow();

        QuestionBank bank = questionBankRepository.findAll().stream()
                .filter(qb -> qb.getCourseId() != null && qb.getCourseId().equals(course.getId()))
                .findFirst()
                .orElseGet(() -> questionBankRepository.save(QuestionBank.builder()
                        .courseId(course.getId())
                        .name("CS101 Bank")
                        .description("Demo question bank")
                        .active(true)
                        .build()));

        if (questionRepository.count() == 0) {
            QuestionGroup group = QuestionGroup.builder().questionBank(bank).courseId(course.getId()).name("Basics").sortOrder(1).build();
            Question question = questionRepository.save(Question.builder()
                    .code("CS101-Q1")
                    .courseId(course.getId())
                    .questionBank(bank)
                    .questionGroup(group)
                    .content("What does CPU stand for?")
                    .type("MCQ")
                    .difficulty(1)
                    .defaultScore(new BigDecimal("10.00"))
                    .active(true)
                    .build());

            answerRepository.save(Answer.builder().question(question).content("Central Processing Unit").correct(true).sortOrder(1).build());
            answerRepository.save(Answer.builder().question(question).content("Computer Processing Unit").correct(false).sortOrder(2).build());
        }

        if (quizRepository.count() == 0) {
            Quiz quiz = quizRepository.save(Quiz.builder()
                    .courseId(course.getId())
                    .scope("COURSE")
                    .title("Demo Quiz")
                    .description("Warm-up quiz for the course")
                    .timeLimit(15)
                    .passScore(new BigDecimal("7.00"))
                    .settings("{}")
                    .active(true)
                    .build());

            Question question = questionRepository.findAll().stream().findFirst().orElseThrow();
            quizQuestionRepository.save(QuizQuestion.builder().quiz(quiz).question(question).sortOrder(1).points(new BigDecimal("10.00")).build());
        }

        if (examRepository.count() == 0) {
            examRepository.save(Exam.builder()
                    .courseId(course.getId())
                    .type("MIDTERM")
                    .status("DRAFT")
                    .duration(60)
                    .passScore(new BigDecimal("50.00"))
                    .maxAttempts(1)
                    .shuffleQuestions(true)
                    .shuffleAnswers(true)
                    .reviewOptions("{}").proctoringEnabled(false)
                    .createdBy(userRepository.findByEmail("instructor@lms.local").orElseThrow().getId())
                    .build());
        }
        if (mediaFileRepository.count() == 0) {
            mediaFileRepository.save(MediaFile.builder()
                    .ownerId(userRepository.findByEmail("instructor@lms.local").orElseThrow().getId())
                    .fileName("welcome.mp4")
                    .filePath("https://example.com/welcome.mp4")
                    .mimeType("video/mp4")
                    .fileSize(1024L)
                    .scope("COURSE")
                    .build());
        }
        if (notificationRepository.count() == 0) {
            notificationRepository.save(Notification.builder().title("Welcome").message("Your LMS demo data is ready.").build());
        }
        passwordResetTokenRepository.count();
        refreshTokenRepository.count();
        quizAttemptRepository.count();
    }
}

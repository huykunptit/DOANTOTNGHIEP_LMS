package com.eript.lms.course.service.impl;

import com.eript.lms.course.dto.response.GradebookDtos.GradeItemResponse;
import com.eript.lms.course.dto.response.GradebookDtos.GradebookResponse;
import com.eript.lms.course.entity.grade.Grade;
import com.eript.lms.course.entity.grade.GradeItem;
import com.eript.lms.course.repository.grade.GradeItemRepository;
import com.eript.lms.course.repository.grade.GradeRepository;
import com.eript.lms.course.service.GradebookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class GradebookServiceImpl implements GradebookService {

    private final GradeItemRepository gradeItemRepository;
    private final GradeRepository gradeRepository;

    @Override
    @Transactional(readOnly = true)
    public GradebookResponse getStudentGradebook(Long courseId, Long userId) {
        List<GradeItem> gradeItems = gradeItemRepository.findByCourseIdOrderBySortOrderAsc(courseId);
        List<Grade> studentGrades = gradeRepository.findByGradeItemCourseIdAndUserId(courseId, userId);

        Map<Long, Grade> gradeMap = studentGrades.stream()
                .collect(Collectors.toMap(g -> g.getGradeItem().getId(), g -> g));

        BigDecimal totalScore = BigDecimal.ZERO;

        List<GradeItemResponse> itemResponses = gradeItems.stream().map(item -> {
            Grade grade = gradeMap.get(item.getId());
            BigDecimal score = grade != null ? grade.getScore() : null;
            String feedback = grade != null ? grade.getFeedback() : null;

            return GradeItemResponse.builder()
                    .id(item.getId())
                    .itemType(item.getItemType())
                    .itemId(item.getItemId())
                    .name(item.getName())
                    .maxScore(item.getMaxScore())
                    .weight(item.getWeight())
                    .sortOrder(item.getSortOrder())
                    .studentScore(score)
                    .feedback(feedback)
                    .build();
        }).toList();

        // Calculate weighted total
        for (GradeItemResponse res : itemResponses) {
            if (res.getStudentScore() != null && res.getWeight() != null) {
                totalScore = totalScore.add(res.getStudentScore().multiply(res.getWeight()));
            }
        }

        return GradebookResponse.builder()
                .courseId(courseId)
                .userId(userId)
                .totalScore(totalScore)
                .items(itemResponses)
                .build();
    }
}

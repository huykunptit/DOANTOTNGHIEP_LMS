package com.eript.lms.course.repository.grade;

import com.eript.lms.course.entity.grade.GradeItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradeItemRepository extends JpaRepository<GradeItem, Long> {
    List<GradeItem> findByCourseIdOrderBySortOrderAsc(Long courseId);
    Optional<GradeItem> findByCourseIdAndItemTypeAndItemId(Long courseId, String itemType, Long itemId);
}

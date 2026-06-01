package com.eript.lms.exam.repository.assessment;

import com.eript.lms.exam.entity.assessment.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
}

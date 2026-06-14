package com.eript.lms.exam.repository.question;

import com.eript.lms.exam.entity.question.QuestionBank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuestionBankRepository extends JpaRepository<QuestionBank, Long> {
    Optional<QuestionBank> findByCourseId(Long courseId);
}

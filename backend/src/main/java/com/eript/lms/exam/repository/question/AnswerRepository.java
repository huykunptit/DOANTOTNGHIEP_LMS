package com.eript.lms.exam.repository.question;

import com.eript.lms.exam.entity.question.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByQuestionIdOrderBySortOrderAsc(Long questionId);
}

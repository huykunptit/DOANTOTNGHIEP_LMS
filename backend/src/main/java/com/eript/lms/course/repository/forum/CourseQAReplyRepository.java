package com.eript.lms.course.repository.forum;

import com.eript.lms.course.entity.forum.CourseQAReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseQAReplyRepository extends JpaRepository<CourseQAReply, Long> {
    List<CourseQAReply> findByQaIdOrderByCreatedAtAsc(Long qaId);
}

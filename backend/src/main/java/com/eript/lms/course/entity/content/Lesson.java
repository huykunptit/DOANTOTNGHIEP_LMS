package com.eript.lms.course.entity.content;

import com.eript.lms.course.entity.progress.LessonProgress;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "video_size")
    private Long videoSize;

    @Column(name = "video_status", length = 50)
    private String videoStatus;

    @Column(nullable = false)
    private Integer orderIndex;

    @Column(name = "is_preview", nullable = false)
    private Boolean preview = false;

    @Column(nullable = false, length = 50)
    private String type;

    @OneToMany(mappedBy = "lesson")
    private List<LessonProgress> progressEntries;
}

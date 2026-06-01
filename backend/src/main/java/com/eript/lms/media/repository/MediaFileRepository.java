package com.eript.lms.media.repository;

import com.eript.lms.media.entity.MediaFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {

    List<MediaFile> findAllByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    List<MediaFile> findAllByScopeOrderByCreatedAtDesc(String scope);
}

package com.eript.lms.course.controller;

import com.eript.lms.course.dto.request.SectionRequest;
import com.eript.lms.course.dto.response.SectionResponse;
import com.eript.lms.course.service.SectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sections")
@RequiredArgsConstructor
public class SectionController {

    private final SectionService sectionService;

    @PostMapping
    public ResponseEntity<SectionResponse> createSection(@Valid @RequestBody SectionRequest request) {
        return new ResponseEntity<>(sectionService.createSection(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SectionResponse> updateSection(@PathVariable Long id, @Valid @RequestBody SectionRequest request) {
        return ResponseEntity.ok(sectionService.updateSection(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSection(@PathVariable Long id) {
        sectionService.deleteSection(id);
        return ResponseEntity.noContent().build();
    }
}

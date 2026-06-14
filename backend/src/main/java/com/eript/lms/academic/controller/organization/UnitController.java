package com.eript.lms.academic.controller.organization;

import com.eript.lms.academic.dto.request.UnitRequest;
import com.eript.lms.academic.dto.response.UnitResponse;
import com.eript.lms.academic.service.organization.UnitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/units")
@RequiredArgsConstructor
public class UnitController {

    private final UnitService unitService;

    @PostMapping
    public ResponseEntity<UnitResponse> create(@Valid @RequestBody UnitRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(unitService.create(request));
    }

    @PutMapping("/{id}")
    public UnitResponse update(@PathVariable Long id, @Valid @RequestBody UnitRequest request) {
        return unitService.update(id, request);
    }

    @GetMapping("/{id}")
    public UnitResponse getById(@PathVariable Long id) {
        return unitService.getById(id);
    }

    @GetMapping
    public List<UnitResponse> getByInstitution(@RequestParam(required = false) Long institutionId,
                                               @RequestParam(required = false) Long parentId) {
        if (institutionId != null) {
            return unitService.getByInstitution(institutionId);
        }
        if (parentId != null) {
            return unitService.getChildren(parentId);
        }
        return List.of();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        unitService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

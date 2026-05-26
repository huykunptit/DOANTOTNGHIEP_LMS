package com.eript.academic.controller.organization;

import com.eript.academic.dto.request.InstitutionRequest;
import com.eript.academic.dto.response.InstitutionResponse;
import com.eript.academic.service.organization.InstitutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/institutions")
@RequiredArgsConstructor
public class InstitutionController {

    private final InstitutionService institutionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InstitutionResponse create(@RequestBody InstitutionRequest request) {
        return institutionService.create(request);
    }

    @PutMapping("/{id}")
    public InstitutionResponse update(@PathVariable Long id, @RequestBody InstitutionRequest request) {
        return institutionService.update(id, request);
    }

    @GetMapping("/{id}")
    public InstitutionResponse getById(@PathVariable Long id) {
        return institutionService.getById(id);
    }

    @GetMapping
    public List<InstitutionResponse> getAll() {
        return institutionService.getAll();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        institutionService.delete(id);
    }
}

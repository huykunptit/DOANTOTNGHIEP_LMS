package com.eript.lms.academic.service.organization.impl;

import com.eript.lms.academic.dto.request.InstitutionRequest;
import com.eript.lms.academic.dto.response.InstitutionResponse;
import com.eript.lms.academic.entity.organization.Institution;
import com.eript.lms.academic.mapper.InstitutionMapper;
import com.eript.lms.academic.repository.organization.InstitutionRepository;
import com.eript.lms.academic.service.organization.InstitutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InstitutionServiceImpl implements InstitutionService {

    private final InstitutionRepository institutionRepository;
    private final InstitutionMapper institutionMapper;

    @Override
    public InstitutionResponse create(InstitutionRequest request) {
        Institution institution = institutionMapper.toEntity(request);
        if (request.active() == null) {
            institution.setActive(true);
        }
        return institutionMapper.toResponse(institutionRepository.save(institution));
    }

    @Override
    public InstitutionResponse update(Long id, InstitutionRequest request) {
        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Institution not found: " + id));
        institutionMapper.updateEntity(request, institution);
        return institutionMapper.toResponse(institutionRepository.save(institution));
    }

    @Override
    @Transactional(readOnly = true)
    public InstitutionResponse getById(Long id) {
        return institutionRepository.findById(id)
                .map(institutionMapper::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Institution not found: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InstitutionResponse> getAll() {
        return institutionRepository.findAll().stream()
                .map(institutionMapper::toResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {
        institutionRepository.deleteById(id);
    }
}

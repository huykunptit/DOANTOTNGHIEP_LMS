package com.eript.lms.academic.service.organization.impl;

import com.eript.lms.academic.dto.request.UnitRequest;
import com.eript.lms.academic.dto.response.UnitResponse;
import com.eript.lms.academic.entity.organization.Institution;
import com.eript.lms.academic.entity.organization.Unit;
import com.eript.lms.academic.exception.ResourceNotFoundException;
import com.eript.lms.academic.mapper.UnitMapper;
import com.eript.lms.academic.repository.organization.InstitutionRepository;
import com.eript.lms.academic.repository.organization.UnitRepository;
import com.eript.lms.academic.service.organization.UnitService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UnitServiceImpl implements UnitService {

    private final UnitRepository unitRepository;
    private final InstitutionRepository institutionRepository;
    private final UnitMapper unitMapper;

    @Override
    public UnitResponse create(UnitRequest request) {
        Unit unit = unitMapper.toEntity(request);
        unit.setInstitution(resolveInstitution(request.institutionId()));
        unit.setParent(resolveParent(request.parentId()));
        if (request.active() == null) {
            unit.setActive(true);
        }
        return unitMapper.toResponse(unitRepository.save(unit));
    }

    @Override
    public UnitResponse update(Long id, UnitRequest request) {
        Unit unit = unitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found: " + id));
        unitMapper.updateEntity(request, unit);
        unit.setInstitution(resolveInstitution(request.institutionId()));
        unit.setParent(resolveParent(request.parentId()));
        return unitMapper.toResponse(unitRepository.save(unit));
    }

    @Override
    @Transactional(readOnly = true)
    public UnitResponse getById(Long id) {
        return unitRepository.findById(id)
                .map(unitMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UnitResponse> getByInstitution(Long institutionId) {
        return unitRepository.findAllByInstitutionId(institutionId).stream()
                .map(unitMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UnitResponse> getChildren(Long parentId) {
        return unitRepository.findAllByParentId(parentId).stream()
                .map(unitMapper::toResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {
        unitRepository.deleteById(id);
    }

    private Institution resolveInstitution(Long institutionId) {
        if (institutionId == null) {
            throw new IllegalArgumentException("institutionId is required");
        }
        return institutionRepository.findById(institutionId)
                .orElseThrow(() -> new ResourceNotFoundException("Institution not found: " + institutionId));
    }

    private Unit resolveParent(Long parentId) {
        if (parentId == null) {
            return null;
        }
        return unitRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent unit not found: " + parentId));
    }
}

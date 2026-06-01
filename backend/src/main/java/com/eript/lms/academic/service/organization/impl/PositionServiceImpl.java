package com.eript.lms.academic.service.organization.impl;

import com.eript.lms.academic.dto.request.PositionRequest;
import com.eript.lms.academic.dto.response.PositionResponse;
import com.eript.lms.academic.entity.organization.Position;
import com.eript.lms.academic.exception.ResourceNotFoundException;
import com.eript.lms.academic.mapper.PositionMapper;
import com.eript.lms.academic.repository.organization.PositionRepository;
import com.eript.lms.academic.service.organization.PositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PositionServiceImpl implements PositionService {

    private final PositionRepository positionRepository;
    private final PositionMapper positionMapper;

    @Override
    public PositionResponse create(PositionRequest request) {
        Position position = positionMapper.toEntity(request);
        if (request.active() == null) {
            position.setActive(true);
        }
        return positionMapper.toResponse(positionRepository.save(position));
    }

    @Override
    public PositionResponse update(Long id, PositionRequest request) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found: " + id));
        positionMapper.updateEntity(request, position);
        return positionMapper.toResponse(positionRepository.save(position));
    }

    @Override
    @Transactional(readOnly = true)
    public PositionResponse getById(Long id) {
        return positionRepository.findById(id)
                .map(positionMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PositionResponse> getAll() {
        return positionRepository.findAll().stream()
                .map(positionMapper::toResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {
        positionRepository.deleteById(id);
    }
}

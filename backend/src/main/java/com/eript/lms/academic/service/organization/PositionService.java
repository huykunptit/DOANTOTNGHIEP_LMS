package com.eript.lms.academic.service.organization;

import com.eript.lms.academic.dto.request.PositionRequest;
import com.eript.lms.academic.dto.response.PositionResponse;

import java.util.List;

public interface PositionService {

    PositionResponse create(PositionRequest request);

    PositionResponse update(Long id, PositionRequest request);

    PositionResponse getById(Long id);

    List<PositionResponse> getAll();

    void delete(Long id);
}

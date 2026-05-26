package com.eript.academic.service.organization;

import com.eript.academic.dto.request.InstitutionRequest;
import com.eript.academic.dto.response.InstitutionResponse;

import java.util.List;

public interface InstitutionService {

    InstitutionResponse create(InstitutionRequest request);

    InstitutionResponse update(Long id, InstitutionRequest request);

    InstitutionResponse getById(Long id);

    List<InstitutionResponse> getAll();

    void delete(Long id);
}

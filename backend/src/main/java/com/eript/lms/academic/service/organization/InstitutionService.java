package com.eript.lms.academic.service.organization;

import com.eript.lms.academic.dto.request.InstitutionRequest;
import com.eript.lms.academic.dto.response.InstitutionResponse;

import java.util.List;

public interface InstitutionService {

    InstitutionResponse create(InstitutionRequest request);

    InstitutionResponse update(Long id, InstitutionRequest request);

    InstitutionResponse getById(Long id);

    List<InstitutionResponse> getAll();

    void delete(Long id);
}

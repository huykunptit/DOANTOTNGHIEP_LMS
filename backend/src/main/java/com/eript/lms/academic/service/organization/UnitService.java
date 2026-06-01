package com.eript.lms.academic.service.organization;

import com.eript.lms.academic.dto.request.UnitRequest;
import com.eript.lms.academic.dto.response.UnitResponse;

import java.util.List;

public interface UnitService {

    UnitResponse create(UnitRequest request);

    UnitResponse update(Long id, UnitRequest request);

    UnitResponse getById(Long id);

    List<UnitResponse> getByInstitution(Long institutionId);

    List<UnitResponse> getChildren(Long parentId);

    void delete(Long id);
}

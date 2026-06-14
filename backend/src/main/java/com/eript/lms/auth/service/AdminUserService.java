package com.eript.lms.auth.service;

import com.eript.lms.auth.dto.request.AdminCreateUserRequest;
import com.eript.lms.auth.dto.request.AdminUpdateUserRequest;
import com.eript.lms.auth.dto.response.AdminUserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminUserService {

    Page<AdminUserResponse> list(String search, String role, Boolean active, Pageable pageable);

    AdminUserResponse get(Long id);

    AdminUserResponse create(AdminCreateUserRequest request);

    AdminUserResponse update(Long id, AdminUpdateUserRequest request);

    void deactivate(Long id);
}

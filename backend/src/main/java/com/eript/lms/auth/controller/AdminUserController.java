package com.eript.lms.auth.controller;

import com.eript.lms.auth.dto.request.AdminCreateUserRequest;
import com.eript.lms.auth.dto.request.AdminUpdateUserRequest;
import com.eript.lms.auth.dto.response.AdminUserResponse;
import com.eript.lms.auth.entity.auth.LoginAudit;
import com.eript.lms.auth.repository.auth.LoginAuditRepository;
import com.eript.lms.auth.service.AdminUserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Admin - Users", description = "User management for administrators")
@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;
    private final LoginAuditRepository loginAuditRepository;

    @GetMapping
    public Page<AdminUserResponse> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean active,
            Pageable pageable) {
        return adminUserService.list(search, role, active, pageable);
    }

    @GetMapping("/{id}")
    public AdminUserResponse get(@PathVariable Long id) {
        return adminUserService.get(id);
    }

    @PostMapping
    public ResponseEntity<AdminUserResponse> create(@Valid @RequestBody AdminCreateUserRequest request) {
        return ResponseEntity.ok(adminUserService.create(request));
    }

    @PatchMapping("/{id}")
    public AdminUserResponse update(@PathVariable Long id, @Valid @RequestBody AdminUpdateUserRequest request) {
        return adminUserService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        adminUserService.deactivate(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/login-audit")
    public Page<LoginAudit> loginAudit(@PathVariable Long id, Pageable pageable) {
        return loginAuditRepository.findByUserIdOrderByCreatedAtDesc(id, pageable);
    }
}

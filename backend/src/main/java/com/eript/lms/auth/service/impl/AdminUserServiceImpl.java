package com.eript.lms.auth.service.impl;

import com.eript.lms.auth.dto.request.AdminCreateUserRequest;
import com.eript.lms.auth.dto.request.AdminUpdateUserRequest;
import com.eript.lms.auth.dto.response.AdminUserResponse;
import com.eript.lms.auth.entity.auth.User;
import com.eript.lms.auth.entity.rbac.Role;
import com.eript.lms.auth.repository.auth.RefreshTokenRepository;
import com.eript.lms.auth.repository.auth.UserRepository;
import com.eript.lms.auth.repository.rbac.RoleRepository;
import com.eript.lms.auth.service.AdminUserService;
import com.eript.lms.exception.DuplicateResourceException;
import com.eript.lms.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public Page<AdminUserResponse> list(String search, String role, Boolean active, Pageable pageable) {
        String trimmed = (search != null && !search.isBlank()) ? search.trim() : null;
        String roleFilter = (role != null && !role.isBlank()) ? role : null;
        return userRepository.searchUsers(trimmed, roleFilter, active, pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminUserResponse get(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        return toResponse(user);
    }

    @Override
    public AdminUserResponse create(AdminCreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already exists: " + request.email());
        }
        if (request.studentCode() != null && !request.studentCode().isBlank()
                && userRepository.existsByStudentCode(request.studentCode())) {
            throw new DuplicateResourceException("Student code already exists: " + request.studentCode());
        }
        if (request.staffCode() != null && !request.staffCode().isBlank()
                && userRepository.existsByStaffCode(request.staffCode())) {
            throw new DuplicateResourceException("Staff code already exists: " + request.staffCode());
        }

        Set<Role> roles = resolveRoles(request.roles());

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .userType(request.userType())
                .phone(request.phone())
                .studentCode(blankToNull(request.studentCode()))
                .staffCode(blankToNull(request.staffCode()))
                .studyStatus(request.studyStatus())
                .active(request.active() == null ? Boolean.TRUE : request.active())
                .roles(new HashSet<>(roles))
                .build();

        return toResponse(userRepository.save(user));
    }

    @Override
    public AdminUserResponse update(Long id, AdminUpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        if (request.email() != null && !request.email().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(request.email())) {
                throw new DuplicateResourceException("Email already exists: " + request.email());
            }
            user.setEmail(request.email());
        }

        if (request.name() != null) user.setName(request.name());
        if (request.userType() != null) user.setUserType(request.userType());
        if (request.phone() != null) user.setPhone(request.phone());
        if (request.studentCode() != null) user.setStudentCode(blankToNull(request.studentCode()));
        if (request.staffCode() != null) user.setStaffCode(blankToNull(request.staffCode()));
        if (request.studyStatus() != null) user.setStudyStatus(request.studyStatus());

        if (request.active() != null && !request.active().equals(user.getActive())) {
            user.setActive(request.active());
            if (!request.active()) {
                refreshTokenRepository.findAllByUserId(user.getId()).forEach(t -> {
                    t.setRevoked(true);
                    refreshTokenRepository.save(t);
                });
            }
        }

        if (request.roles() != null && !request.roles().isEmpty()) {
            user.setRoles(new HashSet<>(resolveRoles(request.roles())));
        }

        return toResponse(userRepository.save(user));
    }

    @Override
    public void deactivate(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setActive(false);
        userRepository.save(user);
        refreshTokenRepository.findAllByUserId(id).forEach(t -> {
            t.setRevoked(true);
            refreshTokenRepository.save(t);
        });
    }

    private Set<Role> resolveRoles(Set<String> names) {
        return names.stream()
                .map(name -> roleRepository.findByName(name)
                        .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + name)))
                .collect(Collectors.toSet());
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }

    private AdminUserResponse toResponse(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getUserType(),
                user.getPhone(),
                user.getStudentCode(),
                user.getStaffCode(),
                user.getStudyStatus(),
                user.getActive(),
                user.getEmailVerifiedAt(),
                user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
        );
    }
}

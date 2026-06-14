package com.eript.lms.auth.service;

import com.eript.lms.auth.dto.request.AdminCreateUserRequest;
import com.eript.lms.auth.dto.request.AdminUpdateUserRequest;
import com.eript.lms.auth.dto.response.AdminUserResponse;
import com.eript.lms.auth.entity.auth.RefreshToken;
import com.eript.lms.auth.entity.auth.User;
import com.eript.lms.auth.entity.rbac.Role;
import com.eript.lms.auth.repository.auth.RefreshTokenRepository;
import com.eript.lms.auth.repository.auth.UserRepository;
import com.eript.lms.auth.repository.rbac.RoleRepository;
import com.eript.lms.auth.service.impl.AdminUserServiceImpl;
import com.eript.lms.exception.DuplicateResourceException;
import com.eript.lms.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminUserServiceImplTest {

    @Mock UserRepository userRepository;
    @Mock RoleRepository roleRepository;
    @Mock RefreshTokenRepository refreshTokenRepository;
    @Mock PasswordEncoder passwordEncoder;

    @InjectMocks AdminUserServiceImpl adminUserService;

    Role studentRole;
    User user;

    @BeforeEach
    void setUp() {
        studentRole = Role.builder().id(1L).name("ROLE_STUDENT").guardName("web").build();
        user = User.builder()
                .id(1L).name("Student").email("s@test.com")
                .password("hashed").userType("student")
                .active(true).roles(Set.of(studentRole)).build();
    }

    @Test
    void list_returnsPagedResults() {
        when(userRepository.searchUsers(any(), any(), any(), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(user)));

        Page<AdminUserResponse> page = adminUserService.list(null, null, null, Pageable.unpaged());

        assertThat(page.getTotalElements()).isEqualTo(1);
        assertThat(page.getContent().get(0).email()).isEqualTo("s@test.com");
    }

    @Test
    void get_found() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        AdminUserResponse res = adminUserService.get(1L);

        assertThat(res.id()).isEqualTo(1L);
        assertThat(res.roles()).contains("ROLE_STUDENT");
    }

    @Test
    void get_notFound_throws() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> adminUserService.get(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void create_success() {
        AdminCreateUserRequest req = new AdminCreateUserRequest(
                "New", "new@test.com", "pass123", "student",
                null, null, null, null, true, Set.of("ROLE_STUDENT"));
        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(roleRepository.findByName("ROLE_STUDENT")).thenReturn(Optional.of(studentRole));
        when(passwordEncoder.encode(anyString())).thenReturn("hashed");
        when(userRepository.save(any())).thenReturn(user);

        AdminUserResponse res = adminUserService.create(req);

        assertThat(res).isNotNull();
        verify(userRepository).save(any());
    }

    @Test
    void create_duplicateEmail_throws() {
        AdminCreateUserRequest req = new AdminCreateUserRequest(
                "Dup", "s@test.com", "pass", "student",
                null, null, null, null, true, Set.of("ROLE_STUDENT"));
        when(userRepository.existsByEmail("s@test.com")).thenReturn(true);

        assertThatThrownBy(() -> adminUserService.create(req))
                .isInstanceOf(DuplicateResourceException.class);
    }

    @Test
    void update_toggleActiveToFalse_revokesRefreshTokens() {
        RefreshToken rt = RefreshToken.builder()
                .id(1L).userId(1L).token("tok")
                .revoked(false)
                .expiresAt(java.time.LocalDateTime.now().plusDays(1)).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any())).thenReturn(user);
        when(refreshTokenRepository.findAllByUserId(1L)).thenReturn(List.of(rt));
        when(refreshTokenRepository.save(any())).thenReturn(null);

        AdminUpdateUserRequest req = new AdminUpdateUserRequest(
                null, null, null, null, null, null, null, false, null);
        adminUserService.update(1L, req);

        assertThat(rt.getRevoked()).isTrue();
        verify(refreshTokenRepository).save(rt);
    }

    @Test
    void deactivate_setsInactiveAndRevokesTokens() {
        RefreshToken rt = RefreshToken.builder()
                .id(1L).userId(1L).token("tok").revoked(false)
                .expiresAt(java.time.LocalDateTime.now().plusDays(1)).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any())).thenReturn(user);
        when(refreshTokenRepository.findAllByUserId(1L)).thenReturn(List.of(rt));
        when(refreshTokenRepository.save(any())).thenReturn(null);

        adminUserService.deactivate(1L);

        assertThat(user.getActive()).isFalse();
        assertThat(rt.getRevoked()).isTrue();
    }
}

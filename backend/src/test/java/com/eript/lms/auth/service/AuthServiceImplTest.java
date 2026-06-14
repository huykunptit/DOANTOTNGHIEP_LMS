package com.eript.lms.auth.service;

import com.eript.lms.auth.dto.request.*;
import com.eript.lms.auth.dto.response.AuthResponse;
import com.eript.lms.auth.dto.response.MessageResponse;
import com.eript.lms.auth.entity.auth.PasswordResetToken;
import com.eript.lms.auth.entity.auth.RefreshToken;
import com.eript.lms.auth.entity.auth.User;
import com.eript.lms.auth.entity.auth.EmailVerificationToken;
import com.eript.lms.auth.entity.rbac.Role;
import com.eript.lms.auth.mapper.AuthMapper;
import com.eript.lms.auth.repository.auth.*;
import com.eript.lms.auth.repository.rbac.RoleRepository;
import com.eript.lms.auth.security.JwtService;
import com.eript.lms.auth.service.impl.AuthServiceImpl;
import com.eript.lms.exception.DuplicateResourceException;
import com.eript.lms.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock UserRepository userRepository;
    @Mock RoleRepository roleRepository;
    @Mock RefreshTokenRepository refreshTokenRepository;
    @Mock PasswordResetTokenRepository passwordResetTokenRepository;
    @Mock EmailVerificationTokenRepository emailVerificationTokenRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @Mock AuthMapper authMapper;
    @Mock EmailService emailService;
    @Mock LoginAttemptService loginAttemptService;
    @Mock com.eript.lms.auth.repository.auth.LoginAuditRepository loginAuditRepository;

    @InjectMocks AuthServiceImpl authService;

    Role studentRole;
    User activeUser;

    @BeforeEach
    void setUp() {
        studentRole = Role.builder().id(1L).name("ROLE_STUDENT").guardName("web").build();
        activeUser = User.builder()
                .id(1L)
                .email("user@test.com")
                .name("Test User")
                .password("hashed")
                .userType("student")
                .active(true)
                .roles(Set.of(studentRole))
                .build();
    }

    // ─── register ───────────────────────────────────────────────────────────

    @Test
    void register_success() {
        RegisterRequest req = new RegisterRequest("New User", "new@test.com", "pass123");
        when(userRepository.existsByEmail(req.email())).thenReturn(false);
        when(roleRepository.findByName("ROLE_STUDENT")).thenReturn(Optional.of(studentRole));
        when(passwordEncoder.encode(anyString())).thenReturn("hashed");
        when(userRepository.save(any())).thenReturn(activeUser);
        when(jwtService.generateAccessToken(any())).thenReturn("access");
        when(jwtService.generateRefreshToken(any())).thenReturn("refresh");
        when(refreshTokenRepository.save(any())).thenReturn(null);
        doNothing().when(emailVerificationTokenRepository).deleteAllByUserId(any());
        when(emailVerificationTokenRepository.save(any())).thenReturn(null);
        doNothing().when(emailService).sendVerificationEmail(any(), any(), any());

        AuthResponse res = authService.register(req);

        assertThat(res.accessToken()).isEqualTo("access");
        assertThat(res.refreshToken()).isEqualTo("refresh");
        verify(emailService).sendVerificationEmail(any(), any(), any());
    }

    @Test
    void register_duplicateEmail_throws() {
        when(userRepository.existsByEmail("dup@test.com")).thenReturn(true);
        assertThatThrownBy(() -> authService.register(new RegisterRequest("Name", "dup@test.com", "pass")))
                .isInstanceOf(DuplicateResourceException.class);
        verify(userRepository, never()).save(any());
    }

    // ─── login ──────────────────────────────────────────────────────────────

    @Test
    void login_success_and_resets_lock() {
        LoginRequest req = new LoginRequest("user@test.com", "plainpass");
        when(loginAttemptService.isLocked(req.email())).thenReturn(false);
        when(userRepository.findByEmail(req.email())).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches(req.password(), activeUser.getPassword())).thenReturn(true);
        when(jwtService.generateAccessToken(any())).thenReturn("access");
        when(jwtService.generateRefreshToken(any())).thenReturn("refresh");
        when(refreshTokenRepository.save(any())).thenReturn(null);
        when(loginAuditRepository.save(any())).thenReturn(null);

        AuthResponse res = authService.login(req);

        assertThat(res.roles()).contains("ROLE_STUDENT");
        verify(loginAttemptService).reset(req.email());
    }

    @Test
    void login_wrongPassword_recordsFailure() {
        LoginRequest req = new LoginRequest("user@test.com", "wrong");
        when(loginAttemptService.isLocked(req.email())).thenReturn(false);
        when(userRepository.findByEmail(req.email())).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches(req.password(), activeUser.getPassword())).thenReturn(false);
        when(loginAuditRepository.save(any())).thenReturn(null);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid credentials");
        verify(loginAttemptService).recordFailure(req.email());
    }

    @Test
    void login_lockedAccount_throws() {
        LoginRequest req = new LoginRequest("user@test.com", "pass");
        when(loginAttemptService.isLocked(req.email())).thenReturn(true);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("tạm khoá");
        verify(userRepository, never()).findByEmail(any());
    }

    @Test
    void login_inactiveUser_throws() {
        User inactive = User.builder()
                .id(2L).email("inactive@test.com").name("Inactive")
                .password("hashed").userType("student").active(false)
                .roles(Set.of(studentRole)).build();
        LoginRequest req = new LoginRequest("inactive@test.com", "pass");
        when(loginAttemptService.isLocked(req.email())).thenReturn(false);
        when(userRepository.findByEmail(req.email())).thenReturn(Optional.of(inactive));
        when(passwordEncoder.matches(req.password(), inactive.getPassword())).thenReturn(true);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("disabled");
    }

    // ─── refreshToken ───────────────────────────────────────────────────────

    @Test
    void refreshToken_revokesOldAndIssuesNew() {
        RefreshToken oldToken = RefreshToken.builder()
                .id(1L).userId(1L).token("old-token")
                .expiresAt(LocalDateTime.now().plusDays(1)).revoked(false).build();
        when(refreshTokenRepository.findByToken("old-token")).thenReturn(Optional.of(oldToken));
        when(userRepository.findById(1L)).thenReturn(Optional.of(activeUser));
        when(jwtService.generateAccessToken(any())).thenReturn("new-access");
        when(jwtService.generateRefreshToken(any())).thenReturn("new-refresh");
        when(refreshTokenRepository.save(any())).thenReturn(null);

        AuthResponse res = authService.refreshToken("old-token");

        assertThat(oldToken.getRevoked()).isTrue();
        assertThat(res.accessToken()).isEqualTo("new-access");
        verify(refreshTokenRepository, times(2)).save(any());
    }

    @Test
    void refreshToken_revokedToken_throws() {
        RefreshToken revoked = RefreshToken.builder()
                .id(1L).userId(1L).token("revoked")
                .expiresAt(LocalDateTime.now().plusDays(1)).revoked(true).build();
        when(refreshTokenRepository.findByToken("revoked")).thenReturn(Optional.of(revoked));

        assertThatThrownBy(() -> authService.refreshToken("revoked"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void refreshToken_expiredToken_throws() {
        RefreshToken expired = RefreshToken.builder()
                .id(1L).userId(1L).token("expired")
                .expiresAt(LocalDateTime.now().minusHours(1)).revoked(false).build();
        when(refreshTokenRepository.findByToken("expired")).thenReturn(Optional.of(expired));

        assertThatThrownBy(() -> authService.refreshToken("expired"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    // ─── changePassword ─────────────────────────────────────────────────────

    @Test
    void changePassword_success_revokesAllTokens() {
        ChangePasswordRequest req = new ChangePasswordRequest("oldpass", "newpass123");
        when(userRepository.findById(1L)).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches("oldpass", activeUser.getPassword())).thenReturn(true);
        when(passwordEncoder.matches("newpass123", activeUser.getPassword())).thenReturn(false);
        when(passwordEncoder.encode("newpass123")).thenReturn("new-hashed");
        when(userRepository.save(any())).thenReturn(activeUser);
        when(refreshTokenRepository.findAllByUserId(1L)).thenReturn(List.of());

        MessageResponse res = authService.changePassword(1L, req);

        assertThat(res.message()).contains("successfully");
        verify(userRepository).save(any());
    }

    @Test
    void changePassword_wrongCurrentPassword_throws() {
        ChangePasswordRequest req = new ChangePasswordRequest("wrong", "newpass");
        when(userRepository.findById(1L)).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches("wrong", activeUser.getPassword())).thenReturn(false);

        assertThatThrownBy(() -> authService.changePassword(1L, req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("incorrect");
    }

    @Test
    void changePassword_sameAsCurrent_throws() {
        ChangePasswordRequest req = new ChangePasswordRequest("same", "same");
        when(userRepository.findById(1L)).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches("same", activeUser.getPassword())).thenReturn(true);

        assertThatThrownBy(() -> authService.changePassword(1L, req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("differ");
    }

    // ─── forgotPassword ─────────────────────────────────────────────────────

    @Test
    void forgotPassword_existingEmail_sendsMailAndReturnGenericMessage() {
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(activeUser));
        doNothing().when(passwordResetTokenRepository).deleteAllByUserId(1L);
        when(passwordResetTokenRepository.save(any())).thenReturn(null);
        doNothing().when(emailService).sendPasswordResetEmail(any(), any(), any());

        MessageResponse res = authService.forgotPassword(new ForgotPasswordRequest("user@test.com"));

        assertThat(res.message()).contains("If an account");
        verify(emailService).sendPasswordResetEmail(any(), any(), any());
    }

    @Test
    void forgotPassword_unknownEmail_returnsGenericMessageWithoutSendingMail() {
        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        MessageResponse res = authService.forgotPassword(new ForgotPasswordRequest("unknown@test.com"));

        assertThat(res.message()).contains("If an account");
        verify(emailService, never()).sendPasswordResetEmail(any(), any(), any());
    }

    // ─── verifyEmail ─────────────────────────────────────────────────────────

    @Test
    void verifyEmail_success() {
        EmailVerificationToken token = EmailVerificationToken.builder()
                .id(1L).userId(1L).token("tok")
                .expiresAt(LocalDateTime.now().plusHours(1)).used(false).build();
        when(emailVerificationTokenRepository.findByToken("tok")).thenReturn(Optional.of(token));
        when(userRepository.findById(1L)).thenReturn(Optional.of(activeUser));
        when(userRepository.save(any())).thenReturn(activeUser);
        when(emailVerificationTokenRepository.save(any())).thenReturn(null);

        MessageResponse res = authService.verifyEmail(new VerifyEmailRequest("tok"));

        assertThat(res.message()).contains("verified");
        assertThat(token.getUsed()).isTrue();
        assertThat(activeUser.getEmailVerifiedAt()).isNotNull();
    }

    @Test
    void verifyEmail_expiredToken_throws() {
        EmailVerificationToken token = EmailVerificationToken.builder()
                .id(1L).userId(1L).token("expired-tok")
                .expiresAt(LocalDateTime.now().minusHours(1)).used(false).build();
        when(emailVerificationTokenRepository.findByToken("expired-tok")).thenReturn(Optional.of(token));

        assertThatThrownBy(() -> authService.verifyEmail(new VerifyEmailRequest("expired-tok")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("invalid or expired");
    }

    @Test
    void verifyEmail_notFound_throws() {
        when(emailVerificationTokenRepository.findByToken("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.verifyEmail(new VerifyEmailRequest("missing")))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}

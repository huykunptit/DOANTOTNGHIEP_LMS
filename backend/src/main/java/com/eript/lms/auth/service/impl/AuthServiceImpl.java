package com.eript.lms.auth.service.impl;

import com.eript.lms.auth.dto.request.ChangePasswordRequest;
import com.eript.lms.auth.dto.request.ForgotPasswordRequest;
import com.eript.lms.auth.dto.request.LoginRequest;
import com.eript.lms.auth.dto.request.RegisterRequest;
import com.eript.lms.auth.dto.request.ResetPasswordRequest;
import com.eript.lms.auth.dto.request.UpdateProfileRequest;
import com.eript.lms.auth.dto.request.VerifyEmailRequest;
import com.eript.lms.auth.dto.response.AuthResponse;
import com.eript.lms.auth.dto.response.MessageResponse;
import com.eript.lms.auth.dto.response.UserResponse;
import com.eript.lms.auth.entity.auth.EmailVerificationToken;
import com.eript.lms.auth.entity.auth.LoginAudit;
import com.eript.lms.auth.entity.auth.PasswordResetToken;
import com.eript.lms.auth.entity.auth.RefreshToken;
import com.eript.lms.auth.entity.auth.User;
import com.eript.lms.auth.entity.rbac.Role;
import com.eript.lms.exception.DuplicateResourceException;
import com.eript.lms.exception.ResourceNotFoundException;
import com.eript.lms.auth.mapper.AuthMapper;
import com.eript.lms.auth.repository.auth.EmailVerificationTokenRepository;
import com.eript.lms.auth.repository.auth.LoginAuditRepository;
import com.eript.lms.auth.repository.auth.PasswordResetTokenRepository;
import com.eript.lms.auth.repository.auth.RefreshTokenRepository;
import com.eript.lms.auth.repository.auth.UserRepository;
import com.eript.lms.auth.repository.rbac.RoleRepository;
import com.eript.lms.auth.security.JwtService;
import com.eript.lms.auth.service.AuthService;
import com.eript.lms.auth.service.EmailService;
import com.eript.lms.auth.service.LoginAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private static final String DEFAULT_USER_ROLE = "ROLE_STUDENT";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final LoginAuditRepository loginAuditRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthMapper authMapper;
    private final EmailService emailService;
    private final LoginAttemptService loginAttemptService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already exists: " + request.email());
        }

        Role defaultRole = roleRepository.findByName(DEFAULT_USER_ROLE)
                .orElseThrow(() -> new ResourceNotFoundException("Default role not found: " + DEFAULT_USER_ROLE));

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .userType("student")
                .active(true)
                .roles(new HashSet<>(Set.of(defaultRole)))
                .build();

        user = userRepository.save(user);
        issueVerificationEmail(user);
        return buildAuthResponse(user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        if (loginAttemptService.isLocked(request.email())) {
            throw new IllegalArgumentException(
                    "Tài khoản tạm khoá do nhập sai mật khẩu nhiều lần. Vui lòng thử lại sau 15 phút.");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseGet(() -> {
                    loginAttemptService.recordFailure(request.email());
                    loginAuditRepository.save(LoginAudit.builder()
                            .email(request.email()).success(false)
                            .failureReason("user_not_found").build());
                    throw new ResourceNotFoundException("Invalid credentials");
                });

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            loginAttemptService.recordFailure(request.email());
            loginAuditRepository.save(LoginAudit.builder()
                    .userId(user.getId()).email(request.email()).success(false)
                    .failureReason("wrong_password").build());
            throw new IllegalArgumentException("Invalid credentials");
        }

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new IllegalArgumentException("Account is disabled");
        }

        loginAttemptService.reset(request.email());
        loginAuditRepository.save(LoginAudit.builder()
                .userId(user.getId()).email(request.email()).success(true).build());
        return buildAuthResponse(user);
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        RefreshToken token = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new ResourceNotFoundException("Refresh token not found"));

        if (Boolean.TRUE.equals(token.getRevoked()) || token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh token is invalid");
        }

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        token.setRevoked(true);
        refreshTokenRepository.save(token);

        return buildAuthResponse(user);
    }

    @Override
    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Override
    public void logoutAll(Long userId) {
        refreshTokenRepository.findAllByUserId(userId).forEach(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Override
    public MessageResponse changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
            throw new IllegalArgumentException("New password must differ from current password");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        refreshTokenRepository.findAllByUserId(userId).forEach(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });

        return new MessageResponse("Password changed successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse me(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return authMapper.toUserResponse(user);
    }

    @Override
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        MessageResponse genericResponse = new MessageResponse(
                "If an account with this email exists, a password reset link has been sent.");

        return userRepository.findByEmail(request.email()).map(user -> {
            passwordResetTokenRepository.deleteAllByUserId(user.getId());
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .userId(user.getId())
                    .token(token)
                    .expiresAt(LocalDateTime.now().plusHours(24))
                    .used(false)
                    .build();
            passwordResetTokenRepository.save(resetToken);
            emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), token);
            return genericResponse;
        }).orElse(genericResponse);
    }

    @Override
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.token())
                .orElseThrow(() -> new ResourceNotFoundException("Reset token not found"));

        if (Boolean.TRUE.equals(resetToken.getUsed()) || resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reset token is invalid");
        }

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        refreshTokenRepository.deleteAllByUserId(user.getId());

        return new MessageResponse("Password reset successfully");
    }

    @Override
    public MessageResponse verifyEmail(VerifyEmailRequest request) {
        EmailVerificationToken token = emailVerificationTokenRepository.findByToken(request.token())
                .orElseThrow(() -> new ResourceNotFoundException("Verification token not found"));

        if (Boolean.TRUE.equals(token.getUsed()) || token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Verification token is invalid or expired");
        }

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setEmailVerifiedAt(LocalDateTime.now());
        userRepository.save(user);

        token.setUsed(true);
        emailVerificationTokenRepository.save(token);

        return new MessageResponse("Email verified successfully");
    }

    @Override
    public MessageResponse resendVerificationEmail(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getEmailVerifiedAt() != null) {
            throw new IllegalArgumentException("Email is already verified");
        }

        issueVerificationEmail(user);
        return new MessageResponse("Verification email sent");
    }

    @Override
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.name() != null) user.setName(request.name());
        if (request.phone() != null) user.setPhone(request.phone());
        if (request.bio() != null) user.setBio(request.bio());
        if (request.avatar() != null) user.setAvatar(request.avatar());
        if (request.gender() != null) user.setGender(request.gender());
        if (request.dateOfBirth() != null) user.setDateOfBirth(request.dateOfBirth());
        if (request.hometown() != null) user.setHometown(request.hometown());
        if (request.permanentAddress() != null) user.setPermanentAddress(request.permanentAddress());

        userRepository.save(user);
        return authMapper.toUserResponse(user);
    }

    private void issueVerificationEmail(User user) {
        emailVerificationTokenRepository.deleteAllByUserId(user.getId());
        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .userId(user.getId())
                .token(token)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .used(false)
                .build();
        emailVerificationTokenRepository.save(verificationToken);
        emailService.sendVerificationEmail(user.getEmail(), user.getName(), token);
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        RefreshToken token = RefreshToken.builder()
                .userId(user.getId())
                .token(refreshToken)
                .expiresAt(LocalDateTime.now().plusDays(30))
                .revoked(false)
                .build();
        refreshTokenRepository.save(token);

        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new AuthResponse(accessToken, refreshToken, user.getId(), user.getName(), user.getEmail(), roles);
    }
}

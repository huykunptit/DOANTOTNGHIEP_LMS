package com.eript.lms.auth.service;

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

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(String refreshToken);

    void logout(String refreshToken);

    void logoutAll(Long userId);

    UserResponse me(Long userId);

    MessageResponse forgotPassword(ForgotPasswordRequest request);

    MessageResponse resetPassword(ResetPasswordRequest request);

    MessageResponse changePassword(Long userId, ChangePasswordRequest request);

    MessageResponse verifyEmail(VerifyEmailRequest request);

    MessageResponse resendVerificationEmail(Long userId);

    UserResponse updateProfile(Long userId, UpdateProfileRequest request);
}

package com.eript.lms.auth.service;

public interface EmailService {

    void sendVerificationEmail(String toEmail, String toName, String token);

    void sendPasswordResetEmail(String toEmail, String toName, String token);
}

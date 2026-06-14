package com.eript.lms.auth.service.impl;

import com.eript.lms.auth.config.AppMailProperties;
import com.eript.lms.auth.config.FrontendProperties;
import com.eript.lms.auth.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final AppMailProperties mailProps;
    private final FrontendProperties frontendProps;

    @Override
    public void sendVerificationEmail(String toEmail, String toName, String token) {
        String link = frontendProps.baseUrl() + "/verify-email?token=" + encode(token);
        String subject = "[eRIPT LMS] Xác thực địa chỉ email";
        String body = """
                <p>Xin chào %s,</p>
                <p>Vui lòng nhấn vào liên kết bên dưới để xác thực địa chỉ email của bạn:</p>
                <p><a href="%s">%s</a></p>
                <p>Liên kết có hiệu lực trong 24 giờ.</p>
                <p>Nếu bạn không tạo tài khoản này, có thể bỏ qua email này.</p>
                """.formatted(toName, link, link);

        send(toEmail, subject, body, "verification", token);
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String toName, String token) {
        String link = frontendProps.baseUrl() + "/reset-password?token=" + encode(token);
        String subject = "[eRIPT LMS] Khôi phục mật khẩu";
        String body = """
                <p>Xin chào %s,</p>
                <p>Bạn vừa yêu cầu khôi phục mật khẩu. Nhấn vào liên kết bên dưới để đặt lại:</p>
                <p><a href="%s">%s</a></p>
                <p>Liên kết có hiệu lực trong 24 giờ.</p>
                <p>Nếu bạn không yêu cầu khôi phục mật khẩu, hãy bỏ qua email này.</p>
                """.formatted(toName, link, link);

        send(toEmail, subject, body, "password-reset", token);
    }

    private void send(String to, String subject, String htmlBody, String kind, String token) {
        JavaMailSender sender = mailSenderProvider.getIfAvailable();
        boolean hasHost = System.getenv("MAIL_HOST") != null && !System.getenv("MAIL_HOST").isBlank();
        boolean canSend = sender != null && hasHost && mailProps.from() != null && !mailProps.from().isBlank();

        if (!canSend) {
            log.info("=== [DEV MAIL/{}] to={} token={} subject=\"{}\" ===\n{}",
                    kind, to, token, subject, htmlBody);
            return;
        }

        try {
            MimeMessage mime = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true, StandardCharsets.UTF_8.name());
            helper.setFrom(new InternetAddress(mailProps.from(), mailProps.fromName()));
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            sender.send(mime);
            log.info("Sent {} email to {}", kind, to);
        } catch (MessagingException | UnsupportedEncodingException ex) {
            log.error("Failed to send {} email to {}: {}", kind, to, ex.getMessage(), ex);
        }
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}

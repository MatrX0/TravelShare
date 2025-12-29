package com.proje.maps.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.email.from:noreply@travelshare.com}")
    private String fromEmail;

    @Value("${app.email.admin:admin@travelshare.com}")
    private String adminEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Şifre sıfırlama kodu gönder
     */
    @Async
    public void sendPasswordResetEmail(String toEmail, String username, String resetCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Reset Your TravelShare Password");

            String htmlContent = buildPasswordResetEmail(username, resetCode);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Password reset email sent to: {}", toEmail);

        } catch (MessagingException e) {
            log.error("Failed to send password reset email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    /**
     * Contact form mesajını admin'e gönder
     */
    @Async
    public void sendContactFormEmail(String fromName, String fromEmail, String subject, String message) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(this.fromEmail);
            helper.setTo(adminEmail);
            helper.setReplyTo(fromEmail);
            helper.setSubject("New Contact Form - " + subject);

            String htmlContent = buildContactFormEmail(fromName, fromEmail, subject, message);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            log.info("Contact form email sent from: {} ({})", fromName, fromEmail);

        } catch (MessagingException e) {
            log.error("Failed to send contact form email from: {}", fromEmail, e);
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    /**
     * Basit text email gönder (genel amaçlı)
     */
    @Async
    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);
            log.info("Simple email sent to: {}", to);

        } catch (Exception e) {
            log.error("Failed to send simple email to: {}", to, e);
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    /**
     * Password reset email HTML template
     */
    private String buildPasswordResetEmail(String username, String resetCode) {
        String template = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .code-box { background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                    .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✈️ TravelShare</h1>
                        <p>Password Reset Request</p>
                    </div>
                    <div class="content">
                        <p>Hello <strong>USER_NAME</strong>,</p>
                        <p>We received a request to reset your password. Use the code below to reset your password:</p>
                        
                        <div class="code-box">
                            <div class="code">RESET_CODE</div>
                        </div>
                        
                        <p><strong>This code will expire in 15 minutes.</strong></p>
                        
                        <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
                        
                        <p>For security reasons, never share this code with anyone.</p>
                        
                        <div class="footer">
                            <p>© 2025 TravelShare. All rights reserved.</p>
                            <p>This is an automated email, please do not reply.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """;
        
        return template
            .replace("USER_NAME", username)
            .replace("RESET_CODE", resetCode);
    }

    /**
     * Contact form email HTML template
     */
    private String buildContactFormEmail(String fromName, String fromEmail, String subject, String message) {
        String template = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }
                    .label { font-weight: bold; color: #667eea; }
                    .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>📧 New Contact Form Submission</h2>
                    </div>
                    <div class="content">
                        <p>You have received a new message from your TravelShare contact form:</p>
                        
                        <div class="info-box">
                            <p><span class="label">From:</span> FROM_NAME</p>
                            <p><span class="label">Email:</span> FROM_EMAIL</p>
                            <p><span class="label">Subject:</span> EMAIL_SUBJECT</p>
                        </div>
                        
                        <div class="message-box">
                            <p><span class="label">Message:</span></p>
                            <p>MESSAGE_CONTENT</p>
                        </div>
                        
                        <p style="color: #666; font-size: 12px; margin-top: 20px;">
                            💡 You can reply directly to this email to respond to the sender.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """;
        
        return template
            .replace("FROM_NAME", fromName)
            .replace("FROM_EMAIL", fromEmail)
            .replace("EMAIL_SUBJECT", subject)
            .replace("MESSAGE_CONTENT", message.replace("\n", "<br>"));
    }
}

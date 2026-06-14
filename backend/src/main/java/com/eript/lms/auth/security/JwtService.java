package com.eript.lms.auth.security;

import com.eript.lms.auth.config.JwtProperties;
import com.eript.lms.auth.entity.auth.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final JwtProperties properties;

    public JwtService(SecretKey secretKey, JwtProperties properties) {
        this.secretKey = secretKey;
        this.properties = properties;
    }

    public String generateAccessToken(User user) {
        return generateToken(user, properties.accessTokenMinutes() * 60 * 1000);
    }

    public String generateRefreshToken(User user) {
        return generateToken(user, properties.refreshTokenDays() * 24 * 60 * 60 * 1000);
    }

    public Long extractUserId(String token) {
        Claims claims = parseClaims(token).getPayload();
        return Long.valueOf(claims.getSubject());
    }

    public List<String> extractRoles(String token) {
        Claims claims = parseClaims(token).getPayload();
        Object roles = claims.get("roles");
        if (roles instanceof List<?> list) {
            return list.stream().map(Object::toString).toList();
        }
        return List.of();
    }

    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public TokenStatus checkTokenStatus(String token) {
        try {
            parseClaims(token);
            return TokenStatus.VALID;
        } catch (ExpiredJwtException ex) {
            return TokenStatus.EXPIRED;
        } catch (JwtException | IllegalArgumentException ex) {
            return TokenStatus.INVALID;
        }
    }

    public enum TokenStatus {
        VALID, EXPIRED, INVALID
    }

    public String extractJti(String token) {
        Claims claims = parseClaims(token).getPayload();
        return claims.getId();
    }

    private String generateToken(User user, long ttlMillis) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        claims.put("roles", user.getRoles().stream().map(role -> role.getName()).toList());

        Instant now = Instant.now();
        Instant expiry = now.plusMillis(ttlMillis);

        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .claims(claims)
                .subject(String.valueOf(user.getId()))
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(secretKey)
                .compact();
    }

    private Jws<Claims> parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token);
    }
}

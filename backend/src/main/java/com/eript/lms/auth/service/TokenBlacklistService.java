package com.eript.lms.auth.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.stereotype.Service;

import java.time.Duration;

/**
 * In-memory blacklist for revoked access tokens (by JTI).
 * Tokens expire from the blacklist once their natural expiry passes (1h).
 * Replace with Redis for multi-instance deployments.
 */
@Service
public class TokenBlacklistService {

    private final Cache<String, Boolean> blacklist = Caffeine.newBuilder()
            .expireAfterWrite(Duration.ofHours(2))
            .maximumSize(50_000)
            .build();

    public void blacklist(String jti) {
        if (jti != null) blacklist.put(jti, Boolean.TRUE);
    }

    public boolean isBlacklisted(String jti) {
        return jti != null && Boolean.TRUE.equals(blacklist.getIfPresent(jti));
    }
}

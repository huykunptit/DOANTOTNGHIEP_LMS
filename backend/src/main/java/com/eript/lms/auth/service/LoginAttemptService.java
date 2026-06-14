package com.eript.lms.auth.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Tracks failed login attempts per email and applies a temporary lock after too many failures.
 * In-memory only (Caffeine) — sufficient for single-instance dev; replace with Redis for prod cluster.
 */
@Slf4j
@Service
public class LoginAttemptService {

    public static final int MAX_ATTEMPTS = 5;
    public static final Duration LOCK_DURATION = Duration.ofMinutes(15);

    private final Cache<String, AtomicInteger> attempts = Caffeine.newBuilder()
            .expireAfterWrite(LOCK_DURATION)
            .maximumSize(10_000)
            .build();

    public void recordFailure(String email) {
        if (email == null) return;
        String key = email.toLowerCase();
        AtomicInteger counter = attempts.get(key, k -> new AtomicInteger(0));
        int now = counter.incrementAndGet();
        if (now >= MAX_ATTEMPTS) {
            log.warn("Login locked for email={} after {} failures", key, now);
        }
    }

    public void reset(String email) {
        if (email == null) return;
        attempts.invalidate(email.toLowerCase());
    }

    public boolean isLocked(String email) {
        if (email == null) return false;
        AtomicInteger counter = attempts.getIfPresent(email.toLowerCase());
        return counter != null && counter.get() >= MAX_ATTEMPTS;
    }
}

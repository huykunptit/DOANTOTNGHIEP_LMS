package com.eript.lms.auth.security;

import com.eript.lms.auth.service.TokenBlacklistService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final TokenBlacklistService tokenBlacklistService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        JwtService.TokenStatus status = jwtService.checkTokenStatus(token);

        if (status == JwtService.TokenStatus.VALID) {
            try {
                String jti = jwtService.extractJti(token);
                if (tokenBlacklistService.isBlacklisted(jti)) {
                    writeProblem(response, HttpStatus.UNAUTHORIZED, "Token Revoked",
                            "Access token has been revoked.");
                    return;
                }
            } catch (Exception ignored) {
                // extractJti failure falls through to normal invalid handling below
            }
        }

        if (status == JwtService.TokenStatus.EXPIRED) {
            writeProblem(response, HttpStatus.UNAUTHORIZED, "Token Expired",
                    "Access token has expired. Please refresh.");
            return;
        }

        if (status == JwtService.TokenStatus.INVALID) {
            writeProblem(response, HttpStatus.UNAUTHORIZED, "Invalid Token",
                    "Access token is invalid.");
            return;
        }

        Long userId = jwtService.extractUserId(token);
        List<String> roles = jwtService.extractRoles(token);

        List<SimpleGrantedAuthority> authorities = roles.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userId, null, authorities);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        filterChain.doFilter(request, response);
    }

    private void writeProblem(HttpServletResponse response, HttpStatus status, String title, String detail)
            throws IOException {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detail);
        pd.setTitle(title);
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        objectMapper.writeValue(response.getWriter(), pd);
    }
}


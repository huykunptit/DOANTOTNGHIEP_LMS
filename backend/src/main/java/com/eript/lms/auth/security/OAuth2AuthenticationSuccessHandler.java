package com.eript.lms.auth.security;

import com.eript.lms.auth.config.FrontendProperties;
import com.eript.lms.auth.entity.auth.User;
import com.eript.lms.auth.entity.rbac.Role;
import com.eript.lms.auth.repository.auth.RefreshTokenRepository;
import com.eript.lms.auth.repository.auth.UserRepository;
import com.eript.lms.auth.repository.rbac.RoleRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final FrontendProperties frontendProperties;

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String googleId = oAuth2User.getAttribute("sub");

        if (email == null) {
            log.warn("OAuth2 login: no email in token");
            getRedirectStrategy().sendRedirect(request, response,
                    frontendProperties.baseUrl() + "/login?error=no_email");
            return;
        }

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                    .orElseGet(() -> roleRepository.save(
                            Role.builder().name("ROLE_STUDENT").guardName("web").build()));
            return userRepository.save(User.builder()
                    .name(name != null ? name : email)
                    .email(email)
                    .password("")
                    .googleId(googleId)
                    .userType("student")
                    .emailVerifiedAt(LocalDateTime.now())
                    .roles(new HashSet<>(Set.of(studentRole)))
                    .build());
        });

        if (googleId != null && user.getGoogleId() == null) {
            user.setGoogleId(googleId);
            userRepository.save(user);
        }

        if (!Boolean.TRUE.equals(user.getActive())) {
            getRedirectStrategy().sendRedirect(request, response,
                    frontendProperties.baseUrl() + "/login?error=account_disabled");
            return;
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        com.eript.lms.auth.entity.auth.RefreshToken rt =
                com.eript.lms.auth.entity.auth.RefreshToken.builder()
                        .userId(user.getId())
                        .token(refreshToken)
                        .expiresAt(LocalDateTime.now().plusDays(30))
                        .build();
        refreshTokenRepository.save(rt);

        String redirectUrl = UriComponentsBuilder
                .fromUriString(frontendProperties.baseUrl() + "/oauth2/callback")
                .queryParam("token", accessToken)
                .queryParam("refresh", refreshToken)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}

package com.example.demo.util;

import com.example.demo.dto.response.ResLoginDTO;
import com.nimbusds.jose.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service

public class SecurityUtil {
    private final JwtEncoder jwtEncoder;

    @Value("${tuan.jwt.base64-secret}")
    private String jwtKey;
    @Value("${tuan.jwt.access-token-validity-in-seconds}")
    private Long accessTokenExpirationInSeconds;
    @Value("${tuan.jwt.refresh-token-validity-in-seconds}")
    private Long refreshTokenExpirationInSeconds;
    public static final MacAlgorithm JWT_ALOGORITHM=MacAlgorithm.HS512;
    public SecurityUtil(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }
    public String createAccessToken(String email, ResLoginDTO dto) {
        ResLoginDTO.UserInsideToken userToken =new ResLoginDTO.UserInsideToken(
                dto.getUser().getId(),
                dto.getUser().getEmail(),
                dto.getUser().getName()
        );
        Instant now = Instant.now();
        Instant validity = now.plus(accessTokenExpirationInSeconds, ChronoUnit.SECONDS);
        //hardcode permission
        String role=dto.getRole().name();
        // @formatter:off
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(email)
                .claim("user", userToken)
                .claim("role", role)
                .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALOGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }
    public static String extractPrincipal(Authentication authentication) {
        if (authentication==null) return null;
        else if (authentication.getPrincipal() instanceof  UserDetails springSecurityUserDetails) {
            return springSecurityUserDetails.getUsername();
        }
        else if (authentication.getPrincipal() instanceof  Jwt jwt){
            return jwt.getSubject();
        }
        else if (authentication.getPrincipal() instanceof  String s){
            return s;

        }
        return null;
    }
    public String createRefreshToken(String email,ResLoginDTO dto) {
        ResLoginDTO.UserInsideToken userToken =new ResLoginDTO.UserInsideToken(
                dto.getUser().getId(),
                dto.getUser().getEmail(),
                dto.getUser().getName()
        );

        Instant now = Instant.now();
        Instant validity = now.plus(refreshTokenExpirationInSeconds, ChronoUnit.SECONDS);


        // @formatter:off
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(email)
                .claim("user", userToken)
                .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALOGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();

    }
    public static Optional<String> getCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(extractPrincipal(securityContext.getAuthentication()));
    }
    private SecretKey getSecretKey() {
        byte[] keyBytes = Base64.from(jwtKey).decode();
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, JWT_ALOGORITHM.getName());
    }
    public Jwt checkValidRefreshToken(String token){
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(
                getSecretKey()).macAlgorithm(SecurityUtil.JWT_ALOGORITHM).build();
        try{
            return jwtDecoder.decode(token);
        }catch (Exception e) {
            System.out.println("refresh_Token error:"+e.getMessage());
            throw e;
        }
    }
    public static Optional<String> getCurrentUserJWT() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(securityContext.getAuthentication())
                .filter(authentication -> authentication.getCredentials() instanceof String)
                .map(authentication -> (String) authentication.getCredentials());
    }
}

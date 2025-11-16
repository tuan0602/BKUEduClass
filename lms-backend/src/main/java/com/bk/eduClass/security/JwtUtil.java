package com.bk.eduClass.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Secret key (tạo 256-bit key)
    private final Key SECRET_KEY = Keys.hmacShaKeyFor("mySuperSecretKeyForJwt1234567890123456".getBytes());

    private final long EXPIRATION_MS = 24 * 60 * 60 * 1000; // 1 ngày

    // Tạo token
    public String generateToken(String userId) {
        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256) // dùng Key thay vì String
                .compact();
    }

    // Lấy userId từ token
    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // Kiểm tra token hợp lệ
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("Token hết hạn");
        } catch (JwtException e) {
            System.out.println("Token không hợp lệ");
        }
        return false;
    }
}

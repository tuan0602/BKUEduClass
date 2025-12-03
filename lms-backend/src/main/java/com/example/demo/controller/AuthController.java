package com.example.demo.controller;

import com.example.demo.domain.User;
import com.example.demo.dto.response.userDTO.ResUserDTO;
import com.example.demo.service.AuthService;
// import com.example.demo.service.UserService;
import com.example.demo.dto.request.auth.RegisterRequestDTO;
import com.example.demo.dto.request.auth.RequestLoginDTO;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.ResLoginDTO;
import com.example.demo.util.SecurityUtil;
import com.example.demo.util.errors.CustomException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/auth")
public class AuthController {
    @Value("${tuan.jwt.refresh-token-validity-in-seconds}")
    private Long refreshTokenExpirationInSeconds;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final AuthService authService;
    private final SecurityUtil securityUtil;
    @PostMapping("/login")
    @Operation(summary = "Login", description = "")
    public ResponseEntity<ApiResponse<ResLoginDTO>> login(@Valid @RequestBody RequestLoginDTO requestLoginDTO){
        // nạp username va password vao Security
        UsernamePasswordAuthenticationToken authenticationToken
                =new UsernamePasswordAuthenticationToken(requestLoginDTO.getEmail(), requestLoginDTO.getPassword());

        //xac thuc nguoi dung => viết hàm loadUserByUsername
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        //set thông tin người dùng đăng phập vào context
        SecurityContextHolder.getContext().setAuthentication(authentication);
        //create a token

        ResLoginDTO resLoginDTO=new ResLoginDTO();
        User user=authService.getUserByEmail(requestLoginDTO.getEmail());

        resLoginDTO.setUser(resLoginDTO.new UserLogin(user.getUserId(), user.getEmail(), user.getName(),user.getRole()));
        resLoginDTO.setRole(user.getRole());
        //create acess token
        String access_token=securityUtil.createAccessToken(authentication.getName(),resLoginDTO);
        resLoginDTO.setToken(access_token);
        resLoginDTO.setRole(user.getRole());
        resLoginDTO.setEmail(user.getEmail());
        resLoginDTO.setName(user.getName());
        resLoginDTO.setUserId(user.getUserId());
        //create refresh token
        String new_refresh_token=securityUtil.createRefreshToken(requestLoginDTO.getEmail(),resLoginDTO);
        //update user
        authService.updateUserToken(new_refresh_token,user.getEmail());

        //set cookie
        ResponseCookie responseCookie=ResponseCookie
                .from("refresh_Token", new_refresh_token)
                .httpOnly(true)//Chỉ server dùng đc
                .secure(true)
                .path("/")//tất cả đường link
                .maxAge(refreshTokenExpirationInSeconds) //giay het han
                .build();

        ApiResponse<ResLoginDTO> response= new ApiResponse<>(HttpStatus.OK,"login successful",resLoginDTO,null);
        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .body(response);
    }
    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản mới", description = "")
    public ResponseEntity<ApiResponse<User>> registerUser(
            @Valid @RequestBody RegisterRequestDTO registerRequestDTO){
        User newUser= registerRequestDTO.createDTOToUser();
        User createdUser = authService.registerUser(newUser);
        ApiResponse<User> response=new ApiResponse<>(HttpStatus.CREATED,"create successful",createdUser,null);
        return ResponseEntity.ok().body(response);
    }
    @GetMapping("/refresh")
    @Operation(summary = "Cấp accessToken mới", description = "")
    public ResponseEntity<ApiResponse<ResLoginDTO>> getRefreshToken(
            @CookieValue(name = "refresh_Token" ,defaultValue = "quanque")String refreshToken
    ){
        if (refreshToken.equals("quanque")){
            throw new CustomException("Không có token trong cookie");
        }
        //checkValid Token
        Jwt decodedToken = securityUtil.checkValidRefreshToken(refreshToken);
        //check user by email+refreshtoken

        String email=decodedToken.getSubject();
        User currentUser=authService.getUserByEmailAndRefreshToken(email,refreshToken);
        if (currentUser==null){
            throw new RuntimeException("Refresh token invalid");
        }
        //issue new refresh token
        //create a token
        ResLoginDTO resLoginDTO=new ResLoginDTO();

        User user=authService.getUserByEmail(email);
        resLoginDTO.setUser(resLoginDTO.new UserLogin(user.getUserId(), user.getEmail(), user.getName(), user.getRole()));
        resLoginDTO.setRole(user.getRole());
        //create acess token
        String access_token=securityUtil.createAccessToken(email,resLoginDTO);
        resLoginDTO.setToken(access_token);

        //create refreshtoken
        String new_refresh_token=securityUtil.createRefreshToken(email,resLoginDTO);
        //update user
        authService.updateUserToken(new_refresh_token,user.getEmail());

        //set cookie
        ResponseCookie responseCookie=ResponseCookie
                .from("refresh_Token", new_refresh_token)
                .httpOnly(true)//Chỉ server dùng đc
                .secure(true)
                .path("/")//tất cả đường link
                .maxAge(refreshTokenExpirationInSeconds) //giay het han
                .build();
        ApiResponse<ResLoginDTO> response=new ApiResponse<>(HttpStatus.OK,"Call API success",resLoginDTO,null);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .body(response);
    }
    @PostMapping("/logout")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Logout", description = "")
    public ResponseEntity<ApiResponse<Void>> logout(){
        String email=SecurityUtil.getCurrentUserLogin().isPresent()?  SecurityUtil.getCurrentUserLogin().get():"";

        if (email.equals("")){
            throw new CustomException("Access token invalid");
        }

        //update refresh token = null
        this.authService.updateUserToken(null,email);
        //remove refreshtoken
        ResponseCookie deleteCookie=ResponseCookie
                .from("refresh_Token", null)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();
        ApiResponse<Void> response=new ApiResponse<>(HttpStatus.OK,"Login success",null,null);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,deleteCookie.toString()).body(response);

    }
    @GetMapping("/me")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Get current user", description = "Get information of the currently authenticated user")
    public ResponseEntity<ApiResponse<ResUserDTO>> getCurrentUser(){
        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(()-> new RuntimeException("User not found"));
        User currentUser=authService.getUserByEmail(user);
        ResUserDTO resLoginDTO= ResUserDTO.fromUser(currentUser);
        ApiResponse<ResUserDTO> response=new ApiResponse<>(HttpStatus.OK,"get current user successful",resLoginDTO,null);
        return ResponseEntity.ok().body(response);
    }
    @PostMapping("/reset-password")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "ResetPassword", description = "")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestParam String newPassword){
        String email = securityUtil.getCurrentUserLogin()
                .orElseThrow(()-> new RuntimeException("User not found"));
        authService.resetPassword(email,newPassword);
        ApiResponse<Void> response=new ApiResponse<>(HttpStatus.OK,"reset password successful",null,null);
        return ResponseEntity.ok().body(response);

    }
}

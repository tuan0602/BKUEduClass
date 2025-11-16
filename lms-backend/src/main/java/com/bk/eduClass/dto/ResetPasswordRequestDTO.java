package com.bk.eduClass.dto;

public class ResetPasswordRequestDTO {
    private String token;      // token gửi từ email
    private String newPassword;

    // getters & setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}

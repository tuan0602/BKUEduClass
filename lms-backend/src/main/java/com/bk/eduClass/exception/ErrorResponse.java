package com.bk.eduClass.exception;

public class ErrorResponse {
    private String message;
    private int status;
    private long timestamp;

    public ErrorResponse(String message, int status) {
        this.message = message;
        this.status = status;
        this.timestamp = System.currentTimeMillis();
    }

    public String getMessage() { return message; }
    public int getStatus() { return status; }
    public long getTimestamp() { return timestamp; }
}
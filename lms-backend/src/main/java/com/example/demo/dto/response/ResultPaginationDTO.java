package com.example.demo.dto.response;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResultPaginationDTO {
    private Meta meta;
    private Object result;
    @Getter
    @Setter
    public static class Meta {
        private int totalElements;
        private int pageSize;
        private int currentPage;
        private int totalPages;
    }
}

package com.bk.eduClass.mapper;

import com.bk.eduClass.dto.AdminDTO;
import com.bk.eduClass.model.Admin;

public class AdminMapper {

    public static AdminDTO toDTO(Admin admin) {
        if (admin == null) return null;

        return AdminDTO.builder()
                .adminId(admin.getAdminId())
                .userId(admin.getUser() != null ? admin.getUser().getUserId() : null)
                .permissions(admin.getPermissions())
                .build();
    }

    public static Admin toEntity(AdminDTO dto) {
        if (dto == null) return null;

        Admin admin = new Admin();
        admin.setAdminId(dto.getAdminId());
        admin.setPermissions(dto.getPermissions());

        return admin;
    }
}

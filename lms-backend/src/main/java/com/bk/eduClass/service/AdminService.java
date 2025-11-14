package com.bk.eduClass.service;

import com.bk.eduClass.dto.AdminDTO;
import java.util.List;

public interface AdminService {
    AdminDTO createAdmin(AdminDTO adminDTO);
    AdminDTO getAdminById(String adminId);
    AdminDTO getAdminByUserId(String userId);
    List<AdminDTO> getAllAdmins();
    AdminDTO updateAdmin(AdminDTO adminDTO);
    void deleteAdmin(String adminId);
}

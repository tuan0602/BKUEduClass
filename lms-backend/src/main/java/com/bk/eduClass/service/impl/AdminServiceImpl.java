package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.AdminDTO;
import com.bk.eduClass.model.Admin;
import com.bk.eduClass.repository.AdminRepository;
import com.bk.eduClass.service.AdminService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    private AdminDTO toDTO(Admin admin) {
        AdminDTO dto = new AdminDTO();
        dto.setAdminId(admin.getAdminId());
        dto.setUserId(admin.getUser().getUserId());
        dto.setPermissions(admin.getPermissions());
        return dto;
    }

    private Admin toEntity(AdminDTO dto) {
        Admin admin = new Admin();
        admin.setAdminId(dto.getAdminId());
        admin.setPermissions(dto.getPermissions());
        // User object set in controller or service layer
        return admin;
    }

    @Override
    public AdminDTO createAdmin(AdminDTO adminDTO) {
        Admin admin = adminRepository.save(toEntity(adminDTO));
        return toDTO(admin);
    }

    @Override
    public AdminDTO getAdminById(String adminId) {
        return adminRepository.findById(adminId).map(this::toDTO).orElse(null);
    }

    @Override
    public AdminDTO getAdminByUserId(String userId) {
        return adminRepository.findByUserUserId(userId).map(this::toDTO).orElse(null);
    }

    @Override
    public List<AdminDTO> getAllAdmins() {
        return adminRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public AdminDTO updateAdmin(AdminDTO adminDTO) {
        Admin admin = adminRepository.save(toEntity(adminDTO));
        return toDTO(admin);
    }

    @Override
    public void deleteAdmin(String adminId) {
        adminRepository.deleteById(adminId);
    }
}

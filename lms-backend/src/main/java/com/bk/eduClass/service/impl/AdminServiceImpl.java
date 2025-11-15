package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.AdminDTO;
import com.bk.eduClass.mapper.AdminMapper;
import com.bk.eduClass.model.Admin;
import com.bk.eduClass.model.User;
import com.bk.eduClass.repository.AdminRepository;
import com.bk.eduClass.repository.UserRepository;
import com.bk.eduClass.service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public AdminDTO createAdmin(AdminDTO adminDTO) {
        Admin admin = AdminMapper.toEntity(adminDTO);

        // set User cho Admin
        User user = userRepository.findById(adminDTO.getUserId()).orElse(null);
        admin.setUser(user);

        admin = adminRepository.save(admin);
        return AdminMapper.toDTO(admin);
    }

    @Override
    public AdminDTO getAdminById(String adminId) {
        return adminRepository.findById(adminId)
                .map(AdminMapper::toDTO)
                .orElse(null);
    }

    @Override
    public AdminDTO getAdminByUserId(String userId) {
        return adminRepository.findByUserUserId(userId)
                .map(AdminMapper::toDTO)
                .orElse(null);
    }

    @Override
    public List<AdminDTO> getAllAdmins() {
        return adminRepository.findAll()
                .stream()
                .map(AdminMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AdminDTO updateAdmin(AdminDTO adminDTO) {
        Admin admin = AdminMapper.toEntity(adminDTO);

        // update User nếu cần
        User user = userRepository.findById(adminDTO.getUserId()).orElse(null);
        admin.setUser(user);

        admin = adminRepository.save(admin);
        return AdminMapper.toDTO(admin);
    }

    @Override
    public void deleteAdmin(String adminId) {
        adminRepository.deleteById(adminId);
    }
}

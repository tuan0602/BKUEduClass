package com.bk.eduClass.mapper;

import com.bk.eduClass.model.User;
import com.bk.eduClass.dto.UserDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // ENTITY → DTO
    @Mapping(target = "locked", source = "locked")
    UserDTO toDTO(User user);

    // DTO → ENTITY
    @Mapping(target = "password", ignore = true) // không bao giờ map password từ DTO
    User toEntity(UserDTO dto);

    // UPDATE ENTITY FROM DTO
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "userId", ignore = true) // id không cho phép update
    void updateEntity(@MappingTarget User user, UserDTO dto);
}

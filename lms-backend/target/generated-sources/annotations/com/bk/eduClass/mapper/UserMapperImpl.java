package com.bk.eduClass.mapper;

import com.bk.eduClass.dto.UserDTO;
import com.bk.eduClass.model.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-15T13:05:11+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.9 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDTO toDTO(User user) {
        if ( user == null ) {
            return null;
        }

        UserDTO.UserDTOBuilder userDTO = UserDTO.builder();

        userDTO.locked( user.getLocked() );
        userDTO.userId( user.getUserId() );
        userDTO.email( user.getEmail() );
        userDTO.name( user.getName() );
        userDTO.role( user.getRole() );
        userDTO.avatar( user.getAvatar() );
        userDTO.phone( user.getPhone() );
        userDTO.createdAt( user.getCreatedAt() );

        return userDTO.build();
    }

    @Override
    public User toEntity(UserDTO dto) {
        if ( dto == null ) {
            return null;
        }

        User user = new User();

        user.setUserId( dto.getUserId() );
        user.setEmail( dto.getEmail() );
        user.setName( dto.getName() );
        user.setRole( dto.getRole() );
        user.setAvatar( dto.getAvatar() );
        user.setPhone( dto.getPhone() );
        user.setLocked( dto.getLocked() );
        user.setCreatedAt( dto.getCreatedAt() );

        return user;
    }

    @Override
    public void updateEntity(User user, UserDTO dto) {
        if ( dto == null ) {
            return;
        }

        user.setEmail( dto.getEmail() );
        user.setName( dto.getName() );
        user.setRole( dto.getRole() );
        user.setAvatar( dto.getAvatar() );
        user.setPhone( dto.getPhone() );
        user.setLocked( dto.getLocked() );
        user.setCreatedAt( dto.getCreatedAt() );
    }
}

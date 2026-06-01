package com.eript.lms.auth.mapper;

import com.eript.lms.auth.dto.response.UserResponse;
import com.eript.lms.auth.entity.auth.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuthMapper {

    @Mapping(target = "roles", expression = "java(user.getRoles().stream().map(role -> role.getName()).collect(java.util.stream.Collectors.toSet()))")
    UserResponse toUserResponse(User user);
}

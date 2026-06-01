package com.eript.lms.auth.mapper;

import com.eript.lms.auth.dto.request.RegisterRequest;
import com.eript.lms.auth.entity.auth.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toEntity(RegisterRequest request);
}

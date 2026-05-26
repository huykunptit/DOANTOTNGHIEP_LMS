package com.eript.auth.mapper;

import com.eript.auth.dto.request.RegisterRequest;
import com.eript.auth.entity.auth.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toEntity(RegisterRequest request);
}

class AuthResponse {
  final String accessToken;
  final String refreshToken;
  final int userId;
  final String name;
  final String email;
  final List<String> roles;

  AuthResponse({
    required this.accessToken,
    required this.refreshToken,
    required this.userId,
    required this.name,
    required this.email,
    required this.roles,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      accessToken: json['accessToken'] as String,
      refreshToken: json['refreshToken'] as String,
      userId: (json['userId'] as num).toInt(),
      name: json['name'] as String,
      email: json['email'] as String,
      roles: ((json['roles'] as List?) ?? const []).map((e) => e as String).toList(),
    );
  }
}

class UserResponse {
  final int id;
  final String name;
  final String email;
  final String? userType;
  final bool active;
  final List<String> roles;

  UserResponse({
    required this.id,
    required this.name,
    required this.email,
    required this.userType,
    required this.active,
    required this.roles,
  });

  factory UserResponse.fromJson(Map<String, dynamic> json) {
    return UserResponse(
      id: (json['id'] as num).toInt(),
      name: json['name'] as String,
      email: json['email'] as String,
      userType: json['userType'] as String?,
      active: (json['active'] as bool?) ?? true,
      roles: ((json['roles'] as List?) ?? const []).map((e) => e as String).toList(),
    );
  }
}

class UpdateProfileRequest {
  final String? name;
  final String? phone;
  final String? bio;
  final String? avatar;
  final String? gender;
  final String? dateOfBirth;
  final String? hometown;
  final String? permanentAddress;

  UpdateProfileRequest({
    this.name,
    this.phone,
    this.bio,
    this.avatar,
    this.gender,
    this.dateOfBirth,
    this.hometown,
    this.permanentAddress,
  });

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    if (name != null) map['name'] = name;
    if (phone != null) map['phone'] = phone;
    if (bio != null) map['bio'] = bio;
    if (avatar != null) map['avatar'] = avatar;
    if (gender != null) map['gender'] = gender;
    if (dateOfBirth != null) map['dateOfBirth'] = dateOfBirth;
    if (hometown != null) map['hometown'] = hometown;
    if (permanentAddress != null) map['permanentAddress'] = permanentAddress;
    return map;
  }
}

class AuthTokens {
  static const accessKey = 'access_token';
  static const refreshKey = 'refresh_token';
}

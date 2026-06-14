"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  logoutAll as logoutAllApi,
  changePassword as changePasswordApi,
  updateProfile as updateProfileApi,
  type LoginRequest,
  type RegisterRequest,
  type ChangePasswordRequest,
  type UpdateProfileRequest,
  type AuthResponse,
} from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

function homeForRoles(roles: string[]): string {
  if (roles.includes("ROLE_ADMIN")) return "/admin";
  if (roles.includes("ROLE_INSTRUCTOR")) return "/instructor";
  return "/student";
}

export function useAuth() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useAuthStore((s) => s.setUser);
  const storeLogout = useAuthStore((s) => s.logout);

  const isLoggedIn = !!accessToken;
  const roles = user?.roles ?? [];

  const persistAuth = (auth: AuthResponse) => {
    setAuth(
      {
        id: auth.userId,
        name: auth.name,
        email: auth.email,
        roles: auth.roles,
      },
      auth.accessToken,
      auth.refreshToken
    );
  };

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => loginApi(data),
    onSuccess: (auth) => {
      persistAuth(auth);
      router.push(homeForRoles(auth.roles));
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => registerApi(data),
    onSuccess: (auth) => {
      persistAuth(auth);
      router.push(homeForRoles(auth.roles));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        try {
          await logoutApi(refreshToken);
        } catch {
          /* ignore */
        }
      }
    },
    onSettled: () => {
      storeLogout();
      router.push("/login");
    },
  });

  const logoutAllMutation = useMutation({
    mutationFn: () => logoutAllApi(),
    onSettled: () => {
      storeLogout();
      router.push("/login");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePasswordApi(data),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfileApi(data),
    onSuccess: (updated) => {
      setUser({
        id: updated.id,
        name: updated.name,
        email: updated.email,
        roles: updated.roles,
        userType: updated.userType,
      });
    },
  });

  return {
    user,
    roles,
    isLoggedIn,
    hasRole: (role: string) => roles.includes(role),
    login: loginMutation.mutateAsync,
    loginPending: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    registerPending: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutate,
    logoutAll: logoutAllMutation.mutate,
    changePassword: changePasswordMutation.mutateAsync,
    changePasswordPending: changePasswordMutation.isPending,
    updateProfile: updateProfileMutation.mutateAsync,
    updateProfilePending: updateProfileMutation.isPending,
  };
}

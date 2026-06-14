import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  roles: string[];
  userType?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
}

const COOKIE_NAME = "access_token";

function writeCookie(token: string | null) {
  if (typeof document === "undefined") return;
  if (token) {
    document.cookie = `${COOKIE_NAME}=${token}; path=/; SameSite=Lax; max-age=86400`;
  } else {
    document.cookie = `${COOKIE_NAME}=; path=/; SameSite=Lax; max-age=0`;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) => {
        writeCookie(accessToken);
        set({ user, accessToken, refreshToken });
      },
      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) => {
        writeCookie(accessToken);
        set({ accessToken, refreshToken });
      },
      logout: () => {
        writeCookie(null);
        set({ user: null, accessToken: null, refreshToken: null });
      },
      isAuthenticated: () => !!get().accessToken,
      hasRole: (role) => get().user?.roles.includes(role) ?? false,
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) writeCookie(state.accessToken);
      },
    }
  )
);

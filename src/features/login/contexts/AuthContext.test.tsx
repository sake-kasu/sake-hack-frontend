import { describe, it, expect, vi, beforeEach } from "vitest";
import { waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { AuthProvider, useAuth } from "@/features/login/contexts/AuthContext";
import type { ReactNode } from "react";

// ===== テストセットアップ =====

const mockOnAuthStateChanged = vi.mocked(onAuthStateChanged);
const mockSignInWithPopup = vi.mocked(signInWithPopup);
const mockSignOut = vi.mocked(signOut);

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

beforeEach(() => {
  vi.clearAllMocks();
});

// ===== AuthProvider =====

describe("AuthProvider", () => {
  describe("初期状態", () => {
    it("ローディング中はisLoadingがtrueを返す", () => {
      mockOnAuthStateChanged.mockImplementation(() => vi.fn());

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("未認証状態", () => {
    it("ユーザーがnullの場合、isAuthenticatedがfalseを返す", async () => {
      mockOnAuthStateChanged.mockImplementation((auth, callback) => {
        if (typeof callback === "function") {
          callback(null);
        }
        return vi.fn();
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("認証済み状態", () => {
    it("ユーザーが存在する場合、isAuthenticatedがtrueを返す", async () => {
      const mockUser = {
        uid: "test-uid",
        email: "test@example.com",
        displayName: "Test User",
        photoURL: "https://example.com/photo.jpg",
      };

      mockOnAuthStateChanged.mockImplementation((auth, callback) => {
        if (typeof callback === "function") {
          callback(mockUser as Parameters<typeof callback>[0]);
        }
        return vi.fn();
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual({
        uid: "test-uid",
        email: "test@example.com",
        displayName: "Test User",
        photoURL: "https://example.com/photo.jpg",
      });
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});

// ===== signInWithGoogle =====

describe("signInWithGoogle", () => {
  it("signInWithPopupを呼び出す", async () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      if (typeof callback === "function") {
        callback(null);
      }
      return vi.fn();
    });
    mockSignInWithPopup.mockResolvedValue({
      user: { uid: "test-uid" },
    } as ReturnType<typeof signInWithPopup> extends Promise<infer T>
      ? T
      : never);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.signInWithGoogle();
    });

    expect(mockSignInWithPopup).toHaveBeenCalled();
  });
});

// ===== signOut =====

describe("signOut", () => {
  it("firebaseSignOutを呼び出す", async () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      if (typeof callback === "function") {
        callback(null);
      }
      return vi.fn();
    });
    mockSignOut.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSignOut).toHaveBeenCalled();
  });
});

// ===== useAuth =====

describe("useAuth", () => {
  it("AuthProvider外で使用するとエラーをスローする", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow("useAuth must be used within an AuthProvider");

    consoleError.mockRestore();
  });
});

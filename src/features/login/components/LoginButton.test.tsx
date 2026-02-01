import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginButton } from "@/features/login/components/LoginButton";
import * as AuthContext from "@/features/login/contexts/AuthContext";

// ===== テストセットアップ =====

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "auth.loginWithGoogle": "Googleでログイン",
      };
      return translations[key] ?? key;
    },
  }),
}));

const mockSignInWithGoogle = vi.fn();

vi.spyOn(AuthContext, "useAuth").mockReturnValue({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  signInWithGoogle: mockSignInWithGoogle,
  signOut: vi.fn(),
});

beforeEach(() => {
  vi.clearAllMocks();
});

// ===== LoginButton =====

describe("LoginButton", () => {
  describe("表示", () => {
    it("ログインボタンが表示される", () => {
      render(<LoginButton />);

      expect(
        screen.getByRole("button", { name: /googleでログイン/i }),
      ).toBeInTheDocument();
    });
  });

  describe("クリック動作", () => {
    it("クリックするとsignInWithGoogleが呼び出される", async () => {
      mockSignInWithGoogle.mockResolvedValue(undefined);

      render(<LoginButton />);

      const button = screen.getByRole("button", { name: /googleでログイン/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
      });
    });

    it("ログイン中はボタンが無効になる", async () => {
      mockSignInWithGoogle.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      render(<LoginButton />);

      const button = screen.getByRole("button", { name: /googleでログイン/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe("エラーハンドリング", () => {
    it("ログインエラーが発生してもクラッシュしない", async () => {
      mockSignInWithGoogle.mockRejectedValue(new Error("Login cancelled"));

      render(<LoginButton />);

      const button = screen.getByRole("button", { name: /googleでログイン/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(button).not.toBeDisabled();
      });
    });
  });
});

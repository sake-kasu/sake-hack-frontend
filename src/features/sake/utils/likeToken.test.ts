import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getOrCreateLikeToken } from "@/features/sake/utils/likeToken";

describe("getOrCreateLikeToken", () => {
  const storageMap = new Map<string, string>();

  const mockLocalStorage = {
    getItem: (key: string): string | null => storageMap.get(key) ?? null,
    setItem: (key: string, value: string): void => {
      storageMap.set(key, value);
    },
    removeItem: (key: string): void => {
      storageMap.delete(key);
    },
    clear: (): void => {
      storageMap.clear();
    },
    get length(): number {
      return storageMap.size;
    },
    key: (_index: number): string | null => null,
  };

  beforeEach(() => {
    storageMap.clear();
    vi.stubGlobal("localStorage", mockLocalStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // ===== 新規生成 =====

  it("localStorage にトークンが無い場合、新規生成して保存する", () => {
    const mockUUID = "test-uuid-1234-5678-abcd";
    vi.stubGlobal("crypto", { randomUUID: () => mockUUID });

    const token = getOrCreateLikeToken();

    expect(token).toBe(mockUUID);
    expect(storageMap.get("sake-hack-like-token")).toBe(mockUUID);
  });

  // ===== 既存トークン =====

  it("localStorage に既存トークンがある場合、それを返す", () => {
    const existingToken = "existing-token-value";
    storageMap.set("sake-hack-like-token", existingToken);

    const token = getOrCreateLikeToken();

    expect(token).toBe(existingToken);
  });

  // ===== 冪等性 =====

  it("複数回呼び出しても同じトークンを返す", () => {
    const mockUUID = "test-uuid-idempotent";
    vi.stubGlobal("crypto", { randomUUID: () => mockUUID });

    const first = getOrCreateLikeToken();
    const second = getOrCreateLikeToken();
    const third = getOrCreateLikeToken();

    expect(first).toBe(second);
    expect(second).toBe(third);
  });
});

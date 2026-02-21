const STORAGE_KEY = "sake-hack-like-token";

export const getOrCreateLikeToken = (): string => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const token = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, token);
  return token;
};

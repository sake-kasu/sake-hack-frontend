import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Firebase Auth mock
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({
    currentUser: null,
  })),
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback(null);
    return vi.fn();
  }),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}));

// Firebase App mock
vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({})),
}));

// Firebase config mock
vi.mock("@/lib/firebase/config", () => ({
  app: {},
  auth: {
    currentUser: null,
  },
}));

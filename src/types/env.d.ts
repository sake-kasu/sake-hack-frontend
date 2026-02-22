// Runtime環境変数の型定義
export type RuntimeEnv = {
  readonly API_BASE_URL: string;
  readonly SESSION_KEY: string;
};

declare global {
  interface Window {
    __ENV__: RuntimeEnv;
  }
}

export {};

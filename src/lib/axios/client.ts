import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1秒

type RequestConfigWithRetry = InternalAxiosRequestConfig & {
  retryCount?: number;
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const createAxiosClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // リクエストインターセプター
  client.interceptors.request.use(
    (config) => {
      // 認証トークンなどを追加
      return config;
    },
    (error) => Promise.reject(error),
  );

  // レスポンスインターセプター(exponential backoff)
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as RequestConfigWithRetry | undefined;

      if (!config) {
        return Promise.reject(error);
      }

      // リトライカウンターの初期化
      const retryCount = config.retryCount ?? 0;

      // リトライ可能なエラーかチェック(5xx、ネットワークエラー)
      const isRetryable =
        !error.response ||
        (error.response.status >= 500 && error.response.status < 600);

      if (isRetryable && retryCount < MAX_RETRIES) {
        // Exponential backoff計算
        const delay = INITIAL_RETRY_DELAY * 2 ** retryCount;

        // リトライカウントを増やす
        config.retryCount = retryCount + 1;

        await sleep(delay);

        return client(config);
      }

      return Promise.reject(error);
    },
  );

  return client;
};

export const apiClient = createAxiosClient();

// Orval用のカスタムインスタンス関数
export const customInstance = <T>(
  config: Parameters<typeof apiClient>[0],
): Promise<T> => {
  return apiClient(config).then(({ data }) => data);
};

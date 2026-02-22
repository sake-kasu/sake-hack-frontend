import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { getOrCreateLikeToken } from "@/features/sake/utils/likeToken";
import { getEnqueueSnackbar } from "@/lib/notification/notificationRef";

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1秒

type RequestConfigWithRetry = InternalAxiosRequestConfig & {
  retryCount?: number;
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * Runtime環境変数から API Base URL を取得
 * window.__ENV__ が存在しない場合や API_BASE_URL が空の場合はエラー
 */
const getApiBaseUrl = (): string => {
  // window.__ENV__ の存在チェック
  if (typeof window === "undefined" || !window.__ENV__) {
    throw new Error(
      "ランタイム環境変数が読み込まれていません。env-config.jsがこのスクリプトより前に読み込まれていることを確認してください。",
    );
  }

  const baseUrl = window.__ENV__.API_BASE_URL;

  // 空文字列チェック
  if (!baseUrl || baseUrl.trim() === "") {
    throw new Error("API_BASE_URLがランタイム環境変数に設定されていません。");
  }

  return baseUrl;
};

export const createAxiosClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // リクエストインターセプター
  client.interceptors.request.use(
    (config) => {
      // /sakes パスへのリクエストに X-Like-Token を付与
      if (config.url?.includes("/sakes")) {
        config.headers.set("X-Like-Token", getOrCreateLikeToken());
      }
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

  // グローバルエラー通知インターセプター（リトライ後に最終的にrejectされたエラーに対して発火）
  client.interceptors.response.use(undefined, (error: AxiosError) => {
    const enqueue = getEnqueueSnackbar();
    if (enqueue) {
      const status = error.response?.status;
      const data = error.response?.data;
      let message = "通信エラーが発生しました";

      if (status !== undefined && status >= 400 && status < 500) {
        message = extractErrorMessage(data) ?? "リクエストの処理に失敗しました";
      } else if (status !== undefined && status >= 500) {
        message = extractErrorMessage(data) ?? "サーバーエラーが発生しました";
      }

      enqueue(message, {
        variant: "error",
        autoHideDuration: null,
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    }
    return Promise.reject(error);
  });

  return client;
};

const hasMessageProperty = (data: unknown): data is { message: unknown } => {
  return data !== null && typeof data === "object" && "message" in data;
};

const extractErrorMessage = (data: unknown): string | undefined => {
  if (
    hasMessageProperty(data) &&
    typeof data.message === "string" &&
    data.message.length > 0
  ) {
    return data.message;
  }
  return undefined;
};

export const apiClient = createAxiosClient();

// Orval用のカスタムインスタンス関数
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return apiClient(config).then(({ data }) => data);
};

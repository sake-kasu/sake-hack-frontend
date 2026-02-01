// Runtime環境変数設定(ローカル用)
// NOTE: 環境変数を追加する場合は、このファイルにも追加する必要がある
window.__ENV__ = {
  API_BASE_URL: "/api",
  OAUTH_SIGN_IN_URI: "http://localhost:8080/api/auth/login",
  OAUTH_SIGN_UP_URI: "http://localhost:8080/api/auth/register",
  SESSION_KEY: "sake-kasu-session-key",
};

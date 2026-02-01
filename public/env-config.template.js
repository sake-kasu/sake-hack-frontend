// Runtime環境変数設定(動的生成時のテンプレート)
// NOTE: 環境変数を追加する場合は、このファイルにも追加する必要がある
window.__ENV__ = {
  API_BASE_URL: "${VITE_APP_API_BASE_URL}",
  OAUTH_SIGN_IN_URI: "${VITE_APP_OAUTH_SIGN_IN_URI}",
  OAUTH_SIGN_UP_URI: "${VITE_APP_OAUTH_SIGN_UP_URI}",
  SESSION_KEY: "${VITE_APP_SESSION_KEY}",
};

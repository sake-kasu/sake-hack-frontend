#!/bin/sh
set -e

# 環境変数のデフォルト値を設定
export VITE_APP_API_BASE_URL="${VITE_APP_API_BASE_URL:-/api}"
export VITE_APP_SESSION_KEY="${VITE_APP_SESSION_KEY:-sake-kasu-session-key}"

echo "🔧 Runtime環境変数を設定中..."
echo "  API_BASE_URL: ${VITE_APP_API_BASE_URL}"

# テンプレートから実際の環境変数ファイルを生成
envsubst < /usr/share/nginx/html/env-config.template.js > /usr/share/nginx/html/env-config.js

echo "✅ 環境変数の設定が完了しました"

# nginxを起動
exec "$@"

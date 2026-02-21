.PHONY: help dev build preview clean test test-watch cover typecheck lint format deps api-generate

# 変数定義
APP_NAME=sake-hack-frontend
BUILD_DIR=./dist
NODE_MODULES=./node_modules
SRC_DIR=./src

help: ## このヘルプメッセージを表示
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# ビルド・実行
dev: ## 開発サーバーを起動
	@echo "🔥 開発サーバーを起動しています..."
	@bun vite --host

build: ## 本番用にビルド
	@echo "🔨 $(APP_NAME)をビルドしています..."
	@bun tsc && bun vite build

preview: ## ビルド成果物をプレビュー
	@echo "👀 ビルド成果物をプレビューしています..."
	@bun vite preview

clean: ## ビルド成果物をクリーンアップ
	@echo "🧹 クリーンアップ中..."
	@rm -rf $(BUILD_DIR)
	@rm -rf $(NODE_MODULES)
	@rm -f coverage.json

# テスト・品質
test: ## 全てのテストを実行
	@echo "🧪 テストを実行しています..."
	@bun vitest run

test-watch: ## テストをウォッチモードで実行
	@echo "👁️  テストをウォッチモードで実行しています..."
	@bun vitest

cover: ## カバレッジ測定付きでテストを実行
	@echo "📊 カバレッジを計測しています..."
	@bun vitest run --coverage
	@echo "✅ カバレッジレポートを生成しました"

typecheck: ## TypeScript型チェックを実行
	@echo "🔎 TypeScript型チェックを実行しています..."
	@bun tsc -b --noEmit

lint: typecheck ## リンターを実行
	@echo "🔍 リンターを実行しています..."
	@bun biome lint $(SRC_DIR)

format: ## コードをフォーマット
	@echo "✨ コードをフォーマットしています..."
	@bun biome format --write $(SRC_DIR)

# 依存関係
deps: ## 依存関係をインストール
	@echo "📦 依存関係をインストールしています..."
	@bun install

deps-clean: ## 依存関係をクリーンインストール
	@echo "🔄 依存関係をクリーンインストールしています..."
	@rm -rf $(NODE_MODULES)
	@bun install

# API開発
api-generate: ## OpenAPI仕様からAPIクライアントを自動生成
	@./scripts/generate-api.sh $(BRANCH)
	@echo "finished."

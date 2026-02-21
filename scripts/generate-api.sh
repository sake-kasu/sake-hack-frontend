#!/usr/bin/env bash

# ブランチ指定がない場合'develop'で生成を行う
branch=${1:-"develop"}
current_repository_url="$(git remote get-url origin)"
BACKEND_REPOSITORY_URL="$(echo "$current_repository_url" | sed 's|sake-hack-frontend|sake-hack-backend|')"
CLONE_DIR="external/backend-api"

# git URLからリポジトリ識別子(owner/repo)を抽出する
function normalize_repo_id() {
  echo "$1" | sed -E 's|^https?://github\.com/||; s|^git@github\.com:||; s|\.git$||'
}

# クローンしたbackendリポジトリを削除する
function cleanup() {
	if [ ! -d "${CLONE_DIR}" ]; then
    echo "'${CLONE_DIR}' does not exist."
    return 0;
  fi
  local existing_id
  existing_id="$(normalize_repo_id "$(git -C "${CLONE_DIR}" remote get-url origin)")"
  local expected_id
  expected_id="$(normalize_repo_id "${BACKEND_REPOSITORY_URL}")"
  if [[ "${existing_id}" != "${expected_id}" ]]; then
    echo "'${CLONE_DIR}' incorrect remote url."
    echo "$(git -C "${CLONE_DIR}" remote get-url origin)"
    return 0
  fi
  rm -rf "${CLONE_DIR}"
  echo "Cleaned '${CLONE_DIR}'."
}

# sake-hack-backendのapiディレクトリをsparse-checkoutし、orvalで生成を行う
function generate_api() {
  echo "Clone '${BACKEND_REPOSITORY_URL}' into '${CLONE_DIR}'..."
  git clone --quiet --filter=blob:none --depth=1 --no-checkout --branch="$branch" "${BACKEND_REPOSITORY_URL}" "${CLONE_DIR}" || {
    echo "failed to clone '${BACKEND_REPOSITORY_URL}'"
    cleanup
    exit 1
  }

  echo "Sparse-checkout 'api'."
  git -C "${CLONE_DIR}" sparse-checkout set api || {
    echo "failed to sparse-checkout"
    cleanup
    exit 1
  }

  echo "Checkout branch 'origin/${branch}'."
  git -C "${CLONE_DIR}" checkout --quiet "origin/${branch}" || {
    echo "failed to checkout branch"
    cleanup
    exit 1
  }

  echo "Bundling OpenAPI spec..."
  bunx @redocly/cli bundle "${CLONE_DIR}/api/openapi.yaml" -o "${CLONE_DIR}/api/openapi.bundled.yaml" || {
    echo "failed to bundle OpenAPI spec"
    cleanup
    exit 1
  }

  echo "Generating api..."
  bunx orval || {
    echo "failed to generate"
    cleanup
    exit 1
  }
}

## 実行前にcleanup
cleanup
## 生成、失敗時にcleanup
generate_api
## 処理完了後にcleanup
cleanup

#!/usr/bin/env zsh

set -euo pipefail

# Docker socket のセットアップ
if [ -S /var/run/docker.sock ]; then
  echo "🐳 Docker socket を検出、権限を設定中..."
  DOCKER_SOCK_GID=$(stat -c '%g' /var/run/docker.sock)
  echo "  - Docker socket GID: ${DOCKER_SOCK_GID}"

  if [ "${DOCKER_SOCK_GID}" = "0" ]; then
    # GID 0の場合は、docker.sockのパーミッションを変更
    echo "  - Docker socketがroot(GID 0)で実行されています"
    echo "  - docker.sockのパーミッションを変更します"
    sudo chmod 666 /var/run/docker.sock
  else
    # GID 0以外の場合は、dockerグループのGIDを変更
    sudo groupmod -g "${DOCKER_SOCK_GID}" docker || true
    sudo usermod -aG docker node
    # docker.sockのパーミッションも変更（念のため）
    sudo chmod 666 /var/run/docker.sock
  fi

  # dockerコマンドの動作確認
  if docker version &>/dev/null; then
    echo "  ✅ Docker CLI が正常に動作しています"
  else
    echo "  ⚠️  Docker CLI の動作確認に失敗しました"
  fi
else
  echo "⚠️  Docker socket が見つかりません"
  echo "  環境変数 DOCKER_SOCK を設定してください:"
  echo "  - Docker Desktop: 通常は設定不要"
  echo "  - Rancher Desktop: export DOCKER_SOCK=\$HOME/.rd/docker.sock"
  echo "  - Colima: export DOCKER_SOCK=\$HOME/.colima/default/docker.sock"
fi

echo "📦 Frontendのパッケージを追加..."
cd /workspace && bun install

ZSHRC="/home/node/.zshrc"

cat << 'EOF' >> "$ZSHRC"

# Git補完・プロンプト
source ~/.zsh/git-prompt.sh
fpath=(~/.zsh $fpath)
autoload -U compinit
compinit -u

# カラー補完
autoload -U colors
colors
zstyle ':completion:*' list-colors "${LS_COLORS}"

# autosuggestions
source ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh

# 補完設定
setopt complete_in_word
zstyle ':completion:*:default' menu select=1
zstyle ':completion::complete:*' use-cache true
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}'
setopt list_packed

# コマンド修正提案
setopt correct
SPROMPT="correct: %R -> %r ? [Yes/No/Abort/Edit] => "

# Git PS1 プロンプト設定
GIT_PS1_SHOWDIRTYSTATE=true
GIT_PS1_SHOWUNTRACKEDFILES=true
GIT_PS1_SHOWSTASHSTATE=true
GIT_PS1_SHOWUPSTREAM=auto

# プロンプト表示
setopt PROMPT_SUBST
PS1='%F{green}%n@%m%f: %F{cyan}%~%f %F{red}$(__git_ps1 "(%s)")%f'$'\n''\$ '
EOF

echo "✅ DevContainerの設定完了"

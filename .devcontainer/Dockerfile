FROM node:24.11-slim

ENV BUN_VERSION=1.3.3

RUN apt-get update && \
  apt-get install -y \
  curl \
  unzip \
  git \
  ca-certificates \
  build-essential \
  less \
  vim \
  zsh \
  wget \
  procps \
  sudo \
  gnupg \
  lsb-release

# bun
RUN curl -fsSL https://bun.sh/install | BUN_INSTALL_VERSION=${BUN_VERSION} bash && \
  mv /root/.bun /bun && \
  ln -s /bun/bin/bun /usr/local/bin/bun

# Docker CLI
RUN install -m 0755 -d /etc/apt/keyrings && \
  curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc && \
  chmod a+r /etc/apt/keyrings/docker.asc && \
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian bookworm stable" > /etc/apt/sources.list.d/docker.list && \
  apt-get update && \
  apt-get install -y docker-ce-cli docker-compose-plugin

# group と sudo のセットアップ
RUN groupadd -f docker && \
  usermod -aG docker node && \
  echo "node ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/node && \
  chmod 0440 /etc/sudoers.d/node

# zsh
RUN su - node -c "\
  sh -c \"\$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)\" --unattended && \
  git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions && \
  git clone https://github.com/zsh-users/zsh-syntax-highlighting ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting \
  "

RUN mkdir -p /home/node/.zsh && \
  curl -fsSL https://raw.githubusercontent.com/git/git/master/contrib/completion/git-prompt.sh -o /home/node/.zsh/git-prompt.sh && \
  curl -fsSL https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash -o /home/node/.zsh/git-completion.bash && \
  chown -R node:node /home/node/.zsh

RUN chsh -s /bin/zsh node

USER node
RUN npm config set prefix /home/node/.npm-global && \
    npm install -g @anthropic-ai/claude-code
ENV PATH="/home/node/.npm-global/bin:$PATH"

WORKDIR /workspace

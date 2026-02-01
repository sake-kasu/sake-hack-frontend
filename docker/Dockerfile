FROM nginxinc/nginx-unprivileged:1.29.2-alpine

USER root

# gettextはenvsubst用、curlはヘルスチェック用
RUN apk add --no-cache gettext curl

COPY --chown=nginx:nginx dist/ /usr/share/nginx/html/

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --chmod=755 docker/entrypoint.sh /entrypoint.sh

USER nginx

EXPOSE 3000

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

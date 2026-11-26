# 多阶段构建：前端产物 → 静态链接二进制 → 最小运行镜像
FROM node:22-alpine AS web
WORKDIR /app/web
COPY web/package.json web/package-lock.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

FROM golang:1-alpine AS build
ARG VERSION=dev
# 国内网络可加：--build-arg GOPROXY=https://goproxy.cn,direct
ARG GOPROXY=https://proxy.golang.org,direct
ENV GOPROXY=${GOPROXY}
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# 前端构建产物用于 go:embed，必须在上一步之后复制
COPY --from=web /app/web/dist ./web/dist
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath \
    -ldflags "-s -w -X main.version=${VERSION}" -o /out/qzone .

FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata su-exec \
 && adduser -D -H -u 10001 qzone \
 && mkdir -p /data /app && chown -R qzone:qzone /data \
 && printf '%s\n' \
    '#!/bin/sh' \
    'set -e' \
    '# 以 root 启动时先修好数据卷权限，再降权运行（bind mount 常是 root 所有）' \
    'if [ "$(id -u)" = "0" ]; then' \
    '  chown -R qzone:qzone /data 2>/dev/null || true' \
    '  exec su-exec qzone /app/qzone "$@"' \
    'fi' \
    'exec /app/qzone "$@"' > /entrypoint.sh \
 && chmod +x /entrypoint.sh

WORKDIR /app
COPY --from=build /out/qzone /app/qzone
ENV TZ=Asia/Shanghai
VOLUME ["/data"]
EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
CMD ["-addr", ":8080", "-data", "/data"]

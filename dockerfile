# 使用 Node.js 14 作为基础镜像
FROM node:20

# 设置工作目录
WORKDIR /app

# 复制整个应用到容器中
COPY ./ /app


ARG NEXT_PUBLIC_OPEN_AI_API_KEY
ENV NEXT_PUBLIC_OPEN_AI_API_KEY $NEXT_PUBLIC_OPEN_AI_API_KEY

ARG OPENAI_PROXY_URL
ENV OPENAI_PROXY_URL $OPENAI_PROXY_URL

# 安装依赖
RUN npm i -g pnpm

# 暴露 3000 端口
EXPOSE 3000

# 启动应用
CMD ["sh", "-c", "pnpm i && pnpm build && pnpm start"]

# 使用官方 Node.js 镜像
FROM node:16

# 设置工作目录
WORKDIR /app

# 复制依赖定义文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用代码
COPY . .

# 暴露服务端口
EXPOSE 3000

# 启动命令
CMD ["npm", "start"]
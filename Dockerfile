# tại sao chia làm 2 stage
# - Stage 1: builder
#   - Sử dụng để cài đặt các package cần thiết cho việc build ứng dụng
#   - Chạy lệnh build để tạo ra mã nguồn đã được biên dịch
# - Stage 2: production
#   - Sử dụng để cài đặt các package cần thiết cho việc chạy ứng dụng
#   - Chỉ copy mã nguồn đã được biên dịch từ stage 1 vào image này
# - Giúp giảm kích thước image cuối cùng bằng cách loại bỏ các package không cần thiết
# - Tăng tốc độ build image bằng cách chỉ cần build lại stage 1 khi có thay đổi trong mã nguồn
# - Giúp tách biệt quá trình build và chạy ứng dụng, giúp dễ dàng quản lý và bảo trì
# - Giúp tăng tính bảo mật bằng cách chỉ chạy các package cần thiết trong môi trường production

FROM node:23-alpine3.20 as builder
WORKDIR /app
COPY .npmrc ./
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm install -g npm@latest
RUN npm ci && npm run build

FROM node:23-alpine3.20
RUN apk add --no-cache curl
WORKDIR /app
COPY .npmrc ./
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install -g pm2 npm@latest
RUN npm ci --production
COPY --from=builder /app/build ./build

EXPOSE 4007

CMD ["npm", "run", "start"]



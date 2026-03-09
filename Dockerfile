FROM rust:1.94 AS wasm-build

# Install wasm-pack
RUN cargo install wasm-pack

WORKDIR /rust-pkg
COPY rust-pkg/ .

RUN wasm-pack build --target web --out-dir pkg


FROM node:23-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Copy the wasm artifacts from the wasm-build stage
COPY --from=wasm-build /rust-pkg/pkg ./rust-pkg/pkg

RUN npm run build


FROM nginx:1.27.4-alpine-slim
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
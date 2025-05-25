# Multi-stage build
# Stage 1: Build the application
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve the application
FROM nginx:1.23.1-alpine
EXPOSE 80
RUN mkdir -p /var/www/html/xcellify-partner/build/
COPY --from=build /app/dist /var/www/html/xcellify-partner/build/
COPY ./default.conf /etc/nginx/conf.d/default.conf

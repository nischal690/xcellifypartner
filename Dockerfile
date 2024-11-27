FROM nginx:1.23.1-alpine
EXPOSE 80
RUN mkdir -p /var/www/html/xcellify-partner/build/
ADD dist /var/www/html/xcellify-partner/build/
COPY ./default.conf /etc/nginx/conf.d/default.conf

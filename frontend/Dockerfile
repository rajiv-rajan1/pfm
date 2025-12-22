FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

WORKDIR /usr/share/nginx/html

COPY . .
COPY nginx.conf /etc/nginx/templates/default.conf.template

# entrypoint.sh to run envsubst
COPY entrypoint.sh /docker-entrypoint.d/40-envsubst.sh
RUN chmod +x /docker-entrypoint.d/40-envsubst.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

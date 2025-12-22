#!/bin/sh
# This script injects environment variables into the Nginx config
# It usually runs automatically in /docker-entrypoint.d/ for nginx image, 
# but we are explicitly placing it there.

envsubst '${BACKEND_API_URL} ${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

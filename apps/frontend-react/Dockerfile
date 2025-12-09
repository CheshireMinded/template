FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
# Create non-root user for nginx
RUN addgroup -g 1001 -S app && \
    adduser -S app -u 1001 -G app

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Change ownership to non-root user
RUN chown -R app:app /usr/share/nginx/html && \
    chown -R app:app /var/cache/nginx && \
    chown -R app:app /var/log/nginx && \
    chown -R app:app /etc/nginx/conf.d

# Use non-root user
USER app

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


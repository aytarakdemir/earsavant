# Stage 1: Build the Angular app
FROM node:18 as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm ci
COPY ./ /app/
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist/comms /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
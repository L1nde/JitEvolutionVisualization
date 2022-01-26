FROM node:12 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN rm .env
RUN touch .env
RUN echo "VUE_APP_JIT_EVOLUTION_API_URI=$VUE_APP_JIT_EVOLUTION_API_URI" >> .env
RUN echo "VUE_APP_JIT_EVOLUTION_WEBSOCKET_URI=$VUE_APP_JIT_EVOLUTION_WEBSOCKET_URI" >> .env
RUN npm run build

FROM arm64v8/nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
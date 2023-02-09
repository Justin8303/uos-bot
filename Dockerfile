FROM node:16-alpine
LABEL "org.opencontainers.image.source"="https://git.lynao.de/justin.wit/uos-bot"

RUN apk add --no-cache tzdata
ENV TZ "Europe/Berlin"

WORKDIR /app

ENV NODE_ENV production

RUN adduser --system --uid 1001 user

RUN cp -r /app-build/dist/. ./ \
   && cp -r /app-build/node_modules/. ./node_modules \
   && cp /app-build/package.json ./package.json

RUN ls -la

RUN chown -R 1001:0 /app \
   && chmod -R g+=wrx /app

RUN ls -ltra /app

USER user

CMD ["node", "src/index.js"]
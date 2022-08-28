## Stage 1 
# This gets our prod dependencies installed and out of the way
FROM node:14-alpine as base
RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++ \
        git

EXPOSE 3000

ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

# we use npm ci here so only the package-lock.json file is used
RUN yarn install --production
    

## Stage 2 (development)
# we don't COPY in this stage because for dev you'll bind-mount anyway
# this saves time when building locally for dev via docker-compose
FROM base as dev

ENV NODE_ENV=development


WORKDIR /app

RUN yarn install


CMD ["npm", "run", "start:debug"]


## Stage 3 (builder)
# This builds ts to js
FROM dev as builder
ENV NODE_ENV=production

COPY . /app

WORKDIR /app

RUN npm run build
## Stage 4 (copy build for prod)
# This gets our source code into builder
FROM base as prod

WORKDIR /app

ENV NODE_ENV=production

RUN apk del .gyp

COPY --from=builder /app/dist/ /app/dist/

EXPOSE 3000

# Add Tini
RUN apk add --no-cache tini curl
ENTRYPOINT ["/sbin/tini", "--"]

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

USER nestjs
ENV PATH=/app/node_modules/.bin:$PATH

CMD ["node", "dist/src/main"]
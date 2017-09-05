FROM node:6.11.2-alpine

RUN apk --update add bash curl tar gnupg zip
COPY tini-static /sbin/tini-static
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

RUN mkdir -p /controller
WORKDIR /controller/
COPY . /controller/

RUN yarn install

ENTRYPOINT ["/sbin/tini-static", "--"]

EXPOSE 8080

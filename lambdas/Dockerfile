FROM node:6.11.2-alpine

RUN apk --update add bash curl tar gnupg zip
COPY tini-static /sbin/tini-static
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

RUN mkdir -p /lambdas
WORKDIR /lambdas/
COPY . /lambdas/

ENTRYPOINT ["/sbin/tini-static", "--"]
CMD ["yarn", "run", "build"]

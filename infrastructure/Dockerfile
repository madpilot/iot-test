FROM frolvlad/alpine-glibc:latest
# Need glibc for the iamy binary

COPY tini-static /sbin/tini-static
ENTRYPOINT ["/sbin/tini-static", "--"]

RUN apk --update add bash coreutils nodejs nodejs-npm ruby-bundler \
                     curl make \
                     ruby-dev build-base \
                     py-pip git \
                     ca-certificates \
                     openssl \
                     openssh-client \
                     jq

RUN pip install awscli
COPY docker_bin/iamy-linux-amd64 /usr/bin/iamy

RUN mkdir /tools/
WORKDIR /tools/
COPY . /tools/

RUN mkdir /certificates/
RUN mkdir /lambdas/

RUN npm install -g cirrus
RUN bundle install --clean --system

CMD ["/bin/bash"]

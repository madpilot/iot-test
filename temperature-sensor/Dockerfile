FROM elixir:1.4.1
RUN apt-get update && apt-get install -y apt-transport-https

RUN mix local.hex --force && \
    mix local.rebar --force

RUN mkdir -p /app/deps
WORKDIR /app/
COPY . /app/

RUN mkdir /certificates/

COPY tini-static /sbin/tini-static
ENTRYPOINT ["/sbin/tini-static", "--"]
CMD ["mix", "run", "--no-halt"]

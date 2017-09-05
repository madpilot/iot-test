# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
use Mix.Config

config :logger,
  backends: [:console]

config :temperature_sensor,
  sensor: [:api_key, "11ccfc393ce4f97eaef3974f519ca2f2", :city, "Melbourne,au"],
  period: 60 * 1000

config :temperature_sensor,
  mqtt: [client_id: "tempsensor01",
    host: System.get_env("IOT_ENDPOINT"),
    port: 8883,
    timeout: 5000,
    ssl: [cacertfile: "/certificates/root-CA.cert.pem", certfile: "/certificates/#{System.get_env("STACKNAME")}-TempSensor01.cert.pem", keyfile: "/certificates/#{System.get_env("STACKNAME")}-TempSensor01.key.pem"]]

config :temperature_sensor,
  publish_topic: "$aws/things/#{System.get_env("STACKNAME")}-TempSensor01/shadow/update"

defmodule TemperatureSensor do
  use Application

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec

    children = [
      worker(MQTT.Client, [
        [
          client_id: "tempsensor01",
          host: "a1sjiazdf7qxjd.iot.ap-southeast-2.amazonaws.com",
          port: 8883,
          timeout: 5000,
          ssl: [cacertfile: "/certificates/root-CA.cert.pem", certfile: "/certificates/iot-TempSensor01.cert.pem", keyfile: "/certificates/iot-TempSensor01.key.pem"]]
      ])
    ]

    opts = [strategy: :one_for_one, name: TemperatureSensor.Supervisor]
    Supervisor.start_link(children, opts)
  end
end


#MQTT.Client.publish("$aws/things/iot-TempSensor01/shadow/update", %{reported: %{temperature: 17, battery: 34}})

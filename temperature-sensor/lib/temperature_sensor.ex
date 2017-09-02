defmodule TemperatureSensor do
  use Application

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec

    {:ok, mqtt_config} = Application.fetch_env(:temperature_sensor, :mqtt)
    {:ok, period} = Application.fetch_env(:temperature_sensor, :period)

    children = [
      worker(MQTT.Client, [mqtt_config]),
      worker(Battery.Discharge, []),
      worker(TemperatureSensor.Scheduler, [period]) # Take a reading once a minute
    ]

    opts = [strategy: :one_for_one, name: TemperatureSensor.Supervisor]
    Supervisor.start_link(children, opts)
  end
end

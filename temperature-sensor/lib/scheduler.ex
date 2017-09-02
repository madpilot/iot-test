defmodule TemperatureSensor.Scheduler do
  require Logger
  use GenServer

  def start_link(period) do
    GenServer.start_link(__MODULE__, %{period: period, temperature: nil, battery: nil})
  end

  def init(state) do
    {:ok, work(state)}
  end

  defp work(state) do
    Logger.info("Waking up")
    temperature = Sensor.read()
    {:ok, battery} = Battery.read()

    if temperature != state[:temperature] || battery != state[:battery] do
      Logger.info("Publishing update: temperature #{temperature}, battery: #{battery}")
      MQTT.Client.publish("$aws/things/iot-TempSensor01/shadow/update", %{state: %{reported: %{temperature: temperature, battery: battery}}})
    else
      Logger.info("No change. No update required")
    end

    schedule_work(state[:period])

    state
    |> Map.merge(%{temperature: temperature, battery: battery})
  end

  def handle_info(:work, state) do
    {:noreply, work(state)}
  end

  defp schedule_work(sleep_for) do
    Logger.info("Sleeping for #{sleep_for}ms...")
    Process.send_after(self(), :work, sleep_for)
  end
end

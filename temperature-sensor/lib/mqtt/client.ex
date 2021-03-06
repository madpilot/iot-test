defmodule MQTT.Client do
  use GenServer

  def start_link(options) do
    GenServer.start_link(__MODULE__, options, [name: __MODULE__])
  end

  def init(options) do
    {:ok, %{options: options}}
  end

  def publish(topic, message) do
    GenServer.call(__MODULE__, {:publish, topic, message})
  end

  def handle_call({:publish, topic, message}, _from, state) do
    {:ok, pid} = MQTT.Interface.start_link(%{})

    :ok = MQTT.Interface.connect(pid, state[:options])
    :ok = MQTT.Interface.publish(pid, [topic: topic, message: message |> Poison.encode!, dup: 0, qos: 0, retain: 1])
    :ok = MQTT.Interface.disconnect(pid)

    {:reply, {:ok}, state}
  end
end

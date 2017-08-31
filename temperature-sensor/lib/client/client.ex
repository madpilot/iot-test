defmodule TemperatureSensor do
  use Hulaaki.Client

  def on_connect_ack(options) do
    IO.inspect options
  end
end

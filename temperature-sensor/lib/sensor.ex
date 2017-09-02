defmodule Sensor do
  require Logger

  def read do
    Logger.info("Reading the temperature...")
    HTTPoison.start

    response = case HTTPoison.get! "https://api.openweathermap.org/data/2.5/weather?q=Melbourne,au&appid=11ccfc393ce4f97eaef3974f519ca2f2" do
      %HTTPoison.Response{status_code: 200, body: body} -> body |> Poison.decode!
    end

    response["main"]["temp"] - 273.15
    |> Float.round(2)
  end
end

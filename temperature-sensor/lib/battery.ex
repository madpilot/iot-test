defmodule Battery do
  require Logger

  def read do
    Logger.info("Reading the battery...")
    Battery.Discharge.get
  end
end

defmodule Battery.Discharge do
  use GenServer

  def start_link() do
    GenServer.start_link(__MODULE__, %{}, [name: __MODULE__])
  end

  def init(state) do
    schedule_work()
    {:ok, %{charge: 100}}
  end

  def get() do
    GenServer.call(__MODULE__, {:get})
  end

  def handle_info(:work, state) do
    schedule_work()

    charge = case state[:charge] do
      0       -> 0
      current -> current - 1
    end
    {:noreply, state |> Map.merge(%{charge: charge})}
  end

  def handle_call({:get}, _from, state) do
    {:reply, {:ok, state[:charge]}, state}
  end

  defp schedule_work do
    Process.send_after(self(), :work, 5 * 60 * 1000)
  end
end

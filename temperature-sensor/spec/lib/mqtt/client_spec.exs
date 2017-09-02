defmodule MQTT.ClientSpec do
  use ESpec, async: false

  describe "MQTT.ClientSpec" do
    let :pid, do: IEx.Helpers.pid(0, 250, 0)
    let :options, do: %{}
    let :topic, do: "$aws/things/iot-TempSensor01/shadow/update"
    let :message, do: %{reported: %{temperature: 17, battery: 34}}

    describe "publish" do
      before do: allow MQTT.Interface |> to(accept :start_link, fn(_) -> {:ok, pid()} end)
      before do: allow MQTT.Interface |> to(accept :connect, fn(_, _) -> {:ok} end)
      before do: allow MQTT.Interface |> to(accept :publish, fn(_, _) -> {:ok} end)
      before do: allow MQTT.Interface |> to(accept :disconnect, fn(_) -> {:ok} end)

      subject do: MQTT.Client.publish(topic(), message())

      context "successful connect" do
        before do: allow MQTT.Interface |> to(accept :connect, fn(_, _) -> {:ok} end)

        it "returns ok" do
          expect(subject()) |> to(eq {:ok})
        end

        it "connects to MQTT.Interface using the supplied options" do
          expect(MQTT.Interface) |> to(accepted :connect, [pid(), options()])
        end

        context "successful publish" do
          before do: allow MQTT.Interface |> to(accept :publish, fn(_, _) -> {:ok} end)

          it "returns ok" do
            expect(subject()) |> to(eq {:ok})
          end
        end
      end
    end
  end
end

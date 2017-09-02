defmodule App.Mixfile do
  use Mix.Project

  def project do
    [app: :temperature_sensor,
     version: "0.0.1",
     elixir: "~> 1.4",
     compilers: Mix.compilers,
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     preferred_cli_env: [espec: :test],
     deps: deps()]
  end

  # Configuration for the OTP application
  #
  # Type "mix help compile.app" for more information
  def application do
    [mod: {TemperatureSensor, []},
    applications: [:logger, :httpoison],
    preferred_cli_env: [espec: :test]]
  end

  # Dependencies can be Hex packages:
  #
  #   {:my_dep, "~> 0.3.0"}
  #
  # Or git/path repositories:
  #
  #   {:my_dep, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"}
  #
  # Type "mix help deps" for more examples and options
  defp deps do
    [
      {:apex, "~>1.0.0", only: [:dev,:test]},
      {:espec, "~> 1.4.5", only: :test},
      {:hulaaki, "~> 0.1.0"},
      {:httpoison, "~> 0.13"},
      {:poison, "~> 3.1"}
    ]
  end
end

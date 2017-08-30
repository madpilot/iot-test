if [[ ! -o interactive ]]; then
    return
fi

compctl -K _infrastructure infrastructure

_infrastructure() {
  local word words completions
  read -cA words
  word="${words[2]}"

  if [ "${#words}" -eq 2 ]; then
    completions="$(infrastructure commands)"
  else
    completions="$(infrastructure completions "${word}")"
  fi

  reply=("${(ps:\n:)completions}")
}

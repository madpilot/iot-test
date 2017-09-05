if [[ ! -o interactive ]]; then
    return
fi

compctl -K _lambdas lambdas

_lambdas() {
  local word words completions
  read -cA words
  word="${words[2]}"

  if [ "${#words}" -eq 2 ]; then
    completions="$(lambdas commands)"
  else
    completions="$(lambdas completions "${word}")"
  fi

  reply=("${(ps:\n:)completions}")
}

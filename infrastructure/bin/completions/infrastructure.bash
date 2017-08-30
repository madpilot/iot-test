_infrastructure() {
  COMPREPLY=()
  local word="${COMP_WORDS[COMP_CWORD]}"

  if [ "$COMP_CWORD" -eq 1 ]; then
    COMPREPLY=( $(compgen -W "$(infrastructure commands)" -- "$word") )
  else
    local command="${COMP_WORDS[1]}"
    local completions="$(infrastructure completions "$command")"
    COMPREPLY=( $(compgen -W "$completions" -- "$word") )
  fi
}

complete -F _infrastructure infrastructure

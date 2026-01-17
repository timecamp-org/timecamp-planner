#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${NTFY_BASE_URL:-http://localhost:8080}"
TOPIC_PREFIX="${NTFY_TOPIC_PREFIX:-heyspace-}"

command="${1:-}"

usage() {
  cat <<'EOF'
Usage:
  bin/ntfy-test.sh publish <topic> <title> <body>
  bin/ntfy-test.sh subscribe <topic>

Environment:
  NTFY_BASE_URL     default: http://localhost:8080
  NTFY_TOPIC_PREFIX default: heyspace-

Examples:
  bin/ntfy-test.sh publish demo "Hello" "Test notification"
  bin/ntfy-test.sh subscribe demo
EOF
}

ensure_topic() {
  local topic="$1"
  if [[ -z "${topic}" ]]; then
    echo "Missing topic" >&2
    exit 1
  fi
  if [[ "${TOPIC_PREFIX}" != "" && "${topic}" != "${TOPIC_PREFIX}"* ]]; then
    echo "${TOPIC_PREFIX}${topic}"
  else
    echo "${topic}"
  fi
}

case "${command}" in
  publish)
    topic="$(ensure_topic "${2:-}")"
    title="${3:-}"
    body="${4:-}"
    if [[ -z "${title}" || -z "${body}" ]]; then
      usage
      exit 1
    fi
    payload="$(cat <<EOF
{"title":"${title}","body":"${body}","notificationType":"0","containerId":"demo","actorId":"demo","organizationId":"demo","data":{}}
EOF
)"
    curl -sS -X POST \
      -H "Title: ${title}" \
      -H "Content-Type: application/json" \
      --data "${payload}" \
      "${BASE_URL}/${topic}" >/dev/null
    echo "Published to ${BASE_URL}/${topic}"
    ;;
  subscribe)
    topic="$(ensure_topic "${2:-}")"
    curl -N "${BASE_URL}/${topic}/sse"
    ;;
  *)
    usage
    exit 1
    ;;
esac

#!/usr/bin/env bash
#
# Verify the cutover bulk-redirect map (#244).
# Reads docs/cloudflare-bulk-redirects-cutover.csv and checks that each
# source_url returns the expected HTTP status and redirects to target_url.
#
# Usage:
#   bash scripts/test-cutover-redirects.sh
#
# Exit code is non-zero if any redirect does not match, so this can gate a
# post-cutover verification step.

set -u

CSV="$(dirname "$0")/../docs/cloudflare-bulk-redirects-cutover.csv"
CURL_MAX_TIME=15

if [ ! -f "$CSV" ]; then
  echo "ERROR: redirect CSV not found at $CSV" >&2
  exit 2
fi

fail=0
checked=0

# Process substitution (not `tail | while`) so fail/checked update in THIS shell.
while IFS=',' read -r source target status _rest; do
  [ -z "${source:-}" ] && continue
  checked=$((checked + 1))

  # Follow no redirects; capture status code and Location header. Time-bounded
  # so a misbehaving edge during cutover can't hang the script.
  code=$(curl -s -m "$CURL_MAX_TIME" -o /dev/null -w '%{http_code}' "$source")
  location=$(curl -s -m "$CURL_MAX_TIME" -o /dev/null -D - "$source" \
    | awk 'tolower($1)=="location:"{print $2}' | tr -d '\r')

  if [ "$code" = "$status" ] && [ "$location" = "$target" ]; then
    echo "OK   $source -> $location ($code)"
  else
    echo "FAIL $source -> got [$code -> ${location:-<none>}], expected [$status -> $target]" >&2
    fail=1
  fi
done < <(tail -n +2 "$CSV")

if [ "$checked" -eq 0 ]; then
  echo "ERROR: no redirect rows found in $CSV" >&2
  exit 2
fi

if [ "$fail" -ne 0 ]; then
  echo "One or more redirects did not match the expected map ($checked checked)." >&2
  exit 1
fi

echo "All $checked redirects verified."

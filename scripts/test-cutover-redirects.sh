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

if [ ! -f "$CSV" ]; then
  echo "ERROR: redirect CSV not found at $CSV" >&2
  exit 2
fi

fail=0
checked=0

# Skip the header row; read source,target,status as the first three columns.
tail -n +2 "$CSV" | while IFS=',' read -r source target status _rest; do
  [ -z "${source:-}" ] && continue
  checked=$((checked + 1))

  # Follow no redirects; capture the status code and Location header.
  code=$(curl -s -o /dev/null -w '%{http_code}' "$source")
  location=$(curl -s -o /dev/null -D - "$source" | awk 'tolower($1)=="location:"{print $2}' | tr -d '\r')

  if [ "$code" = "$status" ] && [ "$location" = "$target" ]; then
    echo "OK   $source -> $location ($code)"
  else
    echo "FAIL $source -> got [$code -> ${location:-<none>}], expected [$status -> $target]" >&2
    fail=1
  fi
done

if [ "$fail" -ne 0 ]; then
  echo "One or more redirects did not match the expected map." >&2
  exit 1
fi

echo "All redirects verified."

#!/usr/bin/env bash

set -Eeuo pipefail

REPO="/home/ameermresat/exam-management-system"
TF_DIR="$REPO/terraform/gcp-gke"

if [ "$#" -eq 0 ]; then
  echo "Usage: ./scripts/terraform-gcp.sh <terraform-command> [arguments]"
  echo "Example: ./scripts/terraform-gcp.sh plan"
  exit 1
fi

cd "$REPO"

unset GOOGLE_APPLICATION_CREDENTIALS || true
export GOOGLE_OAUTH_ACCESS_TOKEN="$(gcloud auth print-access-token)"

if [ -z "$GOOGLE_OAUTH_ACCESS_TOKEN" ]; then
  echo "Google Cloud authentication failed."
  exit 1
fi

terraform -chdir="$TF_DIR" init \
  -reconfigure \
  -backend-config="access_token=$GOOGLE_OAUTH_ACCESS_TOKEN" \
  >/dev/null

terraform -chdir="$TF_DIR" "$@"

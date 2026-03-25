#!/usr/bin/env bash
# Run on the VPS (from deploy.yml via ssh). Env: BACK_ROOT, BRANCH, CLONE_URL.
set -euo pipefail

: "${BACK_ROOT:?BACK_ROOT is required (e.g. /home/deploy/pgp-main-web/backend)}"
: "${BRANCH:?BRANCH is required (e.g. main)}"
: "${CLONE_URL:?CLONE_URL is required}"

REPO_ROOT="$(dirname "$BACK_ROOT")"
PARENT="$(dirname "$REPO_ROOT")"

if ! command -v git >/dev/null 2>&1; then
  sudo DEBIAN_FRONTEND=noninteractive apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq git
fi

mkdir -p "$PARENT"
git config --global --add safe.directory "$REPO_ROOT" 2>/dev/null || true

if [ -d "$REPO_ROOT/.git" ]; then
  cd "$REPO_ROOT"
  if git remote get-url origin >/dev/null 2>&1; then
    git remote set-url origin "$CLONE_URL"
  else
    git remote add origin "$CLONE_URL"
  fi
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git pull --ff-only origin "$BRANCH"
elif [ ! -d "$REPO_ROOT" ]; then
  git clone --branch "$BRANCH" --depth 1 "$CLONE_URL" "$REPO_ROOT"
else
  echo "ERROR: $REPO_ROOT exists but is not a git repository." >&2
  echo "If this was a partial folder (e.g. only backend/media), back up media, then remove the directory and re-run deploy." >&2
  exit 1
fi

mkdir -p "${BACK_ROOT}/media"

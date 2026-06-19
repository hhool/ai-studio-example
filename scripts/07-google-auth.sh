#!/usr/bin/env bash
# Helper script: guidance for creating Google OAuth credentials and preparing local env
set -e

echo "This helper will create a local .env.local from .env.local.example (if missing)"
if [ -f .env.local ]; then
  echo ".env.local already exists — please edit it manually to add GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET"
  exit 0
fi

if [ -f .env.local.example ]; then
  cp .env.local.example .env.local
  echo "Created .env.local from .env.local.example. Please fill in GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET."
  echo "Recommended redirect URIs for Google OAuth (add to Google Cloud Console):"
  echo "  http://localhost:5173/_auth/google/callback"
  echo "  http://localhost:3000/_auth/google/callback"
  echo "  https://your-deployed-domain.com/_auth/google/callback"
else
  echo "Missing .env.local.example — please create one with GOOGLE_OAUTH_CLIENT_ID and SECRET placeholders."
  exit 1
fi

echo
echo "Manual Google Cloud Console steps (summary):"
echo "1) OAuth consent screen: configure app name, scopes, and test users (if internal)."
echo "2) Credentials -> Create OAuth 2.0 Client ID -> Web application."
echo "   Add redirect URIs (see above)."
echo "3) Copy Client ID and Client Secret into .env.local."
echo
echo "Note: This project uses Firebase Authentication for Google SSO in the frontend."
echo "If you're configuring a separate WordPress Nextend Social Login, set the same redirect URI in the Google OAuth client and paste credentials into WP plugin settings."

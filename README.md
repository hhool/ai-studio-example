<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/27c530d6-bbc0-421c-9c99-92d08d510671

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Enable Google Sign-In (Firebase)

1. Open the Firebase Console for the project specified in `firebase-applet-config.json` (field `projectId`).
2. In **Authentication > Sign-in method**, enable **Google** as a Sign-in provider.
3. In **Authentication > Settings**, add your local dev domains to **Authorized domains** (example):
   - `localhost`
   - `localhost:3000`
   - `localhost:3001`
   - `localhost:3002`
   - your deployed domain (e.g. `sunlit-walker-dbndl.firebaseapp.com`)
4. If using Firebase OAuth in an iframe (preview mode), popup sign-in may be blocked. Use **Open in New Tab** to sign in, or sign in from a top-level window.
5. The project Firebase config is already present in `firebase-applet-config.json` — ensure values match the Firebase Console.

Troubleshooting:
- If you see `auth/unauthorized-domain`, add the current host to the Authorized domains list.
- If popups are blocked by iframe sandboxing, open the app in a new tab to complete the Google login flow.

Create Google OAuth credentials (for Nextend / external OAuth)
-----------------------------------------------------------

If you need standalone Google OAuth credentials (e.g., for WordPress Nextend Social Login), follow these steps:

1. Open Google Cloud Console -> APIs & Services -> OAuth consent screen. Configure the app name, support email, and test users (if internal scope).
2. Go to Credentials -> Create Credentials -> OAuth client ID -> select "Web application".
3. Add Redirect URIs (exact values). Recommended examples for local dev:
   - `http://localhost:5173/_auth/google/callback`
   - `http://localhost:3000/_auth/google/callback`
   - `https://your-deployed-domain.com/_auth/google/callback`
4. Create the client and copy the Client ID and Client Secret.
5. Run `bash scripts/07-google-auth.sh` to scaffold a local `.env.local` and paste the values into it, or paste the values into your WordPress Nextend plugin settings.

Notes:
- This project primarily uses Firebase Authentication for Google SSO (frontend). The `GOOGLE_OAUTH_CLIENT_ID`/`SECRET` are needed only for external integrations (e.g., Nextend/WordPress) or if you prefer server-side OAuth.
- For Firebase-based login, ensure Google is enabled in Firebase Console → Authentication → Sign-in method and Authorized domains include your dev host.


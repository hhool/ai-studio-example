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

## Optional Content Source

The app keeps the current Firestore / local-data flow by default.

To switch the main product and evaluation load path to the scraped content bundle:

1. Set `VITE_CONTENT_SOURCE=scraped` in [.env.local](.env.local)
2. Set `SCRAPE_KIDSMOBILE_API_BASE_URL` to the upstream kidsmobi worker base URL, such as `https://kidsmobi-api-v1.seaman-player.workers.dev`
3. Restart the app so the server can aggregate the worker's `/api/v1/*` endpoints into `/api/content/bundle`

If the bundle request fails or returns incomplete data, the app falls back to the existing CMS / local-data path.

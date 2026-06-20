# Deploy the WC26 Dossier (live, installable)

The app is **4 static files** — `index.html`, `manifest.webmanifest`, `sw.js`, `icon.svg`.
No server, no build, no API key. It fetches real games from ESPN in the browser and
falls back to saved data if it can't reach ESPN. Host the folder anywhere static.

When it's live, the top banner shows **● Live · N finished** (real data) or **Snapshot**
(fallback). Then "Add to Home Screen" to install it like an app.

---

## A. From your PHONE (no computer needed)

Uses GitHub + GitHub Pages, all in your phone browser.

1. **Get the 4 files onto your phone.** Save `index.html`, `manifest.webmanifest`,
   `sw.js`, `icon.svg` to your Files app (download them from this chat).
2. **Make a GitHub account** (if needed): open `github.com` in your browser → Sign up (free).
3. **Create a repo:** tap **+** (top right) → **New repository** → name it e.g. `wc26` →
   **Public** → **Create repository**.
4. **Upload the files:** on the new repo page tap **Add file → Upload files** →
   **choose your files** → select all 4 from Files → **Commit changes**.
5. **Turn on Pages:** tap **Settings** (you may need "Request desktop site" to see it) →
   **Pages** (left menu) → under *Branch* pick **main** + **/(root)** → **Save**.
6. **Wait ~1 minute**, refresh that Pages screen. It shows a link like
   `https://YOURNAME.github.io/wc26/` — that's your live app.
7. **Install it:** open that link.
   - **iPhone (Safari):** Share button → **Add to Home Screen**.
   - **Android (Chrome):** menu **⋮** → **Install app** / **Add to Home screen**.

Done — tap the new icon and it opens full-screen, pulling real games each time.

> Tip: to update later, repeat step 4 (Upload files → overwrite) — Pages redeploys itself.

---

## B. From a COMPUTER (a couple of minutes, easiest)

**Fastest — Netlify Drop (no account, no Git):**
1. Put the 4 files in one folder.
2. Go to **app.netlify.com/drop**.
3. **Drag the folder** onto the page.
4. It deploys instantly and gives you a live `https://….netlify.app` URL. (Make a free
   account to keep the URL and rename it.)
5. Open the URL on your phone → Add to Home Screen (as in A7).

**Or GitHub Pages (same as phone, faster on a keyboard):** create a repo, drag the 4
files into **Add file → Upload files**, commit, then **Settings → Pages → main /(root)**.

---

## If the banner says "Snapshot" instead of "Live"

That means the browser couldn't load ESPN directly (a cross-origin/CORS block). The app
still works on saved data. To guarantee live data, deploy the included **`wc26-backend`**
as a tiny proxy (Vercel/Render free tier) and point the app's `ESPN_URL` at it — the
backend's README has the steps. Most browsers load ESPN fine, so try the static deploy first.

## Notes

- Must be served over **https** for install + live data — GitHub Pages and Netlify both are.
- The model predictions are computed in your browser from real ESPN shot data (a shot-based
  xG proxy). Odds/market data still need a key via the backend; everything else is free.

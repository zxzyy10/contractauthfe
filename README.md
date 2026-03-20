# Contract Permissions Dashboard

Static dashboard for Base mainnet contract permissions, upgrade control, execution notes, and live onchain verification.

## Files

- `index.html`: main dashboard entry
- `styles.css`: page styling
- `data.js`: structured inventory data
- `app.js`: rendering, filters, and live RPC reads
- `docs/index.html`: deploy-friendly ops document
- `docs/contract-permissions-execution-guide.md`: markdown source notes

## Local preview

Open `index.html` directly, or run a small local server:

```powershell
cd D:\contractdashboard
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Vercel

- Framework preset: `Other`
- Root directory: `contractdashboard`
- Build command: leave empty
- Output directory: leave empty

The site is configured as a static app with `vercel.json`.

# Operational scripts

Ad-hoc admin scripts for the Firestore database (run manually, not part of the
app build).

## Retained setup — do not delete

- **`serviceAccount.json`** — Firebase Admin service-account key. Required for
  scripts that write to collections protected by security rules (e.g.
  `locations`). Gitignored; never commit it.
- **`firebase-admin`** (devDependency) — the Admin SDK used by these scripts. It
  has no app-code consumer, so it is listed in `knip.json`
  `ignoreDependencies`.

The image-path migration that reorganised `public/assets/map/**` and rewrote the
`locations.image` field has already been applied and its one-off script removed.

## Writing a new admin script

```js
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const serviceAccount = JSON.parse(readFileSync(resolve(__dirname, 'serviceAccount.json'), 'utf8'))

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()
// ... read/write here. Prefer a dry-run default; gate writes behind `--apply`.
```

Run with `node scripts/<name>.mjs`.

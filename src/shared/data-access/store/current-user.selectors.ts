// Shared accessors for the authenticated user, so domains never reach into the
// `auth` domain directly (the architecture forbids cross-domain imports). The
// user identity is cross-domain state — every authed feature needs the uid.

import type { RootState } from '@/core/store/store'

export const selectUid = (state: RootState): string | null => state.auth.user?.uid ?? null

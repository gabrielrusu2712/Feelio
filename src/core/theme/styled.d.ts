import 'styled-components'
import type { AppTheme } from '@/core/theme/types'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}

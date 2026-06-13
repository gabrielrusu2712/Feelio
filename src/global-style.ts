import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  ${({ theme }) => `
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: ${theme.colors.layouts.default.enabled.surface.primary.cssVar};
      color: ${theme.colors.layouts.default.enabled.onSurface.primary.cssVar};
    }
  `}
`

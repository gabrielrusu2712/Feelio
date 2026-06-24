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

  @keyframes confetti-fall {
    to {
      transform: translateY(110vh) rotate(360deg);
    }
  }

  /* Leaflet popup overrides — keeps map popup styled without raw hex */
  .feelio-map-popup .leaflet-popup-content-wrapper {
    background: #FFF0BE !important;
    border-radius: 25px !important;
    padding: 0;
    overflow: visible !important;
    border: none;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
  }
  .feelio-map-popup .leaflet-popup-content {
    margin: 0;
    width: 240px !important;
  }
  .feelio-map-popup .leaflet-popup-tip-container {
    display: none;
  }
  .map-popup-card {
    display: flex;
    flex-direction: column;
  }
  .popup-img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
  }
  .popup-info {
    padding: 15px;
    text-align: center;
  }
  .popup-info h3 {
    margin: 0 0 5px 0;
    color: #C44A3A;
    font-size: 1.1rem;
    font-weight: 800;
  }
  .popup-info p {
    font-size: 0.8rem;
    color: #C44A3A;
    margin-bottom: 12px;
  }
  .popup-checkin-btn {
    background: #FFB38E;
    color: #C44A3A;
    border: 3px solid #C44A3A;
    padding: 10px;
    border-radius: 20px;
    font-weight: 700;
    cursor: pointer;
    width: 100%;
    font-size: 0.9rem;
    transition: opacity 0.2s;
  }
  .popup-checkin-btn:hover {
    opacity: 0.85;
  }
`

export interface TutorialSlide {
  key: string
  titleKey: string
  descriptionKey: string
  image: {
    src: string
    altKey: string
    /** 'hero' = the character portrait; 'screenshot' = a bordered app preview. */
    variant: 'hero' | 'screenshot'
  }
}

const SCREENSHOTS_PATH = '/assets/onboarding'

// Mirrors Feelio‑Judeteana's tutorial.html slide order (intro → home → wellbeing
// → map → album → stats → journal → chat → game → start).
export const TUTORIAL_SLIDES: TutorialSlide[] = [
  {
    key: 'intro',
    titleKey: 'onboarding.slide.intro.title',
    descriptionKey: 'onboarding.slide.intro.description',
    image: {
      src: '/assets/character/neutral.png',
      altKey: 'onboarding.slide.intro.imageAlt',
      variant: 'hero',
    },
  },
  {
    key: 'home',
    titleKey: 'onboarding.slide.home.title',
    descriptionKey: 'onboarding.slide.home.description',
    image: {
      src: `${SCREENSHOTS_PATH}/home.jpg`,
      altKey: 'onboarding.slide.home.imageAlt',
      variant: 'screenshot',
    },
  },
  {
    key: 'wellbeing',
    titleKey: 'onboarding.slide.wellbeing.title',
    descriptionKey: 'onboarding.slide.wellbeing.description',
    image: {
      src: `${SCREENSHOTS_PATH}/wellbeing.jpg`,
      altKey: 'onboarding.slide.wellbeing.imageAlt',
      variant: 'screenshot',
    },
  },
  {
    key: 'map',
    titleKey: 'onboarding.slide.map.title',
    descriptionKey: 'onboarding.slide.map.description',
    image: {
      src: `${SCREENSHOTS_PATH}/map.jpg`,
      altKey: 'onboarding.slide.map.imageAlt',
      variant: 'screenshot',
    },
  },
  {
    key: 'album',
    titleKey: 'onboarding.slide.album.title',
    descriptionKey: 'onboarding.slide.album.description',
    image: {
      src: `${SCREENSHOTS_PATH}/album.jpg`,
      altKey: 'onboarding.slide.album.imageAlt',
      variant: 'screenshot',
    },
  },
  {
    key: 'stats',
    titleKey: 'onboarding.slide.stats.title',
    descriptionKey: 'onboarding.slide.stats.description',
    image: {
      src: `${SCREENSHOTS_PATH}/stats.jpg`,
      altKey: 'onboarding.slide.stats.imageAlt',
      variant: 'screenshot',
    },
  },
  {
    key: 'journal',
    titleKey: 'onboarding.slide.journal.title',
    descriptionKey: 'onboarding.slide.journal.description',
    image: {
      src: `${SCREENSHOTS_PATH}/journal.jpg`,
      altKey: 'onboarding.slide.journal.imageAlt',
      variant: 'screenshot',
    },
  },
  {
    key: 'chat',
    titleKey: 'onboarding.slide.chat.title',
    descriptionKey: 'onboarding.slide.chat.description',
    image: {
      src: `${SCREENSHOTS_PATH}/chat.jpg`,
      altKey: 'onboarding.slide.chat.imageAlt',
      variant: 'screenshot',
    },
  },
  {
    key: 'game',
    titleKey: 'onboarding.slide.game.title',
    descriptionKey: 'onboarding.slide.game.description',
    image: {
      src: `${SCREENSHOTS_PATH}/game.jpg`,
      altKey: 'onboarding.slide.game.imageAlt',
      variant: 'screenshot',
    },
  },
  {
    key: 'start',
    titleKey: 'onboarding.slide.start.title',
    descriptionKey: 'onboarding.slide.start.description',
    image: {
      src: '/assets/character/happy.png',
      altKey: 'onboarding.slide.start.imageAlt',
      variant: 'hero',
    },
  },
]

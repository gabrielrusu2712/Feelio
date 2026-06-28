import { useState } from 'react'
import { Sprite, Video } from '@/shared/ui/character-sprite/character-sprite.styled'

interface CharacterSpriteProps {
  /** Transparent looping webm; null on iOS/Safari or when none exists. */
  videoSrc: string | null
  /** Static pose shown when there is no playable video. */
  imageSrc: string
  label: string
  onActivate: () => void
}

// Dumb: renders the bear as a looping video when one is supplied and playable,
// otherwise a static image. The parent remounts this via `key` on source change,
// so the local video-failed fallback resets cleanly between poses.
const CharacterSprite = (props: CharacterSpriteProps) => {
  const { videoSrc, imageSrc, label, onActivate } = props
  const [videoFailed, setVideoFailed] = useState(false)

  if (videoSrc && !videoFailed) {
    return (
      <Video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-label={label}
        onClick={onActivate}
        onError={() => setVideoFailed(true)}
      >
        <source src={videoSrc} type="video/webm" />
      </Video>
    )
  }

  return <Sprite src={imageSrc} alt={label} draggable={false} onClick={onActivate} />
}

export default CharacterSprite

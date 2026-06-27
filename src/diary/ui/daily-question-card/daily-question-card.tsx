import {
  Composer,
  ErrorChip,
  QuestionBox,
  QuestionText,
  SaveButton,
  Sparkle,
  StyledTextarea,
} from '@/diary/ui/daily-question-card/daily-question-card.styled'

interface DailyQuestionCardProps {
  question: string
  value: string
  placeholder: string
  buttonLabel: string
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
  savedMessage: string
  errorMessage: string
  onChange: (value: string) => void
  onSave: () => void
}

const DailyQuestionCard = (props: DailyQuestionCardProps) => {
  const { question, value, placeholder, buttonLabel, saveStatus, savedMessage, errorMessage } =
    props
  const { onChange, onSave } = props

  // On a successful save the parent clears the text, so the confirmation rides
  // in the (now-visible) placeholder instead of pushing the layout around.
  const effectivePlaceholder = saveStatus === 'saved' ? savedMessage : placeholder

  return (
    <Composer>
      <QuestionBox>
        <Sparkle>✨</Sparkle>
        <QuestionText>{question}</QuestionText>
      </QuestionBox>

      <StyledTextarea
        value={value}
        placeholder={effectivePlaceholder}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
      />

      <SaveButton type="button" disabled={saveStatus === 'saving'} onClick={onSave}>
        {buttonLabel}
      </SaveButton>

      {saveStatus === 'error' && <ErrorChip role="alert">⚠️ {errorMessage}</ErrorChip>}
    </Composer>
  )
}

export default DailyQuestionCard

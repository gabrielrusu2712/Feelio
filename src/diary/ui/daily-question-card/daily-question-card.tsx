import {
  CardRoot,
  QuestionBox,
  QuestionText,
  SaveButton,
  SaveStatus,
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
  onChange: (value: string) => void
  onSave: () => void
}

const DailyQuestionCard = (props: DailyQuestionCardProps) => {
  const { question, value, placeholder, buttonLabel, saveStatus, savedMessage, onChange, onSave } =
    props

  return (
    <CardRoot>
      <QuestionBox>
        <Sparkle>✨</Sparkle>
        <QuestionText>{question}</QuestionText>
      </QuestionBox>

      <StyledTextarea
        value={value}
        placeholder={placeholder}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
      />

      <SaveButton type="button" disabled={saveStatus === 'saving'} onClick={onSave}>
        {buttonLabel}
      </SaveButton>

      {saveStatus === 'saved' && <SaveStatus $visible>{savedMessage}</SaveStatus>}
      {saveStatus === 'error' && (
        <SaveStatus $visible $error>
          ⚠️
        </SaveStatus>
      )}
    </CardRoot>
  )
}

export default DailyQuestionCard

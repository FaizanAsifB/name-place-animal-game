import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import React, { useCallback, useEffect } from 'react'
import { ScoringData } from './ScoringCards'

type ScoresToggleGroupProps = {
  category: string
  scores: Record<string, number> | null
  setScores: React.Dispatch<React.SetStateAction<Record<string, number> | null>>
  activeCategories: { id: number; title: string }[] | undefined
  scoringData: ScoringData
}

const ScoresToggleGroup = ({
  category,
  activeCategories,
  scores,
  setScores,
  scoringData,
}: ScoresToggleGroupProps) => {
  // Make initial scores object

  const isDuplicate = useCallback(() => {
    const categoriesWithDuplicates: string[] = []

    scoringData?.answersToCorrect.forEach(({ title, answers }) => {
      if (
        (answers[0] && scoringData.otherAnswers[title].includes(answers[0])) ||
        (answers[1] && scoringData.otherAnswers[title].includes(answers[1]))
      )
        categoriesWithDuplicates.push(title)
    })

    return categoriesWithDuplicates
  }, [scoringData?.answersToCorrect, scoringData.otherAnswers])

  useEffect(() => {
    if (activeCategories && scores === null) {
      const initialScores = Object.fromEntries(
        activeCategories.map(item => {
          if (isDuplicate().includes(item.title)) return [item.title, 5]
          return [item.title, 0]
        })
      )
      setScores(initialScores)
    }
  }, [activeCategories, scores, setScores, scoringData, isDuplicate])

  //state for radio buttons
  function handleScores(category: string, newScore: string | null) {
    if (newScore !== null) {
      setScores(prev => {
        return { ...prev, [category]: +newScore }
      })
    }
  }

  return (
    <ToggleGroup
      value={`${scores?.[category] ?? 0}`}
      onValueChange={value => {
        if (value) handleScores(...[category], value)
      }}
      type="single"
      aria-label="category scoring"
    >
      <ToggleGroupItem value={'0'} aria-label="zero" id={category}>
        0
      </ToggleGroupItem>
      <ToggleGroupItem value={'5'} aria-label="five" id={category}>
        5
      </ToggleGroupItem>
      <ToggleGroupItem value={'10'} aria-label="ten" id={category}>
        10
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
export default ScoresToggleGroup

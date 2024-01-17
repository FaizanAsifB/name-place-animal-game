import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import React from 'react'
import { useEffect } from 'react'

type ScoresToggleGroupProps = {
  category: string
  scores: Record<string, number> | null
  setScores: React.Dispatch<React.SetStateAction<Record<string, number> | null>>
  activeCategories: { id: number; title: string }[] | undefined
}

const ScoresToggleGroup = ({
  category,
  activeCategories,
  scores,
  setScores,
}: ScoresToggleGroupProps) => {
  // Make initial scores object
  useEffect(() => {
    if (activeCategories && scores === null) {
      const initialScores = Object.fromEntries(
        activeCategories.map(item => [item, 0])
      )
      setScores(initialScores)
    }
  }, [activeCategories, scores, setScores])

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

'use client'

import { Button } from '@/components/ui/button'

export interface FilterOption<T extends string> {
  value: T
  label: string
}

interface FilterButtonsProps<T extends string> {
  options: FilterOption<T>[]
  value: T
  onChange: (value: T) => void
}

export function FilterButtons<T extends string>({
  options,
  value,
  onChange,
}: FilterButtonsProps<T>) {
  return (
    <div className="flex gap-1">
      {options.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}

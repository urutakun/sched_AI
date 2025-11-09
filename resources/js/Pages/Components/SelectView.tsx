import React from 'react'
import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"

interface SelectViewProps {
  selectedView: 'timeGridWeek' | 'timeGridDay',
  setSelectedView: React.Dispatch<React.SetStateAction<'timeGridWeek' | 'timeGridDay'>>;
}

const SelectView = ({
  selectedView,
  setSelectedView
}: SelectViewProps) => {
  return (
    <RadioGroup defaultValue="comfortable" orientation='vertical' className='lg:flex items-center lg:space-x-3'
      value={selectedView}
      onValueChange={(val) => setSelectedView(val as 'timeGridWeek' | 'timeGridDay') }
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value="timeGridWeek" id="r1" />
        <Label htmlFor="r1">Week</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="timeGridDay" id="r2" />
        <Label htmlFor="r2">Day</Label>
      </div>
    </RadioGroup>
  )
}

export default SelectView

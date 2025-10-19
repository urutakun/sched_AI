import React from 'react'

interface FormLabelProps {
  htmlFor: string;
  textLabel: string;
  className?: string;
}

const FormLabel = ({ htmlFor, textLabel, className } : FormLabelProps) => {
  return (
    <label htmlFor={htmlFor} className={`${className ?? ""} block mb-3 font-light`}>
      {textLabel}
    </label>
  )
}

export default FormLabel

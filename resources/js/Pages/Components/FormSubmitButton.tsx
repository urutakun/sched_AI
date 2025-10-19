import React from 'react'

interface FormSubmitButtonProps{
  submit: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const FormSubmitButton = ({ submit, className, onClick }: FormSubmitButtonProps) => {
  return (
    <div className='w-full'>
      <button type="submit" onClick={onClick} className={`w-full px-2 md:px-3 py-3 md:py-4 bg-custom-secondary rounded-2xl text-white font-bold ctransition hover:bg-custom-secondary/90 ${className ?? ''}`}>{submit}</button>
    </div>
  )
}

export default FormSubmitButton

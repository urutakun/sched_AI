import React from 'react'

interface FormErrorProps{
  error?:string;
}

const FormError = ({ error }: FormErrorProps ) => {
  return (
    <div className='text-red-500 text-sm italic'>
      { error }
    </div>
  )
}

export default FormError

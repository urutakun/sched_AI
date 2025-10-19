import React, { useState } from 'react'
import FormError from './FormError';

interface GlassFormInputProps{
  id: string;
  type: string;
  placeholder?: string;
  value: string;
  min?: number;
  max?: number;
  maxLength?: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  disabled?: boolean;
  error?: string;
}

const GlassFormInput = ({ id, type, placeholder, value, min, max, maxLength, onChange, className, disabled, error } : GlassFormInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const handleShowPassword = (): void => {
    setIsPasswordVisible((prev) => !prev);
  }

return (
    <>
      <div className='relative font-light'>
        <input
          id={id}
          type={type === 'password' && isPasswordVisible ? 'text' : type}
          placeholder={placeholder}
          value={value}
          min={min}
          max={max}
          maxLength={maxLength}
          onChange={onChange}
          className={`${className ?? ""} relative bg-transparent border border-white/50 before:content-[''] before:absolute before:inset-0 before:rounded-xl before:border before:border-white/20 px-4 py-3 lg:px-6 lg:py-4 rounded-xl text-white tracking-tight  focus:outline-none focus:ring-2 focus:ring-white/25 text-sm md:text-base placeholder:text-white/50 placeholder:font-light`}
          disabled={disabled}
          autoComplete='off'
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={handleShowPassword}
            className="absolute top-1/2 -translate-y-1/2 right-4 text-white"
          >
            {isPasswordVisible ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            )}
          </button>
        )}
      </div>
      { error && <FormError error={error}/>}
    </>
  )
}

export default GlassFormInput

import React from 'react'

interface GlassFormSelectProps<T> {
  data: T[];
  valueKey: keyof T;
  labelKey: keyof T;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

const GlassFormSelect = <T,>(
  {
    data,
    valueKey,
    labelKey,
    onChange,
    value,
    className
  }: GlassFormSelectProps<T>) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`${className ?? ""} appearance-none relative bg-transparent border border-white/50 before:content-[''] before:absolute before:inset-0 before:rounded-xl before:border before:border-white/20 px-4 py-3 lg:px-6 lg:py-4 rounded-xl text-white tracking-tight  focus:outline-none focus:ring-2 focus:ring-white/25 text-sm md:text-base placeholder:text-white/50 placeholder:font-light w-full`}
      >
      <option className='text-black'>
        Select Program
      </option>
      {
        data.map((item, index) => {
          return(
            <>
              <option
              key={index}
              value={String(item[valueKey])}
              className='text-black'
              >
                {String(item[labelKey])}
              </option>
            </>
          )
        })
      }
    </select>
  )
}

export default GlassFormSelect

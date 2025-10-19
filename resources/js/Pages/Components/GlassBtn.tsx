import React from 'react'
import { Link } from '@inertiajs/react'

interface GlassBtnProps{
  label: string;
  href?: string;
  className?: string;
}

const GlassBtn = ({ label, href, className }: GlassBtnProps) => {
  return (
    <>
      { href ? (
        <Link href={href} className={`relative bg-white/20 backdrop-blur-[20px] border border-white/10 before:content-[''] before:absolute before:inset-0 before:rounded-xl before:border before:border-white/20 px-4 py-3 lg:px-6 lg:py-4 rounded-xl text-white tracking-tight font-bold hover:bg-white/10 ctransition ${className}`}>
          {label}
          </Link>
      ) : (
        <div className={`relative bg-white/20 backdrop-blur-[20px] border border-white/10 before:content-[''] before:absolute before:inset-0 before:rounded-xl before:border before:border-white/20 px-6 py-4 rounded-xl text-white tracking-tight font-bold hover:bg-white/10 ctransition ${className}`}>{label}</div>
      )}
    </>
  )
}

export default GlassBtn

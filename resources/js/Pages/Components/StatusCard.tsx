import React from 'react'
import { Link } from '@inertiajs/react';

interface StatusCardProps{
  icon: React.ComponentType<{className?: string}>;
  label: string;
  value: number;
  href?: string;
  color?: string;
}

const StatusCard = ({ icon:Icon, label, value, href, color }: StatusCardProps) => {
  return (
    <div>
      { href ? (
        <Link href={href} className='w-[170px] h-[70px] lg:w-[220px] lg:h-[90px] bg-white shadow-sm rounded-2xl flex items-center p-4 space-x-4 font-dm'>
          <div className="icon w-[40px] h-[40px] lg:w-[60px] lg:h-[60px] rounded-full bg-custom-primary flex justify-center items-center">
            <Icon className={`w-4 h-4 lg:w-6 lg:h-6 text-custom-secondary ${color ?? color}`}/>
          </div>
          <div className="status flex flex-col">
            <span className='text-custom-accent text-xs lg:text-sm'>{label}</span>
            <span className='text-xl lg:text-2xl text-black font-bold'>{value}</span>
          </div>
        </Link>
      ) : (
        <div className='w-[220px] h-[90px] bg-white shadow-sm rounded-2xl flex items-center p-4 space-x-4 font-dm'>
          <div className="icon w-[60px] h-[60px] rounded-full bg-custom-primary flex justify-center items-center">
            <Icon className={`w-6 h-6 text-custom-secondary ${color ?? color}`}/>
          </div>
          <div className="status flex flex-col">
            <span className='text-custom-accent text-sm'>{label}</span>
            <span className='text-2xl text-black font-bold'>{value}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatusCard

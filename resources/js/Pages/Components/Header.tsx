import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';

interface HeaderProps{
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const crumbs = useBreadcrumbs();

  return (
    <div className='space-y-2 fixed top-0 bg-custom-primary w-full py-4 z-50'>
      <div className="wrapper flex items-center space-x-3">
        <SidebarTrigger />
        <div className="divider border-r-[0.5px] border-custom-accent h-[20px]"></div>
        <Breadcrumb>
          <BreadcrumbList>
            { crumbs.map((crumb, idx) => (
                <BreadcrumbItem key={idx} className='text-xs lg:text-base'>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className='cursor-default'>{crumb.label}</BreadcrumbPage>
                  )}
                  {idx < crumbs.length - 1 && '/'}
                </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='title'>
        <span className='text-2xl lg:text-4xl font-dm font-bold tracking-tighter text-black'>{title}</span>
      </div>
    </div>
  )
}

export default Header

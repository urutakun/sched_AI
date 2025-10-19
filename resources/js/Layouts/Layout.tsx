import React from 'react'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import Header from '@/Pages/Components/Header'
import { Toaster } from '@/components/ui/sonner'

interface LayoutProps{
  title: string;
  children: React.ReactNode;
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <div className='bg-custom-primary min-h-screen w-full'>
      <SidebarProvider>
        <AppSidebar/>
        <main className='w-full p-4 relative'>
          <Header title={title} />
          <div className="body mt-[5rem] lg:mt-[6rem]">
            {children}
          </div>
        </main>
        <Toaster position='top-center'/>
      </SidebarProvider>
    </div>
  )
}

export default Layout

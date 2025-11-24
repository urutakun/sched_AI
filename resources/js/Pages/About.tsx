import React from 'react'
import { Link } from '@inertiajs/react'
import { ChevronLeft } from 'lucide-react'
import { team, TeamMember } from './Data/teamData'

const About = () => {
  return (
    <div className="wrapper relative h-auto lg:h-screen w-screen font-dm p-6 lg:px-[15rem] lg:py-[2rem] bg-white space-y-16">
      <div className="about">
        <div className="header space-y-8">
          <Link className="flex items-center hover:text-custom-secondary ctransition w-fit" href="/"><ChevronLeft/>Home</Link>
          <div className="about_content grid lg:grid-cols-2 space-y-4 lg:space-y-0">
            <div className="title">
              <h1 className='text-4xl lg:text-6xl font-bold tracking-tighter text-custom-secondary max-w-[700px]'>The Researchers and Purpose Behind SchedAI</h1>
            </div>
            <div className="body space-y-6">
              <p>SchedAI is a smart and reliable class scheduling system built to make school scheduling simple and stress-free. Instead of spending hours fixing conflicts between teachers, rooms, and subjects, SchedAI uses artificial intelligence to automatically create organized and efficient schedules.</p>
              <p>It helps schools save time, reduce errors, and manage classes with ease through an intuitive and easy-to-use interface. With SchedAI, scheduling becomes smoother, faster, and smarter, giving teachers and administrators more time to focus on what really matters: quality education.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="developers">
        {/* <div className="header space-y-8">
          <div className="title">
            <h1 className='text-4xl font-bold tracking-tighter text-custom-secondary'>Meet our Team</h1>
            <p className='leading-tight text-custom-accent'>A team of innovators dedicated to simplifying class scheduling</p>
          </div>
        </div> */}
        <div className="devs flex flex-col lg:flex-row items-center w-fit gap-8 mt-8">
          {team.map((member: TeamMember, index: number) => {
            return(
              <div className='space-y-3' key={index}>
                <div className="img_wrapper group relative w-[260px] h-[320px] lg:w-[260px] lg:h-[360px] overflow-hidden rounded-2xl">
                  <img
                    src={member.img}
                    alt={member.name}
                className="absolute inset-0 w-full h-full object-cover cimg_transition group-hover:opacity-0"
                    />
                  <img
                    src={member.alt_img}
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 cimg_transition group-hover:opacity-100"
                    />
                </div>
                <div className="info pl-4">
                  <div className="name border-2 border-black rounded-full w-fit py-1 px-3">
                    <span className='font-bold tracking-tight'>{member.name}</span>
                  </div>
                  <div className="role">
                    <span className='text-custom-accent text-sm'>{member.role}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default About

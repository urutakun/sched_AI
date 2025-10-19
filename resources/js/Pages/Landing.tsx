import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import Logo from './Components/Logo';
import BlurText from "@/components/motion/BlurText";
import { motion } from 'motion/react'
import GlassBtn from './Components/GlassBtn';

export default function Landing() {

    const fadeInVariant = {
      initial: { opacity: 0 },
      animate: { opacity: 1 , transition: { duration: 1, delay: 1.6 }}
    }

    return (
      <div className="cbg">
        <div className="wrapper relative h-screen w-screen font-dm p-6 lg:px-[15rem] lg:py-[2rem] flex flex-col overflow-hidden">
          <motion.nav
            variants={fadeInVariant}
            initial="initial"
            animate="animate"
            className='flex justify-between items-center'
          >
            <div className="logo">
              <Logo height={30} width={30} color={'custom-secondary'} size={'text-xl lg:text-2xl'} isVisible={true} textColor={'text-white'} />
            </div>
            <GlassBtn label={'Learn More'} href={'/about'} className={'rounded-full'}/>
          </motion.nav>
          <div className="main h-full flex flex-col items-center justify-center text-center">
            <motion.div
              variants={fadeInVariant}
              initial="initial"
              animate="animate"
              className="logo_2">
              <Logo height={70} width={70} color={'white'} isVisible={false} className={'mb-12 lg:mb-16'} scale={0.8} />
            </motion.div>
            <div className="flex flex-col items-center mb-14 lg:mb-16 z-20">
              <BlurText
                text="AI-Powered Class Scheduling Made Simple"
                delay={200}
                animateBy="words"
                direction="top"
                className="text-white text-[1.9rem] lg:text-[4rem] mb-4 lg:mb-8 font-dm font-bold tracking-tighter max-w-[400px] lg:max-w-[900px] leading-[40px] lg:leading-[60px]"
              />
              <motion.div
              variants={fadeInVariant}
              initial="initial"
              animate="animate"
              className="sub_text text-white max-w-[400px] lg:max-w-[600px] text-center w-full text-sm lg:text-xl tracking-tight">
                <span>No more double-booked classes. Our AI ensures conflict-free schedules for teachers and students.</span>
              </motion.div>
            </div>
            <motion.div
            variants={fadeInVariant}
              initial="initial"
              animate="animate"
            className="cta z-20">
              <GlassBtn label={'Get Started'} href={'/auth/login'}/>
            </motion.div>
          </div>
          {/* <div className="ball w-[1000px] h-[800px] absolute -bottom-1/2 left-1/2 -translate-x-1/2 bg-white rounded-full blur-[300px] z-10">
          </div> */}
        </div>
      </div>
    );
}

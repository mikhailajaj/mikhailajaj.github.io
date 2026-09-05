import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Education from '@/components/Education'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <About />        {/* section-alt */}
      <Projects />     {/* bg-primary  */}
      <Skills />       {/* section-alt */}
      <Experience />   {/* bg-primary  */}
      <Education />    {/* section-alt */}
      <Footer />       {/* bg-elevated, border-top */}
    </main>
  )
}

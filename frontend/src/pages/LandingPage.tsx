import { Navbar } from '../components/layout/Navbar'
import Hero from '@/components/shared/Hero'
import Footer from '@/components/shared/Footer'
import TrustedBy from '@/components/shared/Solution'
import HowItWorks from '@/components/shared/HowItWork'
import WhySolStore from '@/components/shared/WhySolStore'
import Solution from '@/components/shared/Solution'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg grid-bg">
      <Navbar />
      <Hero />
      <WhySolStore />
      <HowItWorks />
      {/* <Solution /> */}
      <Footer />
    </div>
  )
}
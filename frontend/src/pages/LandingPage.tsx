import { Navbar } from '../components/layout/Navbar'
import Hero from '@/components/shared/Hero'
import Features from '@/components/shared/Features'
import Footer from '@/components/shared/Footer'
import TrustedBy from '@/components/shared/TrustedCompany'
import HowItWorks from '@/components/shared/WorkSteps'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg grid-bg">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <TrustedBy />
      <Footer />
    </div>
  )
}
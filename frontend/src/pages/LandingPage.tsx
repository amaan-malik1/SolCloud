import { Navbar } from '../components/layout/Navbar'
import Hero from '@/components/shared/Hero'
import Footer from '@/components/shared/Footer'
import TrustedBy from '@/components/shared/TrustedCompany'
import HowItWorks from '@/components/shared/WorkSteps'
import WhySolStore from '@/components/shared/WhySolStore'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg grid-bg">
      <Navbar />
      <Hero />
      <WhySolStore />
      <HowItWorks />
      <TrustedBy />
      <Footer />
    </div>
  )
}
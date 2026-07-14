import { Navbar } from '../components/layout/Navbar'
import Hero from '@/components/shared/Hero'
import Footer from '@/components/shared/Footer'
import HowItWorks from '@/components/shared/HowItWork'
import WhySolStore from '@/components/shared/WhySolStore'
import PricingTable from '@/components/shared/PricingTable'

export default function LandingPage() {
  return (
    <div className='min-h-[100dvh] bg-dark-bg'>
      <Navbar />
      <main>
        <Hero />
        <WhySolStore />
        <HowItWorks />
        <PricingTable />
      </main>
      <Footer />
    </div>
  )
}

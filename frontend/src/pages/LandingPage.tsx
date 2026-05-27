import { Link } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import Hero from '@/components/shared/Hero'
import Features from '@/components/shared/Features'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg grid-bg">
      <Navbar />
      <Hero />
      <Features />
    </div>
  )
}
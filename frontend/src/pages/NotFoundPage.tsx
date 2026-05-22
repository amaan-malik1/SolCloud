import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center text-center">
      <div>
        <h1 className="font-display text-6xl font-bold text-white/10 mb-4">404</h1>
        <p className="text-white/50 mb-6 font-body">Page not found</p>
        <Link to="/" className="text-sol-purple hover:underline text-sm font-body">← Go home</Link>
      </div>
    </div>
  )
}

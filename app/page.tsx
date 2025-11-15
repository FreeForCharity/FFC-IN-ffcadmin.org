import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Free For Charity Admin</h1>
        <div className="space-y-4">
          <Link 
            href="/tech-stack" 
            className="block p-6 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Technology Stack</h2>
            <p className="text-gray-600">
              View our complete technology stack documentation
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}

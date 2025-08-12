// src/app/page.tsx
export default function Home() {
  return (
    <div className="pt-20 px-4"> {/* Add padding-top to account for fixed navbar */}
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
        <p className="text-lg text-gray-600">This is the main landing page of the application.</p>
      </div>
    </div>
  )
}
import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            UniSee
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/schools" className="text-gray-600 hover:text-gray-900">
              Browse Schools
            </Link>
            <Link href="/account" className="text-gray-600 hover:text-gray-900">
              My Account
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

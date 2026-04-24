import Link from 'next/link'
import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const isSuccess = resolvedSearchParams?.message?.includes('Check email');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-4">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-full text-white/80 bg-white/10 hover:bg-white/20 hover:text-white backdrop-blur-md transition-all flex items-center group text-sm border border-white/10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </Link>

      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 text-white animate-in slide-in-from-bottom-4 duration-500 fade-in">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Welcome Back</h2>
          <p className="text-white/60">Sign in to your account to continue</p>
        </div>

        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80 ml-1" htmlFor="email">
              Email
            </label>
            <input
              className="rounded-xl px-4 py-3 bg-white/5 border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none transition-all placeholder:text-white/30"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80 ml-1" htmlFor="password">
              Password
            </label>
            <input
              className="rounded-xl px-4 py-3 bg-white/5 border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none transition-all placeholder:text-white/30"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            formAction={login}
            className="mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-semibold rounded-xl px-4 py-3 shadow-lg transform transition hover:-translate-y-0.5"
          >
            Sign In
          </button>

          <p className="text-sm text-center text-white/60 mt-4">
            Don't have an account?{' '}
            <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition-colors">
              Sign Up
            </Link>
          </p>
          
          {resolvedSearchParams?.message && (
            <div className={`mt-4 p-4 border text-sm text-center rounded-xl backdrop-blur-md animate-in fade-in zoom-in duration-300 ${
              isSuccess 
                ? 'bg-green-500/10 border-green-500/20 text-green-200' 
                : 'bg-red-500/10 border-red-500/20 text-red-200'
            }`}>
              {resolvedSearchParams.message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/utils/supabase/auth'
import { createPost } from '@/app/actions/posts'

export default async function NewPostPage() {
  const { user, role } = await getUserWithRole()

  if (!user || (role !== 'admin' && role !== 'author')) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white font-sans selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="w-full border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
            <span className="font-semibold text-white/90">Back to Feed</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12 animate-in slide-in-from-bottom-4 fade-in duration-700">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">
            Write a new post
          </h1>
          <p className="text-white/50 text-lg">Share your thoughts with the world.</p>
        </div>

        <form action={createPost} className="space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-150 fill-mode-both bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-purple-500/5">
          {/* Title Input */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-semibold text-white/80 uppercase tracking-wider ml-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="Give your post a catchy title"
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xl font-medium focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-white/20"
            />
          </div>



          {/* Image URL Input */}
          <div className="space-y-2">
            <label htmlFor="image_url" className="text-sm font-semibold text-white/80 uppercase tracking-wider ml-1">
              Cover Image URL
            </label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              placeholder="https://example.com/image.png"
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white/80 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-white/20"
            />
          </div>

          {/* Content Input */}
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-semibold text-white/80 uppercase tracking-wider ml-1">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={12}
              placeholder="Start writing here..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white/90 text-lg leading-relaxed focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-white/20 resize-y"
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-lg px-10 py-4 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transform hover:-translate-y-1 transition-all"
            >
              Publish Post
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

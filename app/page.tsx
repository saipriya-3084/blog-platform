import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import RBACGuard from '@/components/RBACGuard'

export const revalidate = 0 // Opt out of static caching for the dynamic posts

export default async function Home() {
  const supabase = await createClient()
  
  // Fetch posts with their author's profile
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        role
      )
    `)
    .order('created_at', { ascending: false })

  const displayPosts = posts?.length ? posts : [
    {
      id: 'demo-1',
      title: 'The Future of Web Development with Next.js & Supabase',
      summary: 'Explore how combining Next.js App Router with Supabase Auth and Row Level Security creates an unstoppable stack for modern web applications.',
      image_url: '/demo-cover.png',
      content: 'Demo content...',
      created_at: new Date().toISOString(),
      profiles: { role: 'admin' }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white font-sans selection:bg-purple-500/30">
      
      {/* Navigation / Header */}
      <nav className="w-full border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-purple-500/20">
              B
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Platform
            </span>
          </div>

          <div className="flex gap-4 items-center">
            <RBACGuard allowedRoles={['admin', 'author']}>
              <Link 
                href="/posts/new" 
                className="text-sm font-medium px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors shadow-sm"
              >
                Create Post
              </Link>
            </RBACGuard>
            
            <Link 
              href="/login" 
              className="text-sm font-bold px-6 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transform hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-16 animate-in slide-in-from-bottom-4 fade-in duration-700">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">
            Insights & <br/> Stories
          </h1>
          <p className="text-xl text-white/50 max-w-2xl font-light leading-relaxed">
            Discover the latest thoughts, tutorials, and stories from our community. Built with speed and security in mind.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.map((post, idx) => (
            <Link href={`/posts/${post.id}`} key={post.id} className={`group block animate-in slide-in-from-bottom-8 fade-in duration-700 fill-mode-both`} style={{ animationDelay: `${idx * 150}ms` }}>
              <div className="h-full flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] hover:border-purple-500/30">
                
                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-white/5">
                  {post.image_url ? (
                    <Image 
                      src={post.image_url} 
                      alt={post.title} 
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 flex items-center justify-center">
                      <span className="text-white/20 font-bold text-2xl">No Image</span>
                    </div>
                  )}
                  
                  {/* Optional Role Badge */}
                  {post.profiles?.role === 'admin' && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                      <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">Featured</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
                    {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h2 className="text-2xl font-bold mb-4 line-clamp-2 leading-tight group-hover:text-purple-300 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-white/60 line-clamp-3 font-light leading-relaxed mb-6 flex-1">
                    {post.summary || 'Click to read more about this topic...'}
                  </p>
                  
                  <div className="flex items-center text-sm font-semibold text-white/80 group-hover:text-white transition-colors mt-auto">
                    Read Article 
                    <svg className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

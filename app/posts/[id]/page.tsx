import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import RBACGuard from '@/components/RBACGuard'
import { createComment } from '@/app/actions/posts'

export const revalidate = 0

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const postId = resolvedParams.id;
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        role
      )
    `)
    .eq('id', postId)
    .single()

  if (error || !post) {
    notFound()
  }

  const { data: comments } = await supabase
    .from('comments')
    .select('*, profiles(role)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  const submitComment = createComment.bind(null, postId)

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 pb-20">
      
      {/* Navigation */}
      <nav className="w-full bg-black/50 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
            <span className="font-semibold text-white/90">Home</span>
          </Link>
          
          <RBACGuard allowedRoles={['admin', 'author']}>
            <div className="flex gap-4">
              <button className="text-sm font-medium px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                Edit Post
              </button>
            </div>
          </RBACGuard>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-10 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Cover Image */}
        {post.image_url && (
          <div className="w-full aspect-video md:aspect-[21/9] relative rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-purple-900/20 border border-white/10">
            <Image 
              src={post.image_url} 
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-purple-400 font-semibold uppercase tracking-wider text-sm">
              {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            {post.profiles?.role === 'admin' && (
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold border border-purple-500/30">
                Staff Pick
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>
          {post.summary && (
            <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed">
              {post.summary}
            </p>
          )}
        </header>

        {/* Content */}
        <article className="prose prose-invert prose-lg md:prose-xl max-w-none text-white/80 whitespace-pre-wrap mb-20">
          {post.content}
        </article>

        {/* Comments Section */}
        <section className="border-t border-white/10 pt-12 mt-12 mb-24">
          <h2 className="text-3xl font-bold mb-8">Comments</h2>
          
          <RBACGuard 
            allowedRoles={['admin', 'author', 'viewer']} 
            fallback={
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center mb-10">
                <p className="text-white/60 mb-4">You must be logged in to leave a comment.</p>
                <Link href="/login" className="inline-block bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-gray-200 transition-colors">
                  Sign In to Comment
                </Link>
              </div>
            }
          >
            <form action={submitComment} className="mb-12">
              <div className="flex flex-col gap-4">
                <textarea
                  name="content"
                  required
                  rows={3}
                  placeholder="Share your thoughts..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white/90 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-white/20 resize-none"
                ></textarea>
                <div className="flex justify-end">
                  <button type="submit" className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-semibold px-6 py-2 rounded-full transition-all hover:-translate-y-0.5">
                    Post Comment
                  </button>
                </div>
              </div>
            </form>
          </RBACGuard>

          <div className="space-y-6">
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-sm shadow-lg shadow-purple-500/20">
                      {(comment.profiles?.role as string)?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white/90 capitalize">
                        {comment.profiles?.role || 'User'}
                      </span>
                      <span className="text-xs text-white/40">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/80 whitespace-pre-wrap">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-white/40 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

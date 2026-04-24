'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getUserWithRole } from '@/utils/supabase/auth'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function createPost(formData: FormData) {
  const { user, role } = await getUserWithRole()

  if (!user || (role !== 'admin' && role !== 'author')) {
    throw new Error('Unauthorized to create posts')
  }

  const title = formData.get('title') as string
  let summary = ''
  const image_url = formData.get('image_url') as string
  const content = formData.get('content') as string

  if (content && !summary) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Generate a 200 word summary for the following blog content:\n\n${content}`;
      const result = await model.generateContent(prompt);
      summary = result.response.text();
    } catch (error) {
      console.error('Failed to generate summary with Gemini:', error);
    }
  }

  const supabase = await createClient()

  const { error, data } = await supabase
    .from('posts')
    .insert({
      title,
      summary,
      image_url,
      content,
      author_id: user.id
    })
    .select()
    .single()

  if (error) {
    console.error(error)
    throw new Error('Failed to create post')
  }

  revalidatePath('/')
  redirect(`/posts/${data.id}`)
}

export async function updatePost(postId: string, formData: FormData) {
  const { user, role } = await getUserWithRole()

  if (!user) throw new Error('Unauthorized')

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  const supabase = await createClient()

  // For authors, we ensure they only update their own post
  let query = supabase.from('posts').update({ title, content }).eq('id', postId)

  if (role !== 'admin') {
    query = query.eq('author_id', user.id)
  }

  const { error } = await query

  if (error) throw new Error('Failed to update post')

  revalidatePath('/posts')
  revalidatePath(`/posts/${postId}`)
}

export async function deletePost(postId: string) {
  const { user, role } = await getUserWithRole()

  if (!user) throw new Error('Unauthorized')

  const supabase = await createClient()

  let query = supabase.from('posts').delete().eq('id', postId)

  if (role !== 'admin') {
    query = query.eq('author_id', user.id)
  }

  const { error } = await query

  if (error) throw new Error('Failed to delete post')

  revalidatePath('/posts')
}

export async function createComment(postId: string, formData: FormData) {
  const { user } = await getUserWithRole()

  if (!user) throw new Error('You must be logged in to comment')

  const content = formData.get('content') as string

  const supabase = await createClient()

  const { error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      content,
      author_id: user.id
    })

  if (error) throw new Error('Failed to create comment')

  revalidatePath(`/posts/${postId}`)
}

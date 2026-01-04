import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { createClient } from 'microcms-js-sdk'
import { format } from 'date-fns'
import { Loader2, ArrowLeft, Clock, Tag } from 'lucide-react'
import { Button } from './ui/button'

// 型定義
type Post = {
  id: string
  title?: string
  content: string
  eyecatch?: { url: string; height: number; width: number }
  images?: { url: string; height: number; width: number }[]
  category?: string[]
  publishedAt: string
}

const client = createClient({
  serviceDomain: import.meta.env.VITE_MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.VITE_MICROCMS_API_KEY,
})

export function TimelineDetail() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return
      try {
        const data = await client.get({ endpoint: 'timeline', contentId: id })
        setPost(data)
      } catch (error) {
        console.error('Failed to fetch post:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-white/30" />
      </div>
    )
  }

  if (!post) {
    return <div className="min-h-screen bg-black text-white p-20">Article not found.</div>
  }

  return (
    <article className="min-h-screen bg-black text-white py-32 px-6 fade-in-up">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
      
      {/* 戻るボタン */}
      <div className="fixed top-8 left-8 z-50 mix-blend-difference">
        <Link to="/timeline">
          <Button variant="ghost" className="text-white hover:text-white/60 p-0">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-xs tracking-[0.2em] uppercase">Back</span>
          </Button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* ヘッダー情報 */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-xs tracking-widest text-white/50">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <time>{format(new Date(post.publishedAt), 'yyyy.MM.dd')}</time>
            </div>
            {post.category && post.category.map((cat) => (
              <div key={cat} className="flex items-center gap-2 px-2 py-1 border border-white/10 rounded-full">
                <Tag className="w-3 h-3" />
                <span>{cat}</span>
              </div>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
            {post.title || 'Untitled'}
          </h1>
        </div>

        {/* アイキャッチ画像 */}
        {post.eyecatch && (
          <div className="mb-16 rounded-sm overflow-hidden border border-white/10">
            <img 
              src={post.eyecatch.url} 
              alt={post.title} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* 本文 */}
        <div className="prose prose-invert prose-lg max-w-none leading-relaxed font-light text-white/80 whitespace-pre-wrap">
          {post.content}
        </div>

        {/* その他の画像ギャラリー（もしあれば） */}
        {post.images && post.images.length > 0 && (
          <div className="mt-16 grid grid-cols-2 gap-4">
            {post.images.map((img, index) => (
              <img key={index} src={img.url} alt="" className="w-full rounded-sm opacity-80 hover:opacity-100 transition-opacity" />
            ))}
          </div>
        )}
      </div>
      
      <style>{`
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </article>
  )
}
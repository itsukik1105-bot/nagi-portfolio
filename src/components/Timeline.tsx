import { useEffect, useState } from 'react'
import { createClient } from 'microcms-js-sdk'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react' // 修正: ImageIcon を削除

// ■ microCMSの型定義
type Post = {
  id: string
  content: string
  images?: { url: string; height: number; width: number }[]
  category?: string[]
  publishedAt: string
}

// ■ APIクライアントの作成
const client = createClient({
  serviceDomain: import.meta.env.VITE_MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.VITE_MICROCMS_API_KEY,
})

export function Timeline() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await client.get({ endpoint: 'timeline' })
        setPosts(data.contents)
      } catch (error) {
        console.error('Failed to fetch timeline:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <section className="min-h-screen bg-black text-white py-32 px-6">
      {/* 背景ノイズ */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>

      <div className="max-w-[600px] mx-auto relative z-10">
        
        {/* ヘッダー */}
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-light tracking-[0.2em] mb-4">TIMELINE</h2>
          <div className="h-px w-12 bg-white/30 mx-auto"></div>
          <p className="mt-4 text-xs text-white/40 tracking-widest">
            Fragments of memory.
          </p>
        </div>

        {/* 投稿リスト */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-white/30" />
          </div>
        ) : (
          <div className="space-y-16">
            {posts.map((post) => (
              <article key={post.id} className="group animate-fade-in-up">
                
                {/* メタ情報（日付・カテゴリ） */}
                <div className="flex items-center gap-4 mb-3 text-[10px] tracking-widest text-white/40">
                  <time>{format(new Date(post.publishedAt), 'yyyy.MM.dd')}</time>
                  {post.category && (
                    <span className="px-2 py-0.5 border border-white/10 rounded-full">
                      {post.category}
                    </span>
                  )}
                </div>

                {/* 本文 */}
                <p className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap font-light mb-6">
                  {post.content}
                </p>

                {/* 画像（あれば表示） */}
                {post.images && post.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {post.images.map((img, index) => (
                      <div key={index} className={`relative overflow-hidden rounded-sm ${post.images!.length === 1 ? 'col-span-2' : ''}`}>
                        <img 
                          src={img.url} 
                          alt="post attachment" 
                          className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* 区切り線 */}
                <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
      `}</style>
    </section>
  )
}
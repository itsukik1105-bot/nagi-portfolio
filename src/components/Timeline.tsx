import { useEffect, useState } from 'react'
import { createClient } from 'microcms-js-sdk'
import { format } from 'date-fns'
import { Loader2, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

type Post = {
  id: string
  title?: string
  eyecatch?: { url: string; height: number; width: number }
  category?: string[]
  publishedAt: string
}

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
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>

      <div className="max-w-[1000px] mx-auto relative z-10">
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-light tracking-[0.2em] mb-4">TIMELINE</h2>
          <div className="h-px w-12 bg-white/30 mx-auto"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-white/30" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Link to={`/timeline/${post.id}`} key={post.id} className="group block">
                <article className="relative bg-[#0a0a0a] border border-white/10 overflow-hidden hover:border-white/30 transition-colors duration-500">
                  
                  {/* バナー画像（アイキャッチ） */}
                  <div className="aspect-video w-full overflow-hidden bg-[#111]">
                    {post.eyecatch ? (
                      <img 
                        src={post.eyecatch.url} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10 font-bold text-4xl">
                        NO IMAGE
                      </div>
                    )}
                  </div>

                  {/* 記事情報 */}
                  <div className="p-6 relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col gap-1">
                        <time className="text-[10px] tracking-widest text-white/40 font-mono">
                          {format(new Date(post.publishedAt), 'yyyy.MM.dd')}
                        </time>
                        {post.category && (
                          <span className="text-[10px] tracking-wider text-white/60 uppercase">
                            {post.category[0]}
                          </span>
                        )}
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                    </div>
                    
                    <h3 className="text-lg font-medium leading-relaxed group-hover:text-white transition-colors duration-300 line-clamp-2 min-h-[3.5em]">
                      {post.title || 'Untitled Post'}
                    </h3>
                  </div>
                  
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
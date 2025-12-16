import { useEffect } from 'react'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import { type Work } from '../data/works'

interface WorkDetailProps {
  work: Work
  onBack: () => void
}

export function WorkDetail({ work, onBack }: WorkDetailProps) {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const galleryImages = Array.isArray(work.gallery) ? work.gallery : [];
  
  // 変更点1: videoUrlがある場合のみメインエリアを表示する（サムネイルだけの表示はしない）
  const showMainVideo = !!work.videoUrl;

  return (
    <div className="min-h-screen relative pt-32 pb-40 px-6">
      
      {/* 戻るボタン */}
      <div className="fixed top-8 left-8 z-50 mix-blend-difference">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-white hover:text-white/60 p-0 hover:bg-transparent transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-xs tracking-[0.2em] font-medium uppercase">Back</span>
        </Button>
      </div>

      <div className="max-w-[1200px] mx-auto">
        
        {/* タイトルエリア */}
        <div className="mb-24 fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8 mb-8 text-xs text-[#666] tracking-[0.1em] uppercase border-b border-[#222] pb-6">
            <span className="text-white">{work.title}</span>
            <span>{work.category}</span>
            <span>{work.year}</span>
            <span className="md:ml-auto normal-case tracking-normal text-[#444]">
              {work.role || '-'}
            </span>
          </div>
        </div>
            
        {/* 動画エリア（videoUrlがある場合のみ表示） */}
        {showMainVideo && (
          <div className="relative w-full mb-32 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <video
              src={work.videoUrl}
              controls
              playsInline
              className="w-full aspect-video object-cover bg-[#0a0a0a] grayscale-[10%] hover:grayscale-0 transition-all duration-1000"
              poster={work.thumbnail || ''}
            >
              <p className="p-4 text-center text-xs text-[#444]">Video not supported.</p>
            </video>
          </div>
        )}

        {/* 変更点2: ギャラリーエリアを説明文の上に移動 */}
        {galleryImages.length > 0 && (
          <div className="mb-32 fade-in-up" style={{ animationDelay: showMainVideo ? '0.3s' : '0.2s' }}>
            {/* Gallery見出し（任意ですが、区切りのために小さく入れると綺麗です） */}
            {/* <h2 className="text-xs text-[#444] uppercase tracking-[0.2em] mb-8">Gallery</h2> */}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-24">
              {galleryImages.map((imageUrl, index) => (
                <div key={index} className="group">
                  <div className="aspect-[4/3] overflow-hidden bg-[#050505] mb-4">
                    <img
                      src={imageUrl}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover transition-all duration-700 ease-out grayscale hover:grayscale-0 hover:scale-[1.01]"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-[10px] text-[#333] tracking-widest text-right">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 説明文エリア（一番下に配置） */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-40 fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="md:col-span-4">
            <h2 className="text-xs text-[#444] uppercase tracking-[0.2em] mb-4">Description</h2>
          </div>
          <div className="md:col-span-8">
            <p className="text-base md:text-lg leading-[2.0] text-[#ccc] font-light whitespace-pre-wrap">
              {work.description || ''}
            </p>
          </div>
        </div>

      </div>
      
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up {
          opacity: 0;
          animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  )
}
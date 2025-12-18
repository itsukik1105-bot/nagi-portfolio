// src/components/About.tsx

import { Button } from './ui/button'

interface AboutProps {
  onContactClick: () => void
}

export function About({ onContactClick }: AboutProps) {
  return (
    <section id="about" className="bg-black text-white py-20 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        
        {/* 左側：画像エリア */}
        <div className="relative order-2 md:order-1">
          {/* 画像の装飾枠 (PCのみ表示) */}
          <div className="absolute -inset-4 border border-white/20 rounded-sm translate-x-4 translate-y-4 hidden md:block" />
          
          <div className="relative overflow-hidden rounded-sm aspect-[3/4] md:aspect-[4/5] group">
            <img 
              src="https://storage.googleapis.com/studio-design-asset-files/projects/bXqzDJDpWD/s-727x969_v-fs_webp_4c394dcb-3e20-423d-844c-47fd431f78ab.jpg" 
              alt="Profile" 
              // デフォルトでカラー表示（grayscaleを削除）
              className="w-full h-full object-cover transition-all duration-700 ease-out 
                group-hover:scale-105 group-active:scale-105"
            />
            
            {/* PCのみ：ホバー時に少し明るくするオーバーレイ */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent group-active:bg-transparent transition-colors duration-700 pointer-events-none" />
          </div>
        </div>

        {/* 右側：テキストエリア */}
        <div className="order-1 md:order-2 space-y-8">
          <div>
            <h2 className="text-sm font-bold tracking-[0.2em] text-white/60 mb-4 uppercase">
              Who I am
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
              Nagi <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                Portfolio
              </span>
            </h3>
            <div className="h-1 w-20 bg-white/20" />
          </div>

          <p className="text-white/70 leading-relaxed font-light text-sm md:text-base">
            東京を拠点に活動するクリエイター。
            デジタルとアナログの境界線を曖昧にするような表現を追求しています。
            <br /><br />
            映像制作、Webデザイン、そしてインタラクティブな体験作りまで。
            「美しさ」と「機能性」の両立を目指し、常に新しい技術を取り入れています。
          </p>

          <div className="pt-4">
            <Button 
              onClick={onContactClick}
              variant="outline"
              className="rounded-full px-8 py-6 bg-transparent border-white text-white hover:bg-white hover:text-black active:bg-white active:text-black transition-all duration-300 tracking-widest text-xs font-bold"
            >
              CONTACT ME
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
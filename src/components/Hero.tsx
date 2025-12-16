import { Button } from './ui/button'
import { useGlitchText } from '../hooks/useGlitchText'

interface HeroProps {
  videoUrl?: string
  title: string
  subtitle: string
  onAboutClick: () => void
}

export function Hero({ videoUrl, title, subtitle, onAboutClick }: HeroProps) {
  const { displayText: buttonText, triggerGlitch: triggerButtonGlitch } = useGlitchText("VIEW PROFILE")

  return (
    <section 
      // スマホ時は高さ70vh（60vh→70vhに増加）、PC以上で全画面
      className="relative h-[70vh] min-h-[500px] md:h-screen w-full overflow-hidden flex items-end justify-center pb-16 md:pb-40 bg-black"
    >
      
      {/* 背景エリア */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {videoUrl ? (
          <div className="w-full h-full animate-slow-zoom">
            <video
              autoPlay
              loop
              muted
              playsInline
              // スマホでは object-position を調整して動画の見せたい部分を表示
              className="w-full h-full object-cover object-center md:object-center filter contrast-[1.1] saturate-[0.9] brightness-[0.95]"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          </div>
        ) : (
          <div className="w-full h-full bg-[#050505]" />
        )}
        
        {/* ノイズテクスチャ */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay"></div>
        
        {/* ビネット効果 - スマホでは軽めに */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)] md:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>

        {/* 下部のグラデーション - スマホでは軽めに、コンテンツ部分だけ暗く */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent md:via-black/50"></div>
      </div>

      {/* コンテンツエリア */}
      <div className="relative z-10 text-center px-4 fade-in-slow w-full">
        {/* タイトル - スマホでは少し小さめ */}
        <h1 
          className="text-3xl sm:text-4xl md:text-8xl font-bold tracking-tight text-white mb-4 md:mb-8"
          style={{ textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}
        >
          {title}
        </h1>
        
        {/* サブタイトル */}
        <p className="text-[9px] sm:text-[10px] md:text-sm text-white/70 tracking-[0.3em] md:tracking-[0.4em] uppercase mb-8 md:mb-12 font-medium border-t border-white/20 pt-4 md:pt-8 inline-block px-4 md:px-8">
          {subtitle}
        </p>
        
        {/* ボタン */}
        <div>
          <Button 
            variant="outline" 
            onClick={onAboutClick}
            onMouseEnter={triggerButtonGlitch}
            onTouchStart={triggerButtonGlitch}
            className="group rounded-full px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 bg-white/5 backdrop-blur-sm border border-white/20 text-white hover:bg-white hover:text-black active:bg-white active:text-black transition-all duration-700 ease-out tracking-[0.15em] md:tracking-[0.2em] text-[9px] sm:text-[10px] font-bold"
          >
            <span className="group-hover:scale-105 group-active:scale-105 inline-block transition-transform duration-300 font-mono">
              {buttonText}
            </span>
          </Button>
        </div>
      </div>

      {/* スクロールダウンライン */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-12 md:h-24 bg-gradient-to-b from-white/0 via-white/40 to-white/0">
        <div className="w-full h-1/2 bg-white/80 animate-scroll-line"></div>
      </div>
      
      <style>{`
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        .animate-slow-zoom {
          animation: slowZoom 20s ease-in-out infinite alternate;
        }

        @keyframes fadeUpSlow {
          from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .fade-in-slow {
          opacity: 0;
          animation: fadeUpSlow 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s forwards;
        }

        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-scroll-line {
          animation: scrollLine 2s cubic-bezier(0.77, 0, 0.175, 1) infinite;
        }
      `}</style>
    </section>
  )
}
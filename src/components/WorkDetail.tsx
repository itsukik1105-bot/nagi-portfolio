import { useEffect, useState, useRef } from 'react'
import { Button } from './ui/button'
import { ArrowLeft, Play } from 'lucide-react'
import { type Work } from '../data/works'

interface WorkDetailProps {
  work: Work
  onBack: () => void
}

// YouTubeのURLからビデオIDを抽出する関数
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

// PLAYボタンコンポーネント
function PlayButton({ onClick, isExternal = false }: { onClick: () => void; isExternal?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="group/play flex flex-col items-center gap-4 focus:outline-none"
    >
      {/* 円形ボタン */}
      <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
        {/* パルスアニメーション（外側の輪） */}
        <div className="absolute inset-0 rounded-full border border-white/30 animate-ping-slow"></div>
        <div className="absolute inset-0 rounded-full border border-white/20 animate-ping-slower"></div>
        
        {/* メインのボタン */}
        <div className="relative w-full h-full rounded-full border-2 border-white/60 bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all duration-500 group-hover/play:bg-white group-hover/play:border-white group-hover/play:scale-110 group-active/play:bg-white group-active/play:scale-105">
          <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white group-hover/play:text-black group-hover/play:fill-black group-active/play:text-black group-active/play:fill-black transition-colors duration-300 ml-1" />
        </div>
      </div>
      
      {/* PLAYテキスト */}
      <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/80 group-hover/play:text-white transition-colors duration-300 font-medium">
        {isExternal ? 'Play' : 'Play'}
      </span>
    </button>
  )
}

// 動画プレーヤーコンポーネント（サムネイル + PLAYボタン → 再生）
function VideoPlayer({ work, hasGallery }: { work: Work; hasGallery: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const hasDirectVideo = !!work.videoUrl
  const hasYouTube = !!work.youtubeUrl
  const hasExternalLink = !!work.externalVideoUrl
  const youtubeId = hasYouTube ? extractYouTubeId(work.youtubeUrl!) : null

  // 動画がない場合は何も表示しない
  if (!hasDirectVideo && !hasYouTube && !hasExternalLink) {
    return null
  }

  const handlePlay = () => {
    if (hasExternalLink) {
      // 外部リンクの場合は新しいタブで開く
      window.open(work.externalVideoUrl, '_blank', 'noopener,noreferrer')
    } else {
      // 動画再生開始
      setIsPlaying(true)
      // 直接動画の場合は再生開始
      if (hasDirectVideo && videoRef.current) {
        setTimeout(() => {
          videoRef.current?.play()
        }, 100)
      }
    }
  }

  return (
    <div className={`relative w-full ${hasGallery ? 'aspect-[4/3]' : 'aspect-video'} bg-[#0a0a0a] overflow-hidden group`}>
      {/* 再生前：サムネイル + PLAYボタン */}
      {!isPlaying && (
        <>
          {/* サムネイル */}
          {work.thumbnail ? (
            <img
              src={work.thumbnail}
              alt={work.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#111] to-[#0a0a0a] flex items-center justify-center">
              <span className="text-[#222] text-8xl font-bold">{work.title.charAt(0)}</span>
            </div>
          )}
          
          {/* オーバーレイ */}
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-500"></div>
          
          {/* PLAYボタン */}
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayButton onClick={handlePlay} isExternal={hasExternalLink} />
          </div>

          {/* 外部リンクの場合のインジケーター */}
          {hasExternalLink && (
            <div className="absolute bottom-4 right-4 text-[10px] text-white/50 tracking-widest uppercase flex items-center gap-2">
              <span>External Link</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          )}
        </>
      )}

      {/* 再生中：動画プレーヤー */}
      {isPlaying && hasDirectVideo && (
        <video
          ref={videoRef}
          src={work.videoUrl}
          controls
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          poster={work.thumbnail || ''}
        >
          <p className="p-4 text-center text-xs text-[#444]">Video not supported.</p>
        </video>
      )}

      {/* 再生中：YouTube埋め込み */}
      {isPlaying && hasYouTube && youtubeId && (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={work.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      )}
    </div>
  )
}

// ギャラリー画像コンポーネント（中央検出対応）
function GalleryImage({ 
  imageUrl, 
  index, 
  isMobileOrTablet 
}: { 
  imageUrl: string
  index: number
  isMobileOrTablet: boolean 
}) {
  const imageRef = useRef<HTMLDivElement>(null)
  const [isInCenter, setIsInCenter] = useState(false)

  useEffect(() => {
    if (!isMobileOrTablet) return
    
    const element = imageRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInCenter(entry.isIntersecting)
      },
      {
        threshold: 0.4,
        rootMargin: '-20% 0px -20% 0px',
      }
    )

    observer.observe(element)
    return () => observer.unobserve(element)
  }, [isMobileOrTablet])

  const isColorActive = isMobileOrTablet ? isInCenter : false

  return (
    <div ref={imageRef} className="group">
      <div className="aspect-[4/3] overflow-hidden bg-[#050505] mb-4">
        <img
          src={imageUrl}
          alt={`Gallery ${index + 1}`}
          className={`w-full h-full object-cover transition-all duration-700 ease-out
            ${isMobileOrTablet
              ? (isColorActive ? 'grayscale-0 scale-[1.01]' : 'grayscale scale-100')
              : 'grayscale hover:grayscale-0 hover:scale-[1.01]'
            }
          `}
          loading="lazy"
        />
      </div>
      <div className="text-[10px] text-[#333] tracking-widest text-right">
        {(index + 1).toString().padStart(2, '0')}
      </div>
    </div>
  )
}

export function WorkDetail({ work, onBack }: WorkDetailProps) {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // モバイル/タブレット判定
  useEffect(() => {
    const checkDevice = () => {
      const isSmallScreen = window.innerWidth < 1024
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsMobileOrTablet(isSmallScreen || isTouchDevice)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  const galleryImages = Array.isArray(work.gallery) ? work.gallery : [];
  const hasAnyVideo = !!work.videoUrl || !!work.youtubeUrl || !!work.externalVideoUrl

  return (
    <div className="min-h-screen relative pt-32 pb-40 px-6">
      
      {/* 戻るボタン */}
      <div className="fixed top-8 left-8 z-50 mix-blend-difference">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-white hover:text-white/60 active:text-white/60 p-0 hover:bg-transparent active:bg-transparent transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-xs tracking-[0.2em] font-medium uppercase">Back</span>
        </Button>
      </div>

      <div className="max-w-[1200px] mx-auto">
        
        {/* タイトルエリア（role強調版） */}
        <div className="mb-16 md:mb-24 fade-in-up" style={{ animationDelay: '0.1s' }}>
          {/* メインタイトル */}
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            {work.title}
          </h1>
          
          {/* メタ情報（カテゴリー / 年 / 役割 を同格で表示） */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#888] tracking-wide border-b border-[#222] pb-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#555] uppercase tracking-widest">Category</span>
              <span className="text-white">{work.category}</span>
            </div>
            <div className="w-px h-4 bg-[#333]"></div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#555] uppercase tracking-widest">Year</span>
              <span className="text-white">{work.year}</span>
            </div>
            {work.role && (
              <>
                <div className="w-px h-4 bg-[#333]"></div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#555] uppercase tracking-widest">Role</span>
                  <span className="text-white">{work.role}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ギャラリーエリア */}
        {galleryImages.length > 0 && (
          <div className="mb-16 md:mb-32 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-24">
              {galleryImages.map((imageUrl, index) => (
                <GalleryImage
                  key={index}
                  imageUrl={imageUrl}
                  index={index}
                  isMobileOrTablet={isMobileOrTablet}
                />
              ))}
            </div>
          </div>
        )}

        {/* 動画エリア（統一PLAYボタンUI） */}
        {hasAnyVideo && (
          <div className={`relative mb-16 md:mb-32 fade-in-up ${galleryImages.length > 0 ? 'w-full md:w-1/2 mx-auto' : 'w-full'}`} style={{ animationDelay: galleryImages.length > 0 ? '0.3s' : '0.2s' }}>
            <VideoPlayer work={work} hasGallery={galleryImages.length > 0} />
          </div>
        )}

        {/* 作品詳細エリア（4段構成） */}
        {(work.about || work.concept || work.process || work.client) && (
          <div className="space-y-16 md:space-y-20 mb-40 fade-in-up" style={{ animationDelay: '0.4s' }}>
            
            {/* About */}
            {work.about && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
                <div className="md:col-span-3">
                  <h2 className="text-xs text-[#555] uppercase tracking-[0.2em]">About</h2>
                </div>
                <div className="md:col-span-9">
                  <p className="text-base md:text-lg leading-[2.0] text-[#ccc] font-light whitespace-pre-wrap">
                    {work.about}
                  </p>
                </div>
              </div>
            )}

            {/* Concept */}
            {work.concept && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
                <div className="md:col-span-3">
                  <h2 className="text-xs text-[#555] uppercase tracking-[0.2em]">Concept</h2>
                </div>
                <div className="md:col-span-9">
                  <p className="text-base md:text-lg leading-[2.0] text-[#ccc] font-light whitespace-pre-wrap">
                    {work.concept}
                  </p>
                </div>
              </div>
            )}

            {/* Process（空欄なら非表示） */}
            {work.process && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
                <div className="md:col-span-3">
                  <h2 className="text-xs text-[#555] uppercase tracking-[0.2em]">Process</h2>
                </div>
                <div className="md:col-span-9">
                  <p className="text-base md:text-lg leading-[2.0] text-[#ccc] font-light whitespace-pre-wrap">
                    {work.process}
                  </p>
                </div>
              </div>
            )}

            {/* Client（空欄なら非表示） */}
            {work.client && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
                <div className="md:col-span-3">
                  <h2 className="text-xs text-[#555] uppercase tracking-[0.2em]">Client</h2>
                </div>
                <div className="md:col-span-9">
                  <p className="text-base md:text-lg leading-[2.0] text-white font-normal">
                    {work.client}
                  </p>
                </div>
              </div>
            )}

          </div>
        )}

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
        
        @keyframes pingSlow {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 0; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .animate-ping-slow {
          animation: pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        @keyframes pingSlower {
          0% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ping-slower {
          animation: pingSlower 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  )
}
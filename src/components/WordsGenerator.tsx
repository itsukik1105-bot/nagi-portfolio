import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface GeneratedStory {
  title: string
  body: string
}

export function WordsGenerator() {
  const [isVisible, setIsVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState('')
  const [story, setStory] = useState<GeneratedStory | null>(null)
  const [displayedWords, setDisplayedWords] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // スクロールでフローティングボタン表示
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      setIsVisible(scrollY > windowHeight * 0.5)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // モーダル開閉時のbody scroll制御
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // タイプライター効果
  useEffect(() => {
    if (!story || isGenerating) {
      setDisplayedWords('')
      return
    }

    setIsTyping(true)
    setDisplayedWords('')
    
    let index = 0
    const chars = [...story.body]
    
    const timer = setInterval(() => {
      if (index < chars.length) {
        setDisplayedWords(prev => prev + chars[index])
        index++
      } else {
        clearInterval(timer)
        setIsTyping(false)
      }
    }, 45)

    return () => clearInterval(timer)
  }, [story, isGenerating])

  const generateWords = async () => {
    if (!theme.trim()) {
      inputRef.current?.focus()
      return
    }

    setIsGenerating(true)
    setStory(null)
    setDisplayedWords('')

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 600,
          messages: [
            {
              role: 'user',
              content: `あなたは映像作家・脚本家nagiです。与えられたテーマから、nagiの作風で架空の物語の「タイトル」と「書き出し」を創作してください。

【nagiの代表作と世界観】
- 『ユリイカ』: 東京で生き急ぐカメラマンの青年と、南九州での過去の記憶。「何も映ってない」写真、見ること/見られることの構造。
- 『中古少女』: 東京という街を「新品」と「中古」で分ける視点。自己価値と他者からの承認。
- 『フィクション』: 夢と現実の境界が曖昧になる感覚。「夢かもしれない、全部」という不安。
- 『LOVEずっきゅん』: 妄想世界と現実世界の交錯。「空っぽのお人形さんみたい」な虚無感。

【nagiのタイトルの特徴】
- 短い（2〜6文字程度）
- カタカナ、ひらがな、漢字、英語のいずれか、または組み合わせ
- 抽象的、象徴的、詩的
- どこか寂しさや孤独感、または皮肉を感じさせる
- 例: 「ユリイカ」「中古少女」「フィクション」「LOVEずっきゅん」「残像」「透明人間」「夜行性」「空白の住人」

【nagiの文体の特徴】
- 具体的な時刻や場所から始める（「午前2時」「窓の外」「駅のホーム」）
- 五感の描写を入れる（光、音、温度、匂い）
- 主人公の内面へ静かに沈んでいく
- 短い文と長い文のリズム
- 「——」で余韻を残して終わる

【nagiの頻出モチーフ】
- カメラ、ファインダー、写真、シャッター
- 窓、ガラス、反射、映り込み
- 電車、線路、ホーム、終電
- 夜の街、ネオン、信号の光
- 鏡、化粧、仮面、ペルソナ
- 空っぽ、中古、二番目

【nagiの代表的なフレーズ（参考）】
- 「この東京という街に生きる人間は大きく分けて二つ。『新品』か『中古』かだ」
- 「ここは東京。この街では、止まることは死ぬことだと誰かが言った」
- 「なんていうか、『何も映ってない』んだよね」
- 「真っ暗だから、ちゃんと『見ようとしない』と見えない」
- 「綺麗に撮ろうとすると、大事なものが映らなくなったりするでしょう」
- 「夢かもしれない、全部。時々そう考えてぞっとすることがある」
- 「空っぽのお人形さんみたい」
- 「被写体がそこにいるのに、その人が見えてこない」

【テーマ】
${theme}

【出力形式】
以下の形式で、JSONのみを出力してください。説明や前置きは不要です。
{"title": "作品タイトル", "body": "物語の書き出し本文（3〜5文、最後は——で終わる）"}

【ルール】
- タイトルは2〜6文字程度、nagiらしい象徴的なもの
- 本文は物語の「書き出し」部分のみ（3〜5文程度）
- 主人公は「私」または「彼/彼女」
- 具体的な情景から始める（時間、場所、五感）
- テーマを直接言わず、空気感で表現する
- 最後は「——」で終わり、続きを想像させる

では、テーマ「${theme}」から物語を紡いでください。`
            }
          ]
        })
      })

      const data = await response.json()
      const generatedText = data.content
        ?.map((item: any) => (item.type === 'text' ? item.text : ''))
        .join('')
        .trim()

      // JSONをパース
      try {
        const parsed = JSON.parse(generatedText)
        setStory({
          title: parsed.title || '無題',
          body: parsed.body || '言葉が降りてこない夜もある。それでも私は、白い画面を見つめ続けていた——'
        })
      } catch {
        // JSONパースに失敗した場合はテキストをそのまま使用
        setStory({
          title: '断片',
          body: generatedText || '言葉が降りてこない夜もある。それでも私は、白い画面を見つめ続けていた——'
        })
      }
    } catch (error) {
      console.error('Generation error:', error)
      setStory({
        title: '沈黙',
        body: '言葉が降りてこない夜もある。それでも私は、白い画面を見つめ続けていた——'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isGenerating) {
      generateWords()
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setStory(null)
    setDisplayedWords('')
    setTheme('')
  }

  return (
    <>
      {/* フローティングボタン */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-40 group transition-all duration-700 ${
          isVisible && !isOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="relative flex items-center gap-3 px-5 py-3 bg-[#1a1a1a] backdrop-blur-sm border border-[#666] rounded-full hover:border-white hover:bg-[#222] transition-all duration-500">
          {/* 点滅するドット */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="text-[12px] tracking-[0.15em] text-white font-medium">
            Story
          </span>
        </div>
      </button>

      {/* モーダル */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 背景オーバーレイ */}
          <div 
            className="absolute inset-0 bg-black/98 backdrop-blur-sm animate-fade-in"
            onClick={handleClose}
          />
          
          {/* モーダルコンテンツ */}
          <div className="relative w-full max-w-[900px] max-h-[90vh] overflow-y-auto mx-4 animate-modal-in">
            
            {/* 閉じるボタン */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-10 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="px-6 py-16 md:py-24">
              {/* ヘッダー */}
              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent to-white/40" />
                  <span className="text-[11px] tracking-[0.5em] text-white/70 uppercase font-medium">Story Generator</span>
                  <div className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent to-white/40" />
                </div>
                <h2 className="text-3xl md:text-5xl font-light tracking-[0.1em] text-white">
                  物語は、ここから
                </h2>
              </div>

              {/* テーマ入力エリア */}
              <div className="mb-20">
                <label className="block text-[11px] tracking-[0.4em] text-white/70 uppercase mb-5 text-center font-medium">
                  Theme
                </label>
                <div className="relative max-w-[500px] mx-auto">
                  <input
                    ref={inputRef}
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="雨、別れ、夜明け、嘘、再会、窓..."
                    className="w-full bg-transparent border-b-2 border-white/30 focus:border-white py-5 text-center text-xl md:text-2xl text-white placeholder:text-white/30 focus:outline-none transition-all duration-500 tracking-wider selectable"
                    disabled={isGenerating}
                    autoFocus
                  />
                </div>
              </div>

              {/* 物語の表示エリア */}
              <div className="min-h-[220px] flex items-center justify-center mb-16 px-4">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex gap-2">
                      <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                      <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                      <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                    </div>
                    <span className="text-base tracking-[0.3em] text-white/80">物語を紡いでいます</span>
                  </div>
                ) : story ? (
                  <div className="max-w-[700px]">
                    {/* 本文 + タイトル */}
                    <p className="text-lg md:text-xl leading-[2.4] text-white/90 font-light whitespace-pre-wrap">
                      {displayedWords}
                      {isTyping && <span className="inline-block w-[2px] h-[1em] bg-white ml-1 animate-blink align-middle" />}
                      {!isTyping && story.title && (
                        <span className="text-white/50">『{story.title}』</span>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-base text-white/50 tracking-wider leading-relaxed">
                      テーマを入力して<br className="md:hidden" />物語の書き出しを紡いでください
                    </p>
                  </div>
                )}
              </div>

              {/* 紡ぐボタン */}
              <div className="flex justify-center">
                <button
                  onClick={generateWords}
                  disabled={isGenerating || !theme.trim()}
                  className="group relative px-14 py-5 rounded-full border-2 border-white/50 hover:border-white hover:bg-white/10 transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden"
                >
                  <span className="relative text-base tracking-[0.25em] text-white font-medium">
                    {isGenerating ? '紡いでいます...' : '紡ぐ'}
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in {
          animation: modalIn 0.4s ease-out forwards;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.8s infinite;
        }
      `}</style>
    </>
  )
}
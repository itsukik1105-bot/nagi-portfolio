import { useState, useEffect, useRef } from 'react'
import { ArrowDown } from 'lucide-react'

interface GeneratedStory {
  title: string
  body: string
}

export function WordsGenerator() {
  const [theme, setTheme] = useState('')
  const [story, setStory] = useState<GeneratedStory | null>(null)
  const [displayedWords, setDisplayedWords] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // スクロール検知
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const sectionTop = sectionRef.current.offsetTop
      const isSectionInView = scrollY + windowHeight > sectionTop + 100
      
      if (isSectionInView) {
        setIsVisible(false)
      } else {
        setIsVisible(scrollY > 300)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // タイプライター効果
  useEffect(() => {
    if (!story || isGenerating) {
      setDisplayedWords('')
      return
    }

    setIsTyping(true)
    setDisplayedWords('')
    
    const text = story.body || ''
    const chars = Array.from(text)
    let index = 0
    
    const timer = setInterval(() => {
      if (index < chars.length) {
        const char = chars[index]
        if (char !== undefined) {
          setDisplayedWords(prev => prev + char)
        }
        index++
      } else {
        clearInterval(timer)
        setIsTyping(false)
      }
    }, 30)

    return () => clearInterval(timer)
  }, [story, isGenerating])

  const scrollToGenerator = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => {
      inputRef.current?.focus()
    }, 800)
  }

  const generateWords = async () => {
    if (!theme.trim()) {
      inputRef.current?.focus()
      return
    }

    setIsGenerating(true)
    setStory(null)
    setDisplayedWords('')

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
      
      // APIキーの詳細なチェック
      if (!apiKey) {
        throw new Error('APIキー (.env) が見つかりません。')
      }
      if (apiKey === 'nagi-portfolio-api-key') {
        throw new Error('APIキーが初期設定（nagi-portfolio-api-key）のままです。.envファイルを正しいキーに書き換えてください。')
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true' 
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 600,
          messages: [
            {
              role: 'user',
              content: `あなたは映像作家・脚本家nagiです。テーマ「${theme}」から、nagiの作風で架空の物語の「タイトル」と「書き出し」を創作してください。

【nagiの世界観】
- 都会の孤独、深夜の静寂、ガラス越しの視点
- 抽象的で詩的な表現
- 「——」で余韻を残して終わる

【出力形式】
JSON形式のみを出力してください。
{"title": "タイトル", "body": "本文"}`
            }
          ]
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `HTTP Error: ${response.status}`
        
        // エラー詳細の解析
        if (response.status === 401) {
          errorMessage = '認証エラー (401): APIキーが無効です。'
        } else {
          try {
            const errorJson = JSON.parse(errorText)
            if (errorJson.error && errorJson.error.message) {
              errorMessage += ` - ${errorJson.error.message}`
            }
          } catch {
            errorMessage += ` - ${errorText}`
          }
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      // コンテンツ抽出
      let generatedText = ''
      if (data.content && Array.isArray(data.content)) {
        generatedText = data.content
          .filter((item: any) => item.type === 'text')
          .map((item: any) => item.text)
          .join('')
      }

      // JSON抽出
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : generatedText

      try {
        const parsed = JSON.parse(jsonString)
        setStory({
          title: parsed.title || '無題',
          body: parsed.body || generatedText
        })
      } catch (e) {
        setStory({
          title: '断片',
          body: generatedText.replace(/[\{\}"]/g, '')
        })
      }

    } catch (error: any) {
      console.error('Generation Error:', error)
      setStory({
        title: 'エラー発生',
        // エラー内容を画面に表示
        body: `[SYSTEM ERROR] ${error.message || '不明なエラーが発生しました。'}`
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

  return (
    <>
      <button
        onClick={scrollToGenerator}
        className={`fixed bottom-8 right-8 z-40 group transition-all duration-700 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="relative flex items-center gap-3 px-5 py-3 bg-[#1a1a1a] backdrop-blur-sm border border-[#666] rounded-full hover:border-white hover:bg-[#222] transition-all duration-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="text-[12px] tracking-[0.15em] text-white font-medium flex items-center gap-2">
            Story <ArrowDown className="w-3 h-3" />
          </span>
        </div>
      </button>

      <section 
        id="words-generator" 
        ref={sectionRef}
        className="py-32 px-6 bg-black border-t border-[#111] relative z-20"
      >
        <div className="max-w-[900px] mx-auto">
          
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent to-white/40" />
              <span className="text-[11px] tracking-[0.5em] text-white/70 uppercase font-medium">Story Generator</span>
              <div className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent to-white/40" />
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-[0.1em] text-white mb-4">
              物語は、ここから
            </h2>
          </div>

          <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-8 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none"></div>

            <div className="relative z-10 mb-16 text-center">
              <label className="block text-[10px] tracking-[0.4em] text-white/50 uppercase mb-4">
                Theme
              </label>
              <div className="relative max-w-[400px] mx-auto">
                <input
                  ref={inputRef}
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="雨、別れ、夜明け..."
                  className="w-full bg-transparent border-b border-[#333] focus:border-white py-3 text-center text-lg text-white placeholder:text-[#333] focus:outline-none transition-all duration-500 tracking-wider"
                  disabled={isGenerating}
                />
              </div>
            </div>

            <div className="relative z-10 min-h-[180px] flex items-center justify-center mb-12">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                  </div>
                  <span className="text-xs tracking-[0.2em] text-white/50">紡いでいます...</span>
                </div>
              ) : story ? (
                <div className="max-w-[600px] text-center">
                  <p className="text-base md:text-lg leading-[2.4] text-white/90 font-light whitespace-pre-wrap mb-4">
                    {displayedWords}
                    {isTyping && <span className="inline-block w-[1.5px] h-[1em] bg-white ml-1 animate-blink align-middle" />}
                  </p>
                  {!isTyping && story.title && (
                    <div className="text-xs tracking-[0.2em] text-white/40 mt-6 fade-in">
                      —— 『{story.title}』
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-[#333] tracking-widest text-center">
                  Enter a theme to generate a story.
                </p>
              )}
            </div>

            <div className="relative z-10 flex justify-center">
              <button
                onClick={generateWords}
                disabled={isGenerating || !theme.trim()}
                className="group relative px-10 py-3 rounded-full border border-[#333] hover:border-white hover:bg-white/5 transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="text-xs tracking-[0.2em] text-white">
                  {isGenerating ? 'GENERATING' : 'GENERATE'}
                </span>
              </button>
            </div>
          </div>

        </div>
      </section>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.8s infinite;
        }
        .fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  )
}
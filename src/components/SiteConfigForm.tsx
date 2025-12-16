import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'

export interface SiteConfig {
  heroVideoUrl: string
  siteName: string
  siteDescription: string
  contactEmail: string
  phone: string
  location: string
  social: {
    instagram: string
    vimeo: string
    twitter: string
  }
  about: {
    profileImage: string
    title: string
    subtitle: string
    bio: string[]
    experience: {
      position: string
      period: string
      company: string
    }[]
    skills: string[]
  }
}

interface SiteConfigFormProps {
  config: SiteConfig
  onSave: (config: SiteConfig) => void
  onCancel: () => void
}

export function SiteConfigForm({ config, onSave, onCancel }: SiteConfigFormProps) {
  const [formData, setFormData] = useState<SiteConfig>(config)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof SiteConfig, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSocialChange = (field: keyof SiteConfig['social'], value: string) => {
    setFormData(prev => ({
      ...prev,
      social: { ...prev.social, [field]: value }
    }))
  }

  const handleAboutChange = (field: keyof SiteConfig['about'], value: any) => {
    setFormData(prev => ({
      ...prev,
      about: { ...prev.about, [field]: value }
    }))
  }

  const handleBioChange = (index: number, value: string) => {
    const newBio = [...formData.about.bio]
    newBio[index] = value
    handleAboutChange('bio', newBio)
  }

  const addBioParagraph = () => {
    handleAboutChange('bio', [...formData.about.bio, ''])
  }

  const removeBioParagraph = (index: number) => {
    const newBio = formData.about.bio.filter((_, i) => i !== index)
    handleAboutChange('bio', newBio)
  }

  const handleExperienceChange = (index: number, field: keyof SiteConfig['about']['experience'][0], value: string) => {
    const newExperience = [...formData.about.experience]
    newExperience[index] = { ...newExperience[index], [field]: value }
    handleAboutChange('experience', newExperience)
  }

  const addExperience = () => {
    handleAboutChange('experience', [...formData.about.experience, { position: '', period: '', company: '' }])
  }

  const removeExperience = (index: number) => {
    const newExperience = formData.about.experience.filter((_, i) => i !== index)
    handleAboutChange('experience', newExperience)
  }

  const handleSkillsChange = (value: string) => {
    const skills = value.split(',').map(s => s.trim()).filter(s => s)
    handleAboutChange('skills', skills)
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={onCancel}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </Button>
          <h1 className="text-3xl text-white mb-2">サイト設定</h1>
          <p className="text-gray-400">サイトに表示される情報を編集できます</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本情報 */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">基本情報</CardTitle>
              <CardDescription className="text-gray-400">
                サイトの基本的な情報を設定します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName" className="text-white">サイト名 / アーティスト名</Label>
                <Input
                  id="siteName"
                  value={formData.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  placeholder="nagi"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="siteDescription" className="text-white">肩書き / 説明</Label>
                <Input
                  id="siteDescription"
                  value={formData.siteDescription}
                  onChange={(e) => handleChange('siteDescription', e.target.value)}
                  placeholder="Director & Editor"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-white">場所</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Tokyo, Japan"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* 動画設定 */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">ヒーロー背景動画</CardTitle>
              <CardDescription className="text-gray-400">
                トップページの背景動画URLを設定します（12:5の比率を推奨）
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="heroVideoUrl" className="text-white">動画URL</Label>
                <Input
                  id="heroVideoUrl"
                  value={formData.heroVideoUrl}
                  onChange={(e) => handleChange('heroVideoUrl', e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* 連絡先情報 */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">連絡先情報</CardTitle>
              <CardDescription className="text-gray-400">
                フッターに表示される連絡先情報
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contactEmail" className="text-white">メールアドレス</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="contact@example.com"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-white">電話番号</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+81 90-1234-5678"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* ソーシャルメディア */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">ソーシャルメディア</CardTitle>
              <CardDescription className="text-gray-400">
                SNSアカウントのリンクを設定します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="instagram" className="text-white">Instagram URL</Label>
                <Input
                  id="instagram"
                  value={formData.social.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/username"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
              </div>

              <div>
                <Label htmlFor="vimeo" className="text-white">Vimeo URL</Label>
                <Input
                  id="vimeo"
                  value={formData.social.vimeo}
                  onChange={(e) => handleSocialChange('vimeo', e.target.value)}
                  placeholder="https://vimeo.com/username"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
              </div>

              <div>
                <Label htmlFor="twitter" className="text-white">Twitter / X URL</Label>
                <Input
                  id="twitter"
                  value={formData.social.twitter}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/username"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Aboutページ設定 */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Aboutページ - 基本情報</CardTitle>
              <CardDescription className="text-gray-400">
                プロフィールページに表示される情報
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="profileImage" className="text-white">プロフィール画像URL</Label>
                <Input
                  id="profileImage"
                  value={formData.about.profileImage}
                  onChange={(e) => handleAboutChange('profileImage', e.target.value)}
                  placeholder="https://example.com/profile.jpg"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="aboutTitle" className="text-white">タイトル（名前）</Label>
                <Input
                  id="aboutTitle"
                  value={formData.about.title}
                  onChange={(e) => handleAboutChange('title', e.target.value)}
                  placeholder="nagi"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="aboutSubtitle" className="text-white">サブタイトル（肩書き）</Label>
                <Input
                  id="aboutSubtitle"
                  value={formData.about.subtitle}
                  onChange={(e) => handleAboutChange('subtitle', e.target.value)}
                  placeholder="Director & Editor"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* 自己紹介文 */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Aboutページ - 自己紹介文</CardTitle>
              <CardDescription className="text-gray-400">
                各段落を個別に編集できます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.about.bio.map((paragraph, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-white">段落 {index + 1}</Label>
                    {formData.about.bio.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBioParagraph(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <Textarea
                    value={paragraph}
                    onChange={(e) => handleBioChange(index, e.target.value)}
                    placeholder="自己紹介文を入力..."
                    className="bg-gray-800 border-gray-700 text-white min-h-24"
                    required
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addBioParagraph}
                className="w-full flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                段落を追加
              </Button>
            </CardContent>
          </Card>

          {/* 職歴 */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Aboutページ - 職歴</CardTitle>
              <CardDescription className="text-gray-400">
                経歴情報を管理します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.about.experience.map((exp, index) => (
                <div key={index} className="space-y-3 p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label className="text-white">職歴 {index + 1}</Label>
                    {formData.about.experience.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Input
                      value={exp.position}
                      onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                      placeholder="役職名（例: Senior Director）"
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                    <Input
                      value={exp.period}
                      onChange={(e) => handleExperienceChange(index, 'period', e.target.value)}
                      placeholder="期間（例: 2020 - Present）"
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                    <Input
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                      placeholder="会社名（例: Visual Creative Studio）"
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addExperience}
                className="w-full flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                職歴を追加
              </Button>
            </CardContent>
          </Card>

          {/* スキル */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Aboutページ - スキル</CardTitle>
              <CardDescription className="text-gray-400">
                スキルをカンマ区切りで入力してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="skills" className="text-white">スキル（カンマ区切り）</Label>
                <Textarea
                  id="skills"
                  value={formData.about.skills.join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  placeholder="Final Cut Pro, Adobe Premiere, DaVinci Resolve, Cinema 4D, After Effects"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  例: Final Cut Pro, Adobe Premiere, DaVinci Resolve
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 保存ボタン */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              保存
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

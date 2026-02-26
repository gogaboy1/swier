'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Upload, X, ArrowLeft } from 'lucide-react'

export default function SubmitPage() {
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    shortDescription: '',
    longDescription: '',
    geo: 'Russia',
    stage: 'pre-seed',
    tags: '',
    telegram: '',
    email: '',
    whatsapp: '',
    website: '',
    seekingInvestment: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/submit-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        alert('Failed to submit startup. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting startup:', error)
      alert('Failed to submit startup. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    let processedValue = value
    
    // Auto-add @ to Telegram username if not present
    if (name === 'telegram' && value && !value.startsWith('@')) {
      processedValue = '@' + value
    }
    
    // Auto-add https:// to website if not present
    if (name === 'website' && value && !value.startsWith('http://') && !value.startsWith('https://')) {
      processedValue = 'https://' + value
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setLogoPreview(base64String)
        setFormData({
          ...formData,
          logo: base64String
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoPreview('')
    setFormData({
      ...formData,
      logo: ''
    })
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-6">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push('/')}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Успешно отправлено!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Ваш стартап на модерации. Мы проверим его и опубликуем в ближайшее время!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-all font-semibold"
              >
                На главную
              </button>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setLogoPreview('')
                  setFormData({
                    name: '',
                    logo: '',
                    shortDescription: '',
                    longDescription: '',
                    geo: 'Russia',
                    stage: 'pre-seed',
                    tags: '',
                    telegram: '',
                    email: '',
                    whatsapp: '',
                    website: '',
                    seekingInvestment: false
                  })
                }}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 active:scale-95 transition-all font-semibold"
              >
                Добавить ещё
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/')}
            className="w-10 h-10 glass-button flex items-center justify-center text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Предложить стартап
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Название стартапа *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-5 py-3.5 bg-white/50 border border-gray-200/60 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder:text-gray-400"
              placeholder="Например: Swier"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Логотип
            </label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-sm border border-gray-100/50 group">
                  <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setLogoPreview('')
                      setFormData({ ...formData, logo: '' })
                    }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300/60 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all bg-white/30">
                  <Upload className="w-8 h-8 text-blue-500 mb-2" strokeWidth={2} />
                  <span className="text-sm font-medium text-gray-700">Нажмите для загрузки</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG до 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Краткое описание *
              <span className="text-xs font-medium text-gray-500 ml-2 font-normal">— Превью для карточки</span>
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              required
              maxLength={140}
              className="w-full px-5 py-3.5 bg-white/50 border border-gray-200/60 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder:text-gray-400"
              placeholder="Краткое описание вашего стартапа"
            />
            <p className="text-[11px] font-medium text-gray-400 mt-2 text-right">
              {formData.shortDescription.length}/140
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Полное описание *
            </label>
            <textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-5 py-3.5 bg-white/50 border border-gray-200/60 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder:text-gray-400 resize-none"
              placeholder="Подробное описание вашего стартапа, миссия, текущие результаты и т.д."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                География *
              </label>
              <select
                name="geo"
                value={formData.geo}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 bg-white/50 border border-gray-200/60 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-gray-900 font-medium appearance-none"
              >
                <option value="Russia">Россия</option>
                <option value="Worldwide">Весь мир</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Стадия *
              </label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 bg-white/50 border border-gray-200/60 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-gray-900 font-medium appearance-none"
              >
                <option value="idea">Идея</option>
                <option value="mvp">MVP</option>
                <option value="pre-seed">Pre-seed</option>
                <option value="seed">Seed</option>
                <option value="series-a">Series A</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Теги
            </label>
            <div className="flex flex-wrap gap-2">
              {['AI', 'SaaS', 'B2B', 'FinTech', 'EdTech', 'HealthTech', 'E-commerce', 'Marketplace', 'Crypto', 'Blockchain', 'Mobile', 'Web3', 'Gaming', 'Social', 'Analytics', 'Security'].map((tag) => {
                const isSelected = formData.tags.split(',').map(t => t.trim()).includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t)
                      if (isSelected) {
                        const newTags = currentTags.filter(t => t !== tag)
                        setFormData({ ...formData, tags: newTags.join(', ') })
                      } else {
                        const newTags = [...currentTags, tag]
                        setFormData({ ...formData, tags: newTags.join(', ') })
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? 'bg-blue-500 text-white shadow-md border border-blue-400'
                        : 'bg-white/50 border border-gray-200/60 text-gray-700 hover:border-blue-300 hover:bg-white/80'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="flex items-start gap-4 p-5 bg-white/60 border border-emerald-500/30 rounded-2xl cursor-pointer hover:bg-emerald-50/50 transition-colors group">
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  checked={formData.seekingInvestment}
                  onChange={(e) => setFormData({ ...formData, seekingInvestment: e.target.checked })}
                  className="w-5 h-5 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500/50 transition-all"
                />
              </div>
              <div className="flex-1">
                <span className="block text-[15px] font-bold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">💰 Ищем инвестиции</span>
                <span className="block text-sm text-gray-600 font-medium leading-relaxed">Отметьте, если ваш стартап ищет финансирование. На карточке появится специальный значок.</span>
              </div>
            </label>
          </div>

          <div className="pt-6 border-t border-gray-200/50 space-y-5">
            <h3 className="text-lg font-bold text-gray-900">Контакты и ссылки</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">Telegram</label>
              <input
                type="text"
                name="telegram"
                value={formData.telegram}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white/50 border border-gray-200/60 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                placeholder="@username"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white/50 border border-gray-200/60 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                placeholder="contact@startup.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">Веб-сайт</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white/50 border border-gray-200/60 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                placeholder="https://startup.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-[0_8px_30px_rgb(59,130,246,0.3)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Отправка...
              </>
            ) : (
              'Предложить стартап'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

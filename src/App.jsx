import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, ChevronLeft, ChevronRight, Volume2, Star, Sparkles, BookOpen, Heart, Menu, X, Home, Trophy, Globe } from 'lucide-react'
import { stotras, getTodaysStora } from './data/stotras'
import './App.css'

// Hindi explanations for kids
const hindiExplanations = {
  1: "कल्पना करो कि प्यार से झुकने वाले देवताओं के मुकुटों पर चमकते हुए रत्न हैं! उनका प्रकाश सारे अंधकार को दूर कर देता है। भगवान आदिनाथ के चरण एक मजबूत रस्सी की तरह हैं जो समुद्र में डूबते लोगों को बचाती है।",
  2: "स्वर्ग के सबसे बुद्धिमान देवता भगवान आदिनाथ की सुंदर गीतों से स्तुति करते हैं! उनके गीत इतने अद्भुत हैं कि तीनों लोकों में सभी उन्हें सुनना पसंद करते हैं।",
  3: "भले ही मैं बहुत बुद्धिमान नहीं हूं, जब मैं भगवान आदिनाथ की स्तुति करने की कोशिश करता हूं, तो सुंदर शब्द जादू की तरह बहने लगते हैं!",
  4: "भगवान आदिनाथ में इतने अच्छे गुण हैं - एक अंतहीन समुद्र की तरह! स्वर्ग का सबसे बुद्धिमान शिक्षक भी उन सबका वर्णन नहीं कर सकता।",
  5: "भले ही मैं इसमें बहुत अच्छा नहीं हूं, भगवान आदिनाथ के लिए मेरा प्यार मुझे कोशिश करने के लिए प्रेरित करता है! जैसे एक मां हिरणी अपने बच्चे की रक्षा के लिए बहादुरी से शेर का सामना करती है।",
  6: "मुझे ज्यादा कुछ नहीं पता और बुद्धिमान लोग मुझ पर हंस सकते हैं। लेकिन भगवान आदिनाथ के लिए मेरा प्यार मुझे गाने के लिए मजबूर करता है!",
  7: "जब हम भगवान आदिनाथ की स्तुति करते हैं, तो हमने जो भी बुरे काम किए हैं वे जल्दी से गायब हो जाते हैं - जादू की तरह!",
  8: "भगवान आदिनाथ की मदद से, मुझ जैसा कोई भी सुंदर स्तुति लिख सकता है! यह कमल के पत्ते पर एक छोटी पानी की बूंद की तरह है जो मोती जैसी चमकदार हो जाती है!",
  9: "भगवान आदिनाथ की स्तुति करने से हमारी सभी गलतियां दूर हो जाती हैं! उनके बारे में बात करना भी सभी की मदद करता है!",
  10: "जब हम सच्चे दिल से भगवान आदिनाथ की स्तुति करते हैं, तो हम उनके जैसे बन सकते हैं! भगवान आदिनाथ हमारे साथ अपनी अच्छाई साझा करते हैं!",
  11: "एक बार जब आप भगवान आदिनाथ को देख लेते हैं, तो आप देखना बंद नहीं कर सकते - वे बहुत सुंदर हैं!",
  12: "भगवान आदिनाथ विशेष, शांतिपूर्ण, चमकते परमाणुओं से बने थे! पूरे ब्रह्मांड में कोई और उनके जितना अद्भुत नहीं दिखता!",
  13: "भगवान आदिनाथ का चेहरा इतना सुंदर है कि हर कोई उसे देखना बंद नहीं कर सकता! उनके चेहरे की तुलना में, चांद भी पीला दिखता है!",
  14: "भगवान आदिनाथ के अच्छे गुण पूर्णिमा से भी अधिक चमकते हैं! जो कोई भी उनकी शरण लेता है वह जहां चाहे जा सकता है!",
  15: "सबसे सुंदर देवदूतियां भी भगवान आदिनाथ को विचलित नहीं कर सकीं! उनका मन पूरी तरह शांत रहा।",
  16: "भगवान आदिनाथ का चेहरा सबसे सुंदर चांद की तरह चमकता है - कोई दीपक या असली चांद भी इसकी तुलना नहीं कर सकता!",
  17: "कुछ लोगों ने भगवान आदिनाथ से कई जन्मों से प्यार किया है! उनके लिए, भगवान के बारे में सुंदर शब्द सुनना सबसे अच्छा उपहार है!",
  18: "भगवान आदिनाथ के शब्द इतने शक्तिशाली और सुंदर हैं कि उन्हें किसी सजावट की जरूरत नहीं है! वे पहले से ही परिपूर्ण हैं!",
  19: "भगवान आदिनाथ को देखने के बाद, विष्णु और शिव जैसे अन्य महान देवता भी कम अद्भुत लगते हैं!",
  20: "भगवान आदिनाथ अतिरिक्त विशेष हैं - देवता, मनुष्य और सिद्ध सभी उनकी पूजा करते हैं क्योंकि वे सभी को मुक्त होने में मदद कर सकते हैं!",
  21: "बुद्धिमान ऋषि कहते हैं कि भगवान आदिनाथ एक चमकदार सूरज की तरह हैं - शुद्ध और सभी अंधकार से परे!",
  22: "अच्छे लोग भगवान आदिनाथ का कई तरह से वर्णन करते हैं: वे कभी नहीं बदलते, वे हर जगह हैं, और वे शुद्ध ज्ञान हैं!",
  23: "भगवान आदिनाथ को बुद्ध कहा जाता है क्योंकि देवता उनकी बुद्धि की पूजा करते हैं! वे वास्तव में सबसे महान व्यक्ति हैं!",
  24: "मैं भगवान आदिनाथ को प्रणाम करता हूं जो सबके दुख दूर करते हैं! मैं सभी लोकों के सबसे बड़े स्वामी को प्रणाम करता हूं!",
  25: "भगवान आदिनाथ अच्छे गुणों से इतने भरे हुए हैं कि किसी बुरी चीज के लिए कोई जगह नहीं है!",
  26: "भगवान आदिनाथ एक सुंदर अशोक के पेड़ के नीचे बैठते हैं और प्रकाश से चमकते हैं!",
  27: "भगवान आदिनाथ का शरीर शुद्ध सोने की तरह चमकता है! उनके चारों ओर सुंदर सफेद पंखे लहराते हैं!",
  28: "भगवान आदिनाथ के ऊपर तीन सुंदर छत्र तैरते हैं जो सबको बताते हैं कि वे तीनों लोकों के राजा हैं!",
  29: "भगवान आदिनाथ के लिए आकाश में जादुई ढोल बजते हैं! उनकी गहरी आवाजें हर दिशा में भर जाती हैं!",
  30: "भगवान आदिनाथ के शाही दरबार में आकाश से जादुई फूलों की वर्षा होती है!",
  31: "यहां तक कि देवताओं के राजा इंद्र और अन्य सभी देवता भी भगवान आदिनाथ को प्रणाम करते हैं!",
  32: "कमल जैसी आंखों वाली सुंदर देवदूतियां भगवान आदिनाथ की सेवा करती हैं, ठंडे पंखे लहराती हैं!",
  33: "भगवान आदिनाथ की भुजाएं कपूर की तरह शुद्ध सफेद हैं! जब मैं उन्हें प्रणाम करता हूं, तो मेरी सारी गलतियां भाग जाती हैं!",
  34: "भगवान आदिनाथ एक भव्य सिंहासन पर बैठते हैं और लहराते पंखों की रोशनी से चमकते हैं!",
  35: "भगवान आदिनाथ का सुंदर कमल जैसा चेहरा हमेशा मेरे दिल में चमके और कभी न जाए - सपनों में भी!",
  36: "मुझे भगवान आदिनाथ की स्तुति करने में शर्म नहीं आती भले ही मैं इसमें बहुत अच्छा नहीं हूं!",
  37: "भगवान आदिनाथ के लिए मेरा प्यार मुझे उनकी स्तुति करने के लिए मजबूर करता है!",
  38: "भगवान आदिनाथ के लिए थोड़ा सा प्यार भी बड़े प्यार के बराबर है! कृपया मेरी छोटी भेंट स्वीकार करें!",
  39: "मैंने भगवान आदिनाथ के लिए उनके अद्भुत गुणों से बुनी हुई प्रशंसाओं की एक सुंदर माला बनाई!",
  40: "मैंने ये प्रशंसाएं अपने पूरे दिल से भगवान आदिनाथ को खुश करने के लिए लिखीं! हमेशा के लिए भगवान के साथ मित्र!",
  41: "अगर आप हर दिन प्यार से भगवान आदिनाथ की इन स्तुतियों को पढ़ते हैं, तो अद्भुत चीजें होती हैं!",
  42: "इस विशेष भजन को स्वर्ग के जादुई प्राणियों द्वारा आशीर्वाद दिया गया है!",
  43: "जो लोग हर दिन मुस्कान के साथ खुशी से इन सुंदर स्तुतियों को पढ़ते हैं उन्हें अद्भुत उपहार मिलते हैं!",
  44: "मैं भगवान आदिनाथ के चरणों को प्रणाम करता हूं - वे समय की शुरुआत से डूबते लोगों को बचाते आ रहे हैं!",
  45: "जो लोग हर शाम भगवान आदिनाथ की पूजा करते हैं वे सभी डरावनी चीजों से मुक्त हो जाएंगे!",
  46: "अगर आप हमेशा रहने वाली खुशी चाहते हैं तो भगवान आदिनाथ की इन स्तुतियों को गाएं!",
  47: "हम भगवान ऋषभ की पूजा करते हैं जो सूरज की तरह चमकते हैं! वे शुद्ध हैं और सभी को अद्भुत आशीर्वाद देते हैं!",
  48: "यह विशेष भक्तामर प्रार्थना बुद्धिमान ऋषि मानतुंग द्वारा लिखी गई थी! ये जादुई शब्द सभी को आशीर्वाद देते हैं!"
}

function App() {
  const [currentStotra, setCurrentStotra] = useState(() => {
    const saved = localStorage.getItem('lastViewedStotra')
    return saved ? stotras.find(s => s.id === parseInt(saved)) || stotras[0] : stotras[0]
  })
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en'
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [showMeaning, setShowMeaning] = useState(false)
  const [completedDays, setCompletedDays] = useState(() => {
    const saved = localStorage.getItem('completedDays')
    return saved ? JSON.parse(saved) : []
  })
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('streak')
    return saved ? parseInt(saved) : 0
  })
  const [showCelebration, setShowCelebration] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [activeTab, setActiveTab] = useState('learn')
  const audioRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('completedDays', JSON.stringify(completedDays))
  }, [completedDays])

  useEffect(() => {
    localStorage.setItem('streak', streak.toString())
  }, [streak])

  useEffect(() => {
    localStorage.setItem('lastViewedStotra', currentStotra.id.toString())
  }, [currentStotra])

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(lang => lang === 'en' ? 'hi' : 'en')
  }

  const getKidsExplanation = () => {
    if (language === 'hi' && hindiExplanations[currentStotra.id]) {
      return hindiExplanations[currentStotra.id]
    }
    return currentStotra.forKids
  }

  const goToStotra = (id) => {
    const stotra = stotras.find(s => s.id === id) || stotras[0]
    setCurrentStotra(stotra)
    setShowMeaning(false)
    setIsPlaying(false)
    setShowSidebar(false)
  }

  const nextStotra = () => {
    const nextId = currentStotra.id >= 48 ? 1 : currentStotra.id + 1
    goToStotra(nextId)
  }

  const prevStotra = () => {
    const prevId = currentStotra.id <= 1 ? 48 : currentStotra.id - 1
    goToStotra(prevId)
  }

  const markComplete = () => {
    if (!completedDays.includes(currentStotra.id)) {
      setCompletedDays([...completedDays, currentStotra.id])
      setStreak(s => s + 1)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }

  const playAudio = async () => {
    setIsPlaying(true)
    const text = getKidsExplanation()

    // For Hindi, use browser TTS (better Hindi support)
    // For English, try NVIDIA audio first, then fallback to browser TTS
    if (language === 'hi') {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'hi-IN'
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)
      speechSynthesis.speak(utterance)
      return
    }

    // English - try NVIDIA audio first
    const audioPath = `${import.meta.env.BASE_URL}audio/stotra_${currentStotra.id}.wav`

    try {
      if (audioRef.current) {
        audioRef.current.src = audioPath
        await audioRef.current.play()
        audioRef.current.onended = () => setIsPlaying(false)
        audioRef.current.onerror = () => {
          // Fallback to Web Speech API
          const utterance = new SpeechSynthesisUtterance(text)
          utterance.lang = 'en-US'
          utterance.rate = 0.85
          utterance.pitch = 1.1
          utterance.onend = () => setIsPlaying(false)
          speechSynthesis.speak(utterance)
        }
      }
    } catch (e) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.85
      utterance.pitch = 1.1
      utterance.onend = () => setIsPlaying(false)
      speechSynthesis.speak(utterance)
    }
  }

  const stopAudio = () => {
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    speechSynthesis.cancel()
  }

  const progressPercent = Math.round((completedDays.length / 48) * 100)

  return (
    <div className="app">
      <audio ref={audioRef} />

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="celebration-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="confetti-container">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="confetti-piece"
                  initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
                  animate={{
                    y: window.innerHeight + 100,
                    x: (Math.random() - 0.5) * 400,
                    rotate: Math.random() * 720 - 360,
                    opacity: 0
                  }}
                  transition={{ duration: 2.5 + Math.random(), ease: "easeOut" }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][Math.floor(Math.random() * 7)],
                    width: Math.random() * 10 + 5,
                    height: Math.random() * 10 + 5,
                  }}
                />
              ))}
            </div>
            <motion.div
              className="celebration-content"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            >
              <div className="celebration-icon">🎉</div>
              <h2>Wonderful!</h2>
              <p>Verse {currentStotra.id} Complete!</p>
              <div className="celebration-stats">
                <div className="celebration-stat">
                  <Star fill="#FFD700" color="#FFD700" size={20} />
                  <span>{completedDays.length}/48</span>
                </div>
                <div className="celebration-stat fire">
                  <span>🔥</span>
                  <span>{streak} Day Streak</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div
              className="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
            />
            <motion.aside
              className="sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="sidebar-header">
                <h2>All Verses</h2>
                <button className="close-btn" onClick={() => setShowSidebar(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="sidebar-progress">
                <div className="sidebar-progress-bar">
                  <div className="sidebar-progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="verse-list">
                {stotras.map((s) => (
                  <button
                    key={s.id}
                    className={`verse-item ${currentStotra.id === s.id ? 'active' : ''} ${completedDays.includes(s.id) ? 'completed' : ''}`}
                    onClick={() => goToStotra(s.id)}
                  >
                    <span className="verse-item-num">{s.id}</span>
                    <span className="verse-item-theme">{s.theme}</span>
                    {completedDays.includes(s.id) && <Star size={14} fill="#10b981" color="#10b981" />}
                  </button>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button className="menu-btn" onClick={() => setShowSidebar(true)}>
            <Menu size={24} />
          </button>
          <div className="brand">
            <span className="brand-icon">🙏</span>
            <div className="brand-text">
              <h1>Bhaktamar</h1>
              <span className="brand-subtitle">48 Sacred Verses</span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button className="lang-toggle" onClick={toggleLanguage}>
            <Globe size={16} />
            <span>{language === 'en' ? 'EN' : 'हि'}</span>
          </button>
          <div className="header-stat">
            <div className="stat-circle">
              <svg viewBox="0 0 36 36">
                <path
                  className="stat-circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stat-circle-fill"
                  strokeDasharray={`${progressPercent}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="stat-circle-text">{completedDays.length}</span>
            </div>
          </div>
          <div className="header-stat streak-stat">
            <span className="streak-icon">🔥</span>
            <span className="streak-num">{streak}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.article
            key={currentStotra.id}
            className="verse-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Verse Header */}
            <div className="verse-header">
              <div className="verse-number-badge">
                <span className="verse-number-label">Verse</span>
                <span className="verse-number-value">{currentStotra.id}</span>
                <span className="verse-number-total">of 48</span>
              </div>
              <div className="verse-meta">
                <span className="verse-theme" style={{ '--theme-color': currentStotra.color }}>
                  {currentStotra.theme}
                </span>
                {completedDays.includes(currentStotra.id) && (
                  <span className="verse-completed-badge">
                    <Star size={14} fill="currentColor" /> Learned
                  </span>
                )}
              </div>
            </div>

            {/* Sanskrit Section */}
            <section className="content-section sanskrit-section">
              <div className="section-header">
                <BookOpen size={18} />
                <h3>Sanskrit</h3>
              </div>
              <div className="sanskrit-content">
                <p>{currentStotra.sanskrit}</p>
              </div>
            </section>

            {/* Transliteration */}
            <section className="content-section transliteration-section">
              <div className="section-header">
                <Volume2 size={18} />
                <h3>How to Pronounce</h3>
              </div>
              <div className="transliteration-content">
                <p>{currentStotra.transliteration}</p>
              </div>
            </section>

            {/* Audio Player */}
            <div className="audio-player">
              <motion.button
                className={`audio-btn ${isPlaying ? 'playing' : ''}`}
                onClick={isPlaying ? stopAudio : playAudio}
                whileTap={{ scale: 0.95 }}
              >
                <div className="audio-btn-icon">
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </div>
                <div className="audio-btn-text">
                  <span className="audio-btn-label">{isPlaying ? (language === 'en' ? 'Pause' : 'रुकें') : (language === 'en' ? 'Listen' : 'सुनें')}</span>
                  <span className="audio-btn-sub">{language === 'en' ? 'AI Voice' : 'आवाज़'}</span>
                </div>
                {isPlaying && (
                  <div className="audio-waves">
                    <span></span><span></span><span></span><span></span>
                  </div>
                )}
              </motion.button>
            </div>

            {/* Meaning Section */}
            <section className="content-section meaning-section">
              <motion.button
                className={`meaning-toggle ${showMeaning ? 'active' : ''}`}
                onClick={() => setShowMeaning(!showMeaning)}
                whileTap={{ scale: 0.98 }}
              >
                <Heart size={20} fill={showMeaning ? 'currentColor' : 'none'} />
                <span>{showMeaning ? (language === 'en' ? 'Hide Explanation' : 'व्याख्या छुपाएं') : (language === 'en' ? 'What Does It Mean?' : 'इसका क्या अर्थ है?')}</span>
                <ChevronRight size={20} className={`toggle-arrow ${showMeaning ? 'open' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {showMeaning && (
                  <motion.div
                    className="meaning-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="meaning-inner">
                      <div className="meaning-kids">
                        <div className="meaning-kids-header">
                          <span className="meaning-kids-icon">✨</span>
                          <h4>{language === 'en' ? 'Simple Explanation' : 'सरल व्याख्या'}</h4>
                        </div>
                        <p>{getKidsExplanation()}</p>
                      </div>
                      <div className="meaning-full">
                        <h4>Full Translation</h4>
                        <p>{currentStotra.meaning}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Complete Button */}
            {!completedDays.includes(currentStotra.id) && (
              <motion.button
                className="complete-btn"
                onClick={markComplete}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles size={20} />
                <span>I've Learned This Verse!</span>
              </motion.button>
            )}
          </motion.article>
        </AnimatePresence>

        {/* Navigation */}
        <nav className="verse-nav">
          <motion.button
            className="nav-btn prev-btn"
            onClick={prevStotra}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </motion.button>

          <div className="nav-indicator">
            <span>{currentStotra.id}</span>
            <span className="nav-separator">/</span>
            <span>48</span>
          </div>

          <motion.button
            className="nav-btn next-btn"
            onClick={nextStotra}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Next</span>
            <ChevronRight size={20} />
          </motion.button>
        </nav>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="bottom-nav">
        <button className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => { setActiveTab('home'); goToStotra(1) }}>
          <Home size={20} />
          <span>Home</span>
        </button>
        <button className={`bottom-nav-item ${activeTab === 'learn' ? 'active' : ''}`} onClick={() => setActiveTab('learn')}>
          <BookOpen size={20} />
          <span>Learn</span>
        </button>
        <button className={`bottom-nav-item ${activeTab === 'progress' ? 'active' : ''}`} onClick={() => { setActiveTab('progress'); setShowSidebar(true) }}>
          <Trophy size={20} />
          <span>Progress</span>
        </button>
      </nav>
    </div>
  )
}

export default App

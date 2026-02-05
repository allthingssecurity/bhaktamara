import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, ChevronLeft, ChevronRight, Volume2, Star, Sparkles, BookOpen, Heart, Menu, X, Home, Trophy, Settings } from 'lucide-react'
import { stotras, getTodaysStora } from './data/stotras'
import './App.css'

function App() {
  const [currentStotra, setCurrentStotra] = useState(() => {
    const saved = localStorage.getItem('lastViewedStotra')
    return saved ? stotras.find(s => s.id === parseInt(saved)) || stotras[0] : stotras[0]
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
    const audioPath = `${import.meta.env.BASE_URL}audio/stotra_${currentStotra.id}.wav`

    try {
      if (audioRef.current) {
        audioRef.current.src = audioPath
        await audioRef.current.play()
        audioRef.current.onended = () => setIsPlaying(false)
        audioRef.current.onerror = () => {
          // Fallback to Web Speech API
          const utterance = new SpeechSynthesisUtterance(currentStotra.forKids)
          utterance.rate = 0.85
          utterance.pitch = 1.1
          utterance.onend = () => setIsPlaying(false)
          speechSynthesis.speak(utterance)
        }
      }
    } catch (e) {
      const utterance = new SpeechSynthesisUtterance(currentStotra.forKids)
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
                  <span className="audio-btn-label">{isPlaying ? 'Pause' : 'Listen'}</span>
                  <span className="audio-btn-sub">AI Voice</span>
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
                <span>{showMeaning ? 'Hide Explanation' : 'What Does It Mean?'}</span>
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
                          <h4>Simple Explanation</h4>
                        </div>
                        <p>{currentStotra.forKids}</p>
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

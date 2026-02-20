import { useState, useCallback, useEffect } from 'react';
import './App.css';

// Services
import { proviaStore } from './services/localStore';
import type { ProviaProfile } from './services/localStore';

// Data
import { getTopicForDay } from './data/daySchedule';

// Components
import { AuthorityPicker } from './features/onboarding/pages/AuthorityPicker';
import type { Authority } from './features/onboarding/types/onboarding.types';
import { DailyQuestions } from './features/questions/pages/DailyQuestions';
import { StreakCounter } from './features/progress/components/StreakCounter';
import { StatsCard } from './features/progress/components/StatsCard';
import { Leaderboard } from './features/social/pages/Leaderboard';
import { Achievements } from './features/social/pages/Achievements';
import { OpponentSelect } from './features/battle/pages/OpponentSelect';
import { BattleArena } from './features/battle/pages/BattleArena';
import { ChatPage } from './features/battle/pages/ChatPage';
import type { Opponent } from './features/battle/data/battle.data';
import { getLevelForXP, getXPProgress } from './features/social/data/social.data';

type AppPage =
  | 'mode_select'
  | 'authority'
  | 'dashboard'
  | 'quiz'
  | 'mock_center'
  | 'mock_quiz'
  | 'leaderboard'
  | 'achievements'
  | 'battle_select'
  | 'battle_arena'
  | 'chat'
  | 'cooldown';

function App() {
  const [profile, setProfile] = useState<ProviaProfile>(() => proviaStore.getProfile());
  const [page, setPage] = useState<AppPage>(() => {
    const p = proviaStore.getProfile();
    if (!p.territory) return 'authority';
    if (!p.selectedMode) return 'mode_select';
    return 'dashboard';
  });
  const [quizDay, setQuizDay] = useState(1);
  const [battleOpponent, setBattleOpponent] = useState<Opponent | null>(null);
  const [cooldownMs, setCooldownMs] = useState(0);

  // Cooldown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = proviaStore.getCooldownRemaining();
      setCooldownMs(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useCallback((p: AppPage) => setPage(p), []);

  const refreshProfile = useCallback(() => {
    setProfile(proviaStore.getProfile());
  }, []);

  // Level system still uses HC as the "xp" for display
  const level = getLevelForXP(profile.heroCredits);
  const hcProgress = getXPProgress(profile.heroCredits);

  // ─── AUTHORITY PICKER ───
  if (page === 'authority') {
    return (
      <AuthorityPicker
        selected={profile.territory ? {
          id: profile.territory,
          name: profile.territory,
          flag: '🇦🇪',
          fullName: profile.territory,
          emoji: '🏥',
          color: '#2563eb',
        } : null}
        onSelect={(a: Authority) => {
          proviaStore.updateProfile({ territory: a.id });
          refreshProfile();
        }}
        onContinue={() => {
          navigate('mode_select');
        }}
      />
    );
  }

  // ─── MODE SELECTOR ───
  if (page === 'mode_select') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#1e293b',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💊</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
            Provia
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2.5rem' }}>
            Your 45-Day Pharmacist Exam Challenge
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button onClick={() => {
              proviaStore.updateProfile({ selectedMode: 'challenge' });
              refreshProfile();
              navigate('dashboard');
            }} style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff', border: 'none', borderRadius: '1rem',
              cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🗺️</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>45-Day Challenge</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>
                Master one topic per day. Score 80%+ to unlock the next day.
              </div>
            </button>

            <button onClick={() => {
              proviaStore.updateProfile({ selectedMode: 'mock_center' });
              refreshProfile();
              navigate('mock_center');
            }} style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #ea580c, #c2410c)',
              color: '#fff', border: 'none', borderRadius: '1rem',
              cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 4px 15px rgba(234, 88, 12, 0.3)',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📝</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Mock Test Center</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>
                Take 120-question mock exams. 2 free tests, then 100 HC each.
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── MOCK TEST CENTER ───
  if (page === 'mock_center') {
    const mockStatus = proviaStore.canTakeMockTest(profile);
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#1e293b',
        padding: '1.5rem',
      }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <button onClick={() => navigate('dashboard')} style={{
              background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.5rem',
            }}>←</button>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a' }}>📝 Mock Test Center</h2>
          </div>

          {/* HC Balance */}
          <div style={{
            background: '#ffffff', borderRadius: '0.85rem', padding: '1rem',
            marginBottom: '1rem', border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Hero Credits</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>
                  💰 {profile.heroCredits} HC
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Free Tests</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e' }}>
                  🎟️ {profile.freeMocksRemaining}
                </div>
              </div>
            </div>
          </div>

          {/* Mock Test History */}
          {profile.mockTestScores.length > 0 && (
            <div style={{
              background: '#ffffff', borderRadius: '0.85rem', padding: '1rem',
              marginBottom: '1rem', border: '1px solid #e2e8f0',
            }}>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                Previous Scores
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {profile.mockTestScores.map((score, i) => (
                  <span key={i} style={{
                    padding: '0.3rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600,
                    background: score >= 80 ? '#f0fdf4' : '#fef2f2',
                    color: score >= 80 ? '#15803d' : '#b91c1c',
                    border: `1px solid ${score >= 80 ? '#bbf7d0' : '#fecaca'}`,
                  }}>
                    Mock #{i + 1}: {score}%
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Start Mock Test Button */}
          <button
            onClick={() => {
              if (mockStatus.canTake) {
                const updatedProfile = proviaStore.startMockTest(profile);
                setProfile(updatedProfile);
                navigate('mock_quiz');
              }
            }}
            disabled={!mockStatus.canTake}
            style={{
              width: '100%', padding: '1rem',
              background: mockStatus.canTake ? 'linear-gradient(135deg, #ea580c, #c2410c)' : '#cbd5e1',
              color: '#fff', border: 'none', borderRadius: '0.75rem',
              fontSize: '1rem', fontWeight: 700,
              cursor: mockStatus.canTake ? 'pointer' : 'not-allowed',
              boxShadow: mockStatus.canTake ? '0 4px 15px rgba(234, 88, 12, 0.3)' : 'none',
              marginBottom: '0.5rem',
            }}
          >
            📝 Start Mock Test (120 Questions)
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#64748b' }}>
            {mockStatus.reason}
          </p>
        </div>
      </div>
    );
  }

  // ─── MOCK QUIZ ───
  if (page === 'mock_quiz') {
    return (
      <DailyQuestions
        day={-1}
        isMockTest={true}
        onComplete={(score, total) => {
          const pct = Math.round((score / total) * 100);
          proviaStore.completeMockTest(pct);
          refreshProfile();
          navigate('mock_center');
        }}
        onBack={() => navigate('mock_center')}
      />
    );
  }

  // ─── QUIZ ───
  if (page === 'quiz') {
    // Check cooldown
    if (cooldownMs > 0 && profile.lastFailedDay === quizDay) {
      const mins = Math.floor(cooldownMs / 60000);
      const secs = Math.floor((cooldownMs % 60000) / 1000);
      const topic = getTopicForDay(quizDay);
      return (
        <div style={{
          minHeight: '100vh',
          background: '#f8fafc',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          color: '#1e293b',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '2rem', textAlign: 'center',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏳</div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.5rem' }}>
            Cooldown Active
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            You scored below 80% on Day {quizDay}. Review <strong>{topic.topic}</strong> before retrying.
          </p>
          <div style={{
            fontSize: '2.5rem', fontWeight: 800, color: '#0f172a',
            marginBottom: '2rem', fontVariantNumeric: 'tabular-nums',
          }}>
            {mins}:{secs.toString().padStart(2, '0')}
          </div>

          {topic.subtopic && (
            <div style={{
              background: '#eff6ff', borderRadius: '0.75rem', padding: '1rem',
              marginBottom: '1.5rem', maxWidth: '350px', width: '100%',
              border: '1px solid #dbeafe',
            }}>
              <p style={{ fontWeight: 600, fontSize: '0.8rem', color: '#2563eb', marginBottom: '0.25rem' }}>
                📚 Topics to review:
              </p>
              <p style={{ fontSize: '0.8rem', color: '#334155' }}>
                {topic.topic} — {topic.subtopic}
              </p>
            </div>
          )}

          <button onClick={() => navigate('dashboard')} style={{
            padding: '0.75rem 2rem', background: '#f1f5f9', color: '#64748b',
            border: '1px solid #e2e8f0', borderRadius: '0.75rem',
            fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
          }}>
            ← Back to Dashboard
          </button>
        </div>
      );
    }

    return (
      <DailyQuestions
        day={quizDay}
        onComplete={(score, total) => {
          const pct = Math.round((score / total) * 100);
          const result = proviaStore.completeDay(quizDay, pct);
          setProfile(result.profile);

          if (result.passed) {
            navigate('dashboard');
          } else {
            // Cooldown starts — navigate to cooldown view
            setCooldownMs(proviaStore.getCooldownRemaining());
            navigate('quiz'); // Stay on quiz page to show cooldown
          }
        }}
        onBack={() => navigate('dashboard')}
      />
    );
  }

  // ─── LEADERBOARD ───
  if (page === 'leaderboard') {
    return (
      <Leaderboard
        currentUserXP={profile.heroCredits}
        currentUserName={profile.displayName}
        currentUserStreak={profile.streakCount}
        currentUserDays={profile.completedDays.length}
        currentUserLevel={level.level}
        onBack={() => navigate('dashboard')}
      />
    );
  }

  // ─── ACHIEVEMENTS ───
  if (page === 'achievements') {
    return <Achievements unlockedIds={profile.unlockedAchievements} onBack={() => navigate('dashboard')} />;
  }

  // ─── BATTLE SELECT ───
  if (page === 'battle_select') {
    return (
      <OpponentSelect
        onSelect={(opp) => {
          setBattleOpponent(opp);
          setPage('battle_arena');
        }}
        onBack={() => navigate('dashboard')}
      />
    );
  }

  // ─── BATTLE ARENA ───
  if (page === 'battle_arena' && battleOpponent) {
    return (
      <BattleArena
        opponent={battleOpponent}
        onComplete={(won, xpEarned) => {
          const p = proviaStore.getProfile();
          p.heroCredits += xpEarned;
          p.battlesWon += won ? 1 : 0;
          p.battlesPlayed += 1;
          proviaStore.saveProfile(p);
          refreshProfile();
          setBattleOpponent(null);
          navigate('dashboard');
        }}
        onBack={() => navigate('battle_select')}
      />
    );
  }

  // ─── CHAT (THE LOUNGE) ───
  if (page === 'chat') {
    return <ChatPage userName={profile.displayName} onBack={() => navigate('dashboard')} />;
  }

  // ─── DASHBOARD ───
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#1e293b',
      paddingBottom: '80px',
    }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>{level.badge}</span>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Lv.{level.level}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{level.title}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b' }}>💰 {profile.heroCredits} HC</span>
          </div>
        </div>

        {/* HC Progress Bar */}
        <div style={{
          marginBottom: '1rem', padding: '0.4rem 0.6rem',
          backgroundColor: '#ffffff', borderRadius: '0.6rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{profile.heroCredits} HC</span>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{level.maxXP} HC</span>
          </div>
          <div style={{ height: '5px', background: '#f1f5f9', borderRadius: '3px' }}>
            <div style={{
              height: '100%', borderRadius: '3px',
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
              width: `${hcProgress}%`, transition: 'width 0.5s ease',
            }} />
          </div>
        </div>

        {/* Welcome */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{
              fontSize: '1.25rem', fontWeight: 800,
              color: '#0f172a',
              marginBottom: '0.1rem',
            }}>Hey, {profile.displayName}! 💊</h1>
            <p style={{ fontSize: '0.7rem', color: '#64748b' }}>
              🏥 {profile.territory} • Pharmacist
            </p>
          </div>
          <StreakCounter count={profile.streakCount} />
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <StatsCard label="HC" value={profile.heroCredits} icon="💰" color="#fbbf24" />
          <StatsCard
            label="Best Score"
            value={`${profile.dayScores[profile.currentDay] || 0}%`}
            icon="🎯" color="#22c55e"
          />
          <StatsCard label="Battles" value={`${profile.battlesWon}W`} icon="⚔️" color="#f87171" />
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.35rem', marginBottom: '1rem' }}>
          {[
            { label: 'Ranks', icon: '🏆', page: 'leaderboard' as AppPage },
            { label: 'Badges', icon: '🏅', page: 'achievements' as AppPage },
            { label: 'Battle', icon: '⚔️', page: 'battle_select' as AppPage },
            { label: 'Lounge', icon: '💬', page: 'chat' as AppPage },
            { label: 'Mocks', icon: '📝', page: 'mock_center' as AppPage },
          ].map(item => (
            <button key={item.label} onClick={() => navigate(item.page)} style={{
              padding: '0.5rem 0.2rem', backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0', borderRadius: '0.6rem',
              cursor: 'pointer', textAlign: 'center', color: '#334155',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.1rem' }}>{item.icon}</div>
              <div style={{ fontSize: '0.55rem', color: '#64748b' }}>{item.label}</div>
            </button>
          ))}
        </div>

        {/* 45-Day Progress Grid with Topics */}
        <div style={{
          backgroundColor: '#ffffff', borderRadius: '0.85rem',
          padding: '1rem', marginBottom: '1rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>🗺️ 45-Day Roadmap</h3>
            <span style={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: 600 }}>{profile.completedDays.length}/45</span>
          </div>
          <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
            {Array.from({ length: 45 }, (_, i) => {
              const day = i + 1;
              const done = profile.completedDays.includes(day);
              const current = day === profile.currentDay && !done;
              const locked = day > profile.currentDay;
              const topic = getTopicForDay(day);

              let bg = '#f1f5f9';
              let border = 'none';
              let color = '#94a3b8';

              if (done) {
                bg = '#22c55e';
                color = '#ffffff';
              } else if (current) {
                bg = '#eff6ff';
                border = '2px solid #2563eb';
                color = '#2563eb';
              }

              return (
                <button
                  key={day}
                  title={`Day ${day}: ${topic.topic}`}
                  onClick={() => {
                    if (!locked) {
                      setQuizDay(day);
                      setPage('quiz');
                    }
                  }}
                  style={{
                    width: '30px', height: '30px', borderRadius: '5px',
                    border: border,
                    background: bg,
                    color: color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6rem', fontWeight: 700,
                    cursor: locked ? 'not-allowed' : 'pointer', opacity: locked ? 0.5 : 1,
                  }}
                >
                  {done ? '✓' : day}
                </button>
              );
            })}
          </div>

          {/* Current Day Topic Info */}
          {profile.currentDay <= 45 && (
            <div style={{
              marginTop: '0.75rem', padding: '0.6rem', borderRadius: '0.5rem',
              background: '#eff6ff', border: '1px solid #dbeafe',
            }}>
              <div style={{ fontSize: '0.65rem', color: '#2563eb', fontWeight: 600 }}>
                📖 Day {profile.currentDay}: {getTopicForDay(profile.currentDay).topic}
              </div>
              {getTopicForDay(profile.currentDay).subtopic && (
                <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '0.15rem' }}>
                  {getTopicForDay(profile.currentDay).subtopic}
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
          {!profile.completedDays.includes(profile.currentDay) && profile.currentDay <= 45 && (
            <button onClick={() => {
              setQuizDay(profile.currentDay);
              setPage('quiz');
            }} style={{
              flex: 2, padding: '0.8rem',
              background: '#2563eb',
              color: '#fff', border: 'none', borderRadius: '0.7rem',
              fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
            }}>📝 Day {profile.currentDay}</button>
          )}
          <button onClick={() => navigate('mock_center')} style={{
            flex: 1, padding: '0.8rem',
            background: '#ea580c',
            color: '#fff', border: 'none', borderRadius: '0.7rem',
            fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(234, 88, 12, 0.2)',
          }}>📝 Mock Test</button>
        </div>

        {/* Mode Switch */}
        <button onClick={() => {
          proviaStore.updateProfile({ selectedMode: null });
          refreshProfile();
          navigate('mode_select');
        }} style={{
          width: '100%', padding: '0.5rem', background: 'transparent',
          color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '0.5rem',
          fontSize: '0.7rem', cursor: 'pointer',
        }}>🔄 Switch Mode</button>

      </div>

      {/* Bottom Nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        display: 'flex', justifyContent: 'space-around',
        padding: '0.35rem 0 0.6rem', zIndex: 100,
        boxShadow: '0 -1px 3px rgba(0,0,0,0.05)',
      }}>
        {[
          { icon: '🏠', label: 'Home', page: 'dashboard' as AppPage },
          { icon: '⚔️', label: 'Battle', page: 'battle_select' as AppPage },
          { icon: '💬', label: 'Lounge', page: 'chat' as AppPage },
          { icon: '🏆', label: 'Ranks', page: 'leaderboard' as AppPage },
          { icon: '🏅', label: 'Badges', page: 'achievements' as AppPage },
        ].map(item => {
          const active = page === item.page;
          return (
            <button key={item.label} onClick={() => navigate(item.page)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.05rem',
              color: active ? '#2563eb' : '#94a3b8', padding: '0.2rem 0.6rem',
            }}>
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <span style={{ fontSize: '0.5rem', fontWeight: active ? 700 : 400 }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default App;

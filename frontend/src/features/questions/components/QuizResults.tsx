import React from 'react';

interface QuizResultsProps {
    correct: number;
    total: number;
    onRetry: () => void;
    onContinue: () => void;
    isCheckpoint?: boolean;
    dayTopic?: string;
    hcEarned?: number;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
    correct, total, onRetry, onContinue, isCheckpoint, dayTopic, hcEarned = 0
}) => {
    const percentage = Math.round((correct / total) * 100);
    const passed = isCheckpoint ? percentage >= 80 : true;

    let emoji: string;
    let message: string;
    let color: string;

    if (percentage === 100) {
        emoji = '🏆'; message = 'Perfect Score!'; color = '#fbbf24';
    } else if (percentage >= 80) {
        emoji = '🎉'; message = 'Mastery Achieved!'; color = '#22c55e';
    } else if (percentage >= 60) {
        emoji = '😤'; message = 'Almost there!'; color = '#f59e0b';
    } else {
        emoji = '💪'; message = 'Keep practicing!'; color = '#f87171';
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center',
            padding: '2rem',
            color: '#1e293b',
        }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{emoji}</div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', color }}>{message}</h2>

            {dayTopic && (
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>
                    {dayTopic}
                </p>
            )}

            {isCheckpoint && !passed && (
                <div style={{
                    background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem',
                    padding: '0.75rem 1rem', marginBottom: '1rem', maxWidth: '350px',
                }}>
                    <p style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        ❌ You need 80% to pass
                    </p>
                    <p style={{ color: '#b91c1c', fontSize: '0.75rem' }}>
                        A 15-minute cooldown will begin. Review the topic and try again!
                    </p>
                </div>
            )}

            {isCheckpoint && passed && hcEarned > 0 && (
                <div style={{
                    background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.75rem',
                    padding: '0.75rem 1rem', marginBottom: '1rem',
                }}>
                    <p style={{ color: '#15803d', fontSize: '0.9rem', fontWeight: 700 }}>
                        +{hcEarned} Hero Credits earned! 💰
                    </p>
                </div>
            )}

            {/* Score Circle */}
            <div style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: `conic-gradient(${color} ${percentage * 3.6}deg, #e2e8f0 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
            }}>
                <div style={{
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                }}>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color }}>{percentage}%</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{correct}/{total}</span>
                </div>
            </div>

            {/* Stats */}
            <div style={{
                display: 'flex',
                gap: '2rem',
                marginBottom: '2rem',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#22c55e' }}>{correct}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Correct</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ef4444' }}>{total - correct}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Wrong</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#60a5fa' }}>{percentage}%</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Accuracy</div>
                </div>
            </div>

            {/* Mastery threshold indicator */}
            {isCheckpoint && (
                <div style={{
                    width: '100%', maxWidth: '350px', marginBottom: '1.5rem',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Your score</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>80% required</span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', position: 'relative' }}>
                        <div style={{
                            height: '100%', borderRadius: '4px',
                            background: passed ? '#22c55e' : '#ef4444',
                            width: `${Math.min(percentage, 100)}%`,
                            transition: 'width 0.5s ease',
                        }} />
                        {/* 80% marker */}
                        <div style={{
                            position: 'absolute', top: '-3px', left: '80%',
                            width: '2px', height: '14px',
                            background: '#0f172a', borderRadius: '1px',
                        }} />
                    </div>
                </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }}>
                <button onClick={onRetry} style={{
                    flex: 1, padding: '0.875rem', background: '#f1f5f9', color: '#64748b',
                    border: '1px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                }}>
                    {isCheckpoint && !passed ? '🔄 Retry' : '👀 Review'}
                </button>
                <button onClick={onContinue} style={{
                    flex: 2, padding: '0.875rem',
                    background: passed ? '#2563eb' : '#ef4444',
                    color: '#fff', border: 'none', borderRadius: '0.75rem',
                    fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                    boxShadow: `0 4px 6px -1px ${passed ? 'rgba(37, 99, 235, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                }}>
                    {isCheckpoint && passed ? '✅ Day Complete!' : isCheckpoint && !passed ? '⏳ Start Cooldown' : 'Continue →'}
                </button>
            </div>
        </div>
    );
};

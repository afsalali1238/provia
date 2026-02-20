import React, { useState, useCallback, useEffect } from 'react';
import { QuestionCard } from '../components/QuestionCard';
import { QuizResults } from '../components/QuizResults';
import { getQuestionsForDay } from '../data/mockQuestions';
import { proviaStore } from '../../../services/localStore';
import { getTopicForDay } from '../../../data/daySchedule';
import type { Answer } from '../types/question.types';

interface DailyQuestionsProps {
    day: number;
    isMockTest?: boolean;
    onComplete: (score: number, total: number) => void;
    onBack: () => void;
}

export const DailyQuestions: React.FC<DailyQuestionsProps> = ({ day, isMockTest, onComplete, onBack }) => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load questions
    useEffect(() => {
        const loadQuestions = async () => {
            setLoading(true);
            if (isMockTest) {
                const allQuestions = await proviaStore.loadQuestions();
                const mockQuestions = proviaStore.getQuestionsForMockTest(allQuestions, 120);
                setQuestions(mockQuestions);
            } else {
                const dayQuestions = getQuestionsForDay(day);
                setQuestions(dayQuestions);
            }
            setLoading(false);
        };
        loadQuestions();
    }, [day, isMockTest]);

    const currentQuestion = questions[currentIndex];
    const correctCount = answers.filter(a => a.isCorrect).length;
    const topic = getTopicForDay(day);
    const title = isMockTest ? 'Mock Test' : `Day ${day}: ${topic.topic}`;

    const handleSelectAnswer = useCallback((index: number) => {
        if (showExplanation) return;
        setSelectedAnswer(index);
        setShowExplanation(true);

        const answer: Answer = {
            questionId: currentQuestion.id,
            selectedIndex: index,
            isCorrect: index === currentQuestion.correctAnswer,
            timeSpent: 0,
        };
        setAnswers(prev => [...prev, answer]);
    }, [showExplanation, currentQuestion]);

    const handleNext = useCallback(() => {
        if (currentIndex + 1 >= questions.length) {
            setIsComplete(true);
        } else {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        }
    }, [currentIndex, questions.length]);

    const handleRetry = () => {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setAnswers([]);
        setIsComplete(false);
    };

    const handleContinue = () => {
        onComplete(correctCount, questions.length);
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#f8fafc', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            }}>
                <p style={{ color: '#64748b' }}>Loading questions...</p>
            </div>
        );
    }

    if (!questions.length) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: '#f8fafc', padding: '2rem', textAlign: 'center',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>No questions found for {title}</p>
                <button onClick={onBack} style={{
                    padding: '0.75rem 2rem', background: '#2563eb', color: '#fff',
                    border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 600,
                }}>← Go Back</button>
            </div>
        );
    }

    if (isComplete) {
        const percentage = Math.round((correctCount / questions.length) * 100);
        const passed = percentage >= 80;
        return (
            <div style={{
                minHeight: '100vh',
                background: '#f8fafc',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                color: '#1e293b',
            }}>
                <QuizResults
                    correct={correctCount}
                    total={questions.length}
                    onRetry={handleRetry}
                    onContinue={handleContinue}
                    isCheckpoint={!isMockTest}
                    dayTopic={isMockTest ? 'Mock Test' : topic.topic}
                    hcEarned={!isMockTest && passed ? 20 : 0}
                />
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            color: '#1e293b',
            padding: '1.5rem',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                maxWidth: '600px',
                margin: '0 auto 1.5rem',
            }}>
                <button onClick={onBack} style={{
                    background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
                    fontSize: '1.5rem', padding: '0.25rem',
                }}>←</button>
                <h2 style={{
                    fontSize: '0.9rem', fontWeight: 700,
                    color: '#0f172a',
                }}>{title}</h2>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                    {correctCount}/{answers.length} ✓
                </span>
            </div>

            <QuestionCard
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                totalQuestions={questions.length}
                selectedAnswer={selectedAnswer}
                showExplanation={showExplanation}
                onSelectAnswer={handleSelectAnswer}
                onNext={handleNext}
            />
        </div>
    );
};

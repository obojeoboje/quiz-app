import { useState, useEffect, useMemo } from 'react';

/* данные и компоненты */
import tests from './data/tests.json';
import QuizList from './components/QuizList';
import Quiz from './components/Quiz';
import Results from './components/Results';
import History from './components/History';

/* ───────────────────────── helpers ───────────────────────── */
const LS_KEY = 'quizProgress';

/* читаем localStorage и мигрируем старый формат {obj} → [{obj}] */
const loadProgress = () => {
  const raw = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
  return Object.fromEntries(
    Object.entries(raw).map(([title, v]) => [title, Array.isArray(v) ? v : [v]])
  );
};
const saveProgress = (obj) => localStorage.setItem(LS_KEY, JSON.stringify(obj));

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

/* ───────────────────────── App ───────────────────────── */
export default function App() {
  /* прогресс + маршруты */
  const [progress, setProgress] = useState({});
  const [view, setView] = useState('list');         // list | quiz | results | history
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [attempt, setAttempt] = useState(null);

  /* загружаем прогресс при старте */
  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const updateProgress = (next) => {
    setProgress(next);
    saveProgress(next);
  };

  /* темы фильтра */
  const topics = useMemo(() => [...new Set(tests.map((t) => t.topic))], []);

  /* ─── старт новой попытки ─── */
  const startNewAttempt = (idx) => {
    const quiz = tests[idx];
    const attemptObj = {
      id: Date.now(),
      status: 'in-progress',
      startedAt: Date.now(),
      current: 0,
      questions: shuffle(quiz.questions),
      answers: [],
    };
    const list = progress[quiz.title] ? [...progress[quiz.title], attemptObj] : [attemptObj];
    updateProgress({ ...progress, [quiz.title]: list });

    setSelectedIdx(idx);
    setAttempt(attemptObj);
    setView('quiz');
  };

  /* ─── продолжить ─── */
  const resumeAttempt = (title, id) => {
    const quizIdx = tests.findIndex((q) => q.title === title);
    const at = progress[title]?.find((a) => a.id === id);
    if (quizIdx !== -1 && at) {
      setSelectedIdx(quizIdx);
      setAttempt(at);
      setView('quiz');
    }
  };

  /* ─── показать результаты ─── */
  const showResult = (title, id) => {
    const at = progress[title]?.find((a) => a.id === id);
    if (at) {
      setAttempt(at);
      setView('results');
    }
  };

  /* ─── обновить попытку ─── */
  const patchAttempt = (patch) => {
    const title = tests[selectedIdx].title;
    const updated = progress[title].map((a) =>
      a.id === attempt.id ? { ...a, ...patch } : a
    );
    const next = { ...progress, [title]: updated };
    updateProgress(next);
    setAttempt(updated.find((a) => a.id === attempt.id));
  };

  /* ─── завершить ─── */
  const finishQuiz = ({ correct, total, wrong }) => {
    patchAttempt({
      status: 'completed',
      finishedAt: Date.now(),
      correct,
      total,
      wrong,
    });
    setView('results');
  };

  /* ─── бросить ─── */
  const abortQuiz = () => {
    patchAttempt({ status: 'abandoned', abandonedAt: Date.now() });
    goHome();
  };

  const goHome = () => {
    setView('list');
    setSelectedIdx(null);
    setAttempt(null);
  };

  /* ───────────────────────── UI ───────────────────────── */
  return (
    <>
      {/* шапка */}
      <header className="site-header">Polynskih</header>

      <div className="container">
        {view === 'list' && (
          <>
            <button className="btn btn--ghost mb-4" onClick={() => setView('history')}>
              Мой прогресс
            </button>
            <QuizList tests={tests} topics={topics} onStart={startNewAttempt} />
          </>
        )}

        {view === 'quiz' && (
          <Quiz
            quiz={tests[selectedIdx]}
            attempt={attempt}
            onPatch={patchAttempt}
            onFinish={finishQuiz}
            onAbort={abortQuiz}
          />
        )}

        {view === 'results' && <Results data={attempt} onRestart={goHome} />}

        {view === 'history' && (
          <History
            progress={progress}
            onClose={goHome}
            onResume={resumeAttempt}
            onShowResult={showResult}
          />
        )}
      </div>
    </>
  );
}

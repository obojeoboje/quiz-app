import { useState, useEffect, useMemo } from 'react';
import tests from './data/tests.json';
import QuizList from './components/QuizList';
import Quiz from './components/Quiz';
import Results from './components/Results';
import History from './components/History';

/* ───────── helpers ───────── */
const LS_KEY = 'quizProgress';

const loadProgress = () => {
  const raw = JSON.parse(localStorage.getItem(LS_KEY) || '{}');

  // ✨ Миграция: если значение не массив, оборачиваем в массив
  const migrated = Object.fromEntries(
    Object.entries(raw).map(([title, val]) => [
      title,
      Array.isArray(val) ? val : [val],
    ])
  );

  return migrated;
};

const saveProgress = (obj) => localStorage.setItem(LS_KEY, JSON.stringify(obj));


/* ───────────────────────── App ───────────────────────── */
export default function App() {
  const [view, setView] = useState('list');            // list | quiz | results | history
  const [selectedIdx, setSelectedIdx] = useState(null); // индекс теста в tests[]
  const [attempt, setAttempt] = useState(null);         // текущая попытка (объект)
  const [progress, setProgress] = useState({});         // { [title]: Attempt[] }

  /* загружаем прогресс один раз */
  useEffect(() => setProgress(loadProgress()), []);

  /* сохраняем в localStorage каждый раз при изменении */
  const updateProgress = (next) => {
    setProgress(next);
    saveProgress(next);
  };

  /* все темы для фильтра */
  const topics = useMemo(() => [...new Set(tests.map((t) => t.topic))], []);

  /* ─── старт новой попытки ─── */
  const startNewAttempt = (idx) => {
    const quiz = tests[idx];
    const attemptObj = {
      id: Date.now(),           // уникальный id
      status: 'in-progress',
      startedAt: Date.now(),
      questions: shuffle(quiz.questions),
      answers: [],
      current: 0,
    };
    const list = progress[quiz.title] ? [...progress[quiz.title], attemptObj] : [attemptObj];
    updateProgress({ ...progress, [quiz.title]: list });

    setSelectedIdx(idx);
    setAttempt(attemptObj);
    setView('quiz');
  };

  /* ─── продолжить существующую попытку (abandoned / in-progress) ─── */
  const resumeAttempt = (title, id) => {
    const quizIdx = tests.findIndex((q) => q.title === title);
    const at = progress[title].find((a) => a.id === id);
    if (quizIdx !== -1 && at) {
      setSelectedIdx(quizIdx);
      setAttempt(at);
      setView('quiz');
    }
  };

  /* ─── открыть результаты завершённой попытки ─── */
  const showResult = (title, id) => {
    const at = progress[title].find((a) => a.id === id);
    if (at) {
      setAttempt(at);
      setView('results');
    }
  };

  /* ─── когда пользователь отвечает на вопрос ─── */
  const patchAttempt = (patch) => {
    const title = tests[selectedIdx].title;
    const list = progress[title].map((a) => (a.id === attempt.id ? { ...a, ...patch } : a));
    const nextProg = { ...progress, [title]: list };
    updateProgress(nextProg);
    setAttempt(list.find((a) => a.id === attempt.id)); // синхронизируем attempt в состоянии
  };

  /* ─── завершить попытку ─── */
  const finishQuiz = (details) => {
    patchAttempt({
      status: 'completed',
      finishedAt: Date.now(),
      ...details, // correct, total, wrong
    });
    setView('results');
  };

  /* ─── бросить/выйти ─── */
  const abortQuiz = () => {
    patchAttempt({
      status: 'abandoned',
      abandonedAt: Date.now(),
    });
    goHome();
  };

  const goHome = () => {
    setView('list');
    setSelectedIdx(null);
    setAttempt(null);
  };

  /* ───────────────────────── UI ───────────────────────── */
  return (
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

      {view === 'results' && (
        <Results data={attempt} onRestart={goHome} />
      )}

      {view === 'history' && (
        <History
          progress={progress}
          onClose={goHome}
          onResume={resumeAttempt}
          onShowResult={showResult}
        />
      )}
    </div>
  );
}

/* ───────────────────────── utils ───────────────────────── */
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

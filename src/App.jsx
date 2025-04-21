import { useState, useMemo } from 'react';
import tests from './data/tests.json';
import QuizList from './components/QuizList';
import Quiz from './components/Quiz';
import Results from './components/Results';

export default function App() {
  const [view, setView] = useState('list');        // list | quiz | results
  const [selectedQuizIdx, setSelectedQuizIdx] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  const topics = useMemo(
    () => [...new Set(tests.map(t => t.topic))],
    []
  );

  const startQuiz = (idx) => {
    setSelectedQuizIdx(idx);
    setView('quiz');
  };

  const finishQuiz = (result) => {
    setQuizResult(result);
    setView('results');
  };

  const backHome = () => {
    setView('list');
    setQuizResult(null);
    setSelectedQuizIdx(null);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {view === 'list' && (
        <QuizList
          tests={tests}
          topics={topics}
          onStart={startQuiz}
          title="Все тесты"
        />
      )}

      {view === 'quiz' && (
        <Quiz
          quiz={tests[selectedQuizIdx]}
          onFinish={finishQuiz}
          onAbort={backHome}
        />
      )}

      {view === 'results' && (
        <Results
          result={quizResult}
          onRestart={backHome}
        />
      )}
    </main>
  );
}

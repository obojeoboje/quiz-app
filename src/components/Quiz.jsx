import { useState, useEffect } from 'react';

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export default function Quiz({ quiz, onFinish, onAbort }) {
  const [questions] = useState(shuffle(quiz.questions));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);

  const currentQ = questions[current];
  const percent = (current / questions.length) * 100;

  const select = (idx) => {
    setAnswers([...answers, idx]);
    setCurrent(current + 1);
  };

  useEffect(() => {
    if (current >= questions.length && questions.length > 0) {
      const wrong = questions.reduce((arr, q, i) => {
        if (q.answer !== answers[i]) arr.push({ ...q, user: answers[i] });
        return arr;
      }, []);
      onFinish({
        total: questions.length,
        correct: questions.length - wrong.length,
        wrong,
        title: quiz.title,
      });
    }
  }, [current]);

  if (current >= questions.length) return null;

  return (
    <div className="card">
      <header className="mb-4 flex justify-between items-center">
        <h2>{quiz.title}</h2>
        <button onClick={onAbort} className="text-sm underline">
          выйти
        </button>
      </header>

      {/* прогресс‑бар */}
      <div className="progress" aria-label="Progress">
        <span style={{ '--value': `${percent}%` }} />
      </div>

      <p className="mb-4">{currentQ.question}</p>

      <div className="grid gap-2">
        {currentQ.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => select(idx)}
            className="btn btn--ghost w-full text-left"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

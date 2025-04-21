import { useState, useEffect } from 'react';

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export default function Quiz({ quiz, onFinish, onAbort }) {
  const [questions] = useState(shuffle(quiz.questions));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);

  const currentQ = questions[current];

  const select = (idx) => {
    setAnswers([...answers, idx]);
    setCurrent(current + 1);
  };

  // когда все вопросы закончились
  useEffect(() => {
    if (current >= questions.length && questions.length > 0) {
      const wrong = questions.reduce((arr, q, i) => {
        if (q.answer !== answers[i]) {
          arr.push({ ...q, user: answers[i] });
        }
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
        <h2 className="font-medium">
          {quiz.title} ({current + 1}/{questions.length})
        </h2>
        <button onClick={onAbort} className="text-sm text-slate-500 underline">
          выйти
        </button>
      </header>

      <p className="mb-4">{currentQ.question}</p>

      <div className="grid gap-2">
        {currentQ.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => select(idx)}
            className="w-full px-3 py-2 rounded-lg border text-left hover:bg-slate-100"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

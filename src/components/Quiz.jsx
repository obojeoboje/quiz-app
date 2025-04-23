import { useEffect } from 'react';

export default function Quiz({ quiz, attempt, onPatch, onFinish, onAbort }) {
  /* данные текущей попытки */
  const { questions, answers, current, id } = attempt;
  const currentQ = questions[current];
  const percent = (current / questions.length) * 100;

  /* выбрать вариант */
  const select = (idx) => {
    const nextAnswers = [...answers];
    nextAnswers[current] = idx;

    onPatch({ answers: nextAnswers, current: current + 1 }); // сохраняем
  };

  /* шаг назад */
  const goBack = () => {
    if (current > 0) onPatch({ current: current - 1 });
  };

  /* когда дошли до конца */
  useEffect(() => {
    if (current === questions.length) {
      const wrong = questions.reduce((arr, q, i) => {
        if (q.answer !== answers[i]) arr.push({ ...q, user: answers[i] });
        return arr;
      }, []);
      onFinish({
        correct: questions.length - wrong.length,
        total: questions.length,
        wrong,
      });
    }
  }, [current]);

  if (current >= questions.length) return null;

  return (
    <div className="card">
      <header className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {current > 0 && (
            <button className="btn btn--icon" onClick={goBack} title="Назад">
              ←
            </button>
          )}
          <h2>{quiz.title}</h2>
        </div>
        <button onClick={onAbort} className="text-sm underline">
          выйти
        </button>
      </header>

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

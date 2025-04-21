import { useState } from 'react';

export default function QuizList({ tests, topics, onStart }) {
  const [topic, setTopic] = useState('');

  const visibleTests = topic ? tests.filter((t) => t.topic === topic) : tests;

  return (
    <>
      <h1>Все тесты</h1>

      {/* фильтр */}
      <div className="filter__wrap">
        <button
          className={`btn ${topic === '' ? 'btn--primary' : 'btn--ghost'}`}
          onClick={() => setTopic('')}
        >
          Все
        </button>
        {topics.map((t) => (
          <button
            key={t}
            className={`btn ${topic === t ? 'btn--primary' : 'btn--ghost'}`}
            onClick={() => setTopic(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* список тестов */}
      <div className="grid gap-4">
        {visibleTests.map((t) => (
          <div key={t.title} className="card flex items-center justify-between gap-4">
            <span>{t.title}</span>
            <button
              className="btn btn--primary"
              onClick={() => onStart(tests.indexOf(t))}
            >
              Начать
            </button>
          </div>
        ))}

        {visibleTests.length === 0 && <p>Тесты отсутствуют.</p>}
      </div>
    </>
  );
}

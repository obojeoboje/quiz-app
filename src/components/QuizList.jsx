import { useState } from 'react';

export default function QuizList({ tests, topics, onStart }) {
  const [filter, setFilter] = useState('');
  const visible = filter ? tests.filter(t => t.topic === filter) : tests;

  return (
    <>
      <h1>Все тесты</h1>

      <div className="filter__wrap">
        <button
          className={`btn ${filter === '' ? 'btn--primary' : 'btn--ghost'}`}
          onClick={() => setFilter('')}
        >
          Все
        </button>
        {topics.map(t => (
          <button
            key={t}
            className={`btn ${filter === t ? 'btn--primary' : 'btn--ghost'}`}
            onClick={() => setFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {visible.map(q => (
          <div key={q.title} className="card flex justify-between items-center">
            <span>{q.title}</span>
            <button
              className="btn btn--primary"
              onClick={() => onStart(tests.indexOf(q))}
            >
              Начать
            </button>
          </div>
        ))}
        {visible.length === 0 && <p>Тесты отсутствуют.</p>}
      </div>
    </>
  );
}

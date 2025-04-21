import { useState } from 'react';

function Filter({ topics, active, onChange }) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      <button
        className={`px-3 py-1 rounded-full ${active === ''
          ? 'bg-slate-900 text-white'
          : 'bg-slate-200'}`}
        onClick={() => onChange('')}
      >
        Все
      </button>
      {topics.map(t => (
        <button
          key={t}
          className={`px-3 py-1 rounded-full ${active === t
            ? 'bg-slate-900 text-white'
            : 'bg-slate-200'}`}
          onClick={() => onChange(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default function QuizList({ tests, topics, onStart, title }) {
  const [topic, setTopic] = useState('');

  const visibleTests = topic
    ? tests.filter(t => t.topic === topic)
    : tests;

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">{title}</h1>
      <Filter topics={topics} active={topic} onChange={setTopic} />

      <div className="grid gap-4">
        {visibleTests.map((t, idx) => (
          <div key={idx} className="card flex justify-between items-center">
            <span>{t.title}</span>
            <button
              className="px-4 py-2 bg-slate-900 text-white rounded-lg"
              onClick={() => onStart(tests.indexOf(t))}
            >
              Начать
            </button>
          </div>
        ))}
        {visibleTests.length === 0 && (
          <p>Тесты отсутствуют.</p>
        )}
      </div>
    </>
  );
}

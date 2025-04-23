export default function Results({ data, onRestart }) {
  if (!data) return null;
  const { title, correct, total, wrong } = data;

  return (
    <div className="space-y-6">
      <div className="card text-center">
        <h2>{title}</h2>
        <p>
          Правильных ответов: <b>{correct}</b> / {total}
        </p>
      </div>

      {wrong?.length > 0 && (
        <div className="card">
          <h3>Ошибки</h3>
          <ul className="errors">
            {wrong.map((w, idx) => (
              <li key={idx}>
                <p>{w.question}</p>
                <small>
                  Правильный ответ: <b>{w.options[w.answer]}</b>
                </small>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={onRestart} className="btn btn--primary block mx-auto">
        На главную
      </button>
    </div>
  );
}

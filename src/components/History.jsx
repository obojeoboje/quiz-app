export default function History({ progress, onClose, onResume, onShowResult }) {
  const flat = Object.entries(progress)
    .flatMap(([title, list]) =>
      (Array.isArray(list) ? list : [list]).map((at) => ({ title, ...at }))
    )
    .sort((a, b) => b.startedAt - a.startedAt);


  if (flat.length === 0) {
    return (
      <div className="card text-center">
        <p className="mb-4">Пока нет сохранённых результатов.</p>
        <button className="btn btn--primary" onClick={onClose}>
          На главную
        </button>
      </div>
    );
  }

  const fmtDate = (ts) =>
    new Date(ts).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <div className="space-y-6">
      <h2>Мой прогресс</h2>

      <div className="grid gap-4">
        {flat.map((a) => (
          <div
            key={a.id}
            className="card flex justify-between items-center"
            style={{ cursor: 'pointer' }}
            onClick={() =>
              a.status === 'completed'
                ? onShowResult(a.title, a.id)
                : onResume(a.title, a.id)
            }
          >
            <div>
              <b>{a.title}</b>
              <br />
              <small>
                {a.status === 'completed' && `✅ ${a.correct}/${a.total}`}
                {a.status === 'in-progress' && '⏳ В процессе'}
                {a.status === 'abandoned' && '🚫 Брошен'}
              </small>
            </div>
            <small>{fmtDate(a.startedAt)}</small>
          </div>
        ))}
      </div>

      <button className="btn btn--primary" onClick={onClose}>
        На главную
      </button>
    </div>
  );
}

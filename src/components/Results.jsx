export default function Results({ result, onRestart }) {
  if (!result) return null;

  const { correct, total, wrong, title } = result;

  return (
    <div className="space-y-6">
      <div className="card text-center">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p>
          Правильных ответов: <b>{correct}</b> / {total}
        </p>
      </div>

      {wrong.length > 0 && (
        <div className="card">
          <h3 className="font-medium mb-3">Ошибки</h3>
          <ul className="space-y-3 list-disc pl-5">
            {wrong.map((w, idx) => (
              <li key={idx}>
                <p className="mb-1">{w.question}</p>
                <p className="text-sm text-slate-600">
                  Правильный ответ: <b>{w.options[w.answer]}</b>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onRestart}
        className="block mx-auto px-6 py-2 bg-slate-900 text-white rounded-lg"
      >
        На главную
      </button>
    </div>
  );
}

export function TriviaList({ items }: { items: Array<{ trivia_id: number; trivia_text: string }> }) {
  if (!items?.length) return null;
  return (
    <div className="pt-3">
      <h5 className="font-semibold mb-1">Trivia</h5>
      <ul className="list-disc pl-5 text-sm space-y-1">
        {items.map((t) => (
          <li key={t.trivia_id}>{t.trivia_text}</li>
        ))}
      </ul>
    </div>
  );
}
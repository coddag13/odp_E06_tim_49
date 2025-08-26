export function EpisodesTable({
  items,
  fallbackImage,
  title,
}: {
  items: Array<{
    episode_id: number;
    season_number: number;
    episode_number: number;
    title: string;
    description?: string | null;
    cover_image?: string | null;
  }>;
  fallbackImage?: string | null;
  title?: string;
}) {
  if (!items?.length) return null;

  return (
    <div className="pt-4">
      <h5 className="font-semibold mb-2">{title ?? "Epizode"}</h5>
      <div className="max-h-80 overflow-auto border rounded-lg border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 sticky top-0 z-10">
            <tr>
              <th className="text-left p-2 w-[80px]">Slika</th>
              <th className="text-left p-2">Sezona</th>
              <th className="text-left p-2">Ep.</th>
              <th className="text-left p-2">Naziv</th>
              <th className="text-left p-2">Opis</th>
            </tr>
          </thead>
          <tbody>
            {items.map((ep) => {
              const imgSrc = ep.cover_image || fallbackImage || "";
              return (
                <tr key={ep.episode_id} className="border-t border-slate-700">
                  <td className="p-2 align-top">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={`${title ?? "Sadrzaj"} S${ep.season_number}E${ep.episode_number}`}
                        loading="lazy"
                        className="w-16 h-24 object-cover rounded-md border border-slate-600 bg-slate-800"
                      />
                    ) : (
                      <div className="w-16 h-24 grid place-items-center text-[10px] text-slate-300 border border-slate-600 rounded-md bg-slate-700">
                        bez slike
                      </div>
                    )}
                  </td>
                  <td className="p-2 align-top">{ep.season_number}</td>
                  <td className="p-2 align-top">{ep.episode_number}</td>
                  <td className="p-2 align-top font-medium">{ep.title}</td>
                  <td className="p-2 align-top text-slate-300">{ep.description || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
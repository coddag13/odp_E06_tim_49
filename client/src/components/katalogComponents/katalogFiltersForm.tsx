import type { ContentType } from "../../types/content/Content";

type SortKey = "title" | "average_rating";
type SortDir = "asc" | "desc";

export function KatalogFilters({
  q,
  setQ,
  type,
  setType,
  sortKey,
  setSortKey,
  sortDir,
  setSortDir
  
}: {
  q: string;
  setQ: (v: string) => void;
  type: ContentType | "all";
  setType: (v: ContentType | "all") => void;
  sortKey: SortKey;
  setSortKey: (v: SortKey) => void;
  sortDir: SortDir;
  setSortDir: (v: SortDir) => void;
  showAddButton?: boolean;
  onAdd?: () => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pretraga po nazivu…"
          className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
          title="Tip"
        >
          <option value="all">Sve kategorije</option>
          <option value="movie">Film</option>
          <option value="series">Serija</option>
        </select>
        <div className="flex gap-2">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
            title="Sortiraj po"
          >
            <option value="title">Naziv</option>
            <option value="average_rating">Prosečna ocena</option>
          </select>
          <select
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
            title="Smer"
          >
            <option value="asc">Rastuće ↑</option>
            <option value="desc">Opadajuće ↓</option>
          </select>
        </div>

        
      </div>
    </div>
  );
}
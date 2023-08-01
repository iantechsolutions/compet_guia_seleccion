import { Entry, getCurrentState, getEntries } from "../client/saveLocalState";

export function ShowEntries({ onEntryClick }: { onEntryClick?: (entry: Entry) => unknown }) {
    const current = getCurrentState()
    const entries = getEntries()

    const currentOk = current && current.filters && current.filters.length > 0

    if (!currentOk && entries.length === 0) return null

    return <div className="mt-10">
        {currentOk && <h2 className="font-medium text-lg my-3">Continuar con</h2>}

        {currentOk && <Card entry={current} onClick={() => onEntryClick?.(current)} />}
        {entries.length > 0 && <h2 className="font-medium text-lg mb-4 mt-9">Busquedas anteriores</h2>}

        <div class="grid md:grid-cols-2 gap-4">
            {entries.map(entry => <Card entry={entry} onClick={() => onEntryClick?.(entry)} />)}
        </div>
    </div>
}

function Card({ entry, onClick }: { entry: Entry, onClick?: () => unknown }) {
    return <button className="py-2 text-left w-full border-b" onClick={onClick}>
        <p className="text-sm font-medium">{(new Date(entry.timestamp)).toLocaleDateString()}</p>
        <h3 className="text-sm">{entry.title}</h3>
    </button>
}
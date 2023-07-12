import { Entry, getCurrentState, getEntries } from "../client/saveLocalState";

export function ShowEntries({ onEntryClick }: { onEntryClick?: (entry: Entry) => unknown }) {
    const current = getCurrentState()
    const entries = getEntries()

    const currentOk = current && current.filters && current.filters.length > 0

    if (!currentOk && entries.length === 0) return null

    return <div className="mt-2">
        {currentOk && <h2 className="font-medium text-lg">Continuar con</h2>}

        {currentOk && <Card entry={current} onClick={() => onEntryClick?.(current)} />}
        {entries.length > 0 && <h2 className="font-medium text-lg">Busquedas anteriores</h2>}

        {entries.map(entry => <Card entry={entry} onClick={() => onEntryClick?.(entry)} />)}
    </div>
}

function Card({ entry, onClick }: { entry: Entry, onClick?: () => unknown }) {
    return <button className="py-2 text-left" onClick={onClick}>
        <h3 className="text-sm">{entry.title}</h3>
        <p className="text-sm float-right">{(new Date(entry.timestamp)).toLocaleDateString()}</p>
    </button>
}
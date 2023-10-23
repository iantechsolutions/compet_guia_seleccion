import { type Entry, getCurrentState, getEntries } from "../client/saveLocalState";
import { mapSelectedFilters } from "../util/mapSelectedFilters";


export function ShowEntries({ onEntryClick, filtersLabelsByValueKey }: { onEntryClick?: (entry: Entry) => unknown, filtersLabelsByValueKey: Map<string, string> }) {
    const current = getCurrentState()
    let entries = getEntries()

    const currentOk = current && current.filters && current.filters.length > 0

    if (!currentOk && entries.length === 0) return null

    const noRepeat = new Map<string, Entry>()

    for (const e of entries) {
        if (noRepeat.has(e.title)) continue
        noRepeat.set(e.title, e)
    }

    entries = [...noRepeat.values()]


    function Card({ entry, onClick }: { entry: Entry, onClick?: () => unknown }) {
        const c = mapSelectedFilters(entry.filters, filtersLabelsByValueKey, (filter, label, i) => {
            return <span className="shadow-sm bg-white text-md px-2 py-[1px] rounded-full block whitespace-nowrap">{label}</span>
        })
        
        return <button className="py-2 text-left w-full border-l-4 px-2 border-stone-300 bg-stone-200 mb-5" onClick={onClick}>
            {/* <h3 className="text-sm">{entry.title}</h3> */}
            {/* <p className="text-sm font-medium">{(new Date(entry.timestamp)).toLocaleDateString()}</p> */}
            <div className={`flex flex-wrap gap-1`}>
                <span className="shadow-sm text-stone-500 bg-white text-sm font-semibold px-2 py-[1px] rounded-full block whitespace-nowrap">{(new Date(entry.timestamp)).toLocaleDateString()}</span>
                {c}
            </div>
        </button>
    }



    return <div className="mt-10">
        {currentOk && <h2 className="font-medium text-lg my-3">Continuar con</h2>}

        {currentOk && <Card entry={current} onClick={() => onEntryClick?.(current)} />}
        {entries.length > 0 && <h2 className="font-medium text-lg mb-4 mt-9">Busquedas anteriores</h2>}

        <div class="grid md:grid-cols-2 gap-4">
            {entries.map(entry => <Card entry={entry} onClick={() => onEntryClick?.(entry)} />)}
        </div>
    </div>
}






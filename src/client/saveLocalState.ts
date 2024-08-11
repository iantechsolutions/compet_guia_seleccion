import type { SelectedFilters } from '../util/types'

export type Entry = {
    filters: SelectedFilters
    timestamp: number
    title: string
}

function gtag(...args: any[]) {
    return (window as any).gtag(...args)
}

export function updateCurrentState(
    selectedFilters: SelectedFilters,
    title: string
) {
    // use localstorage
    localStorage.setItem(
        'current',
        JSON.stringify({ filters: selectedFilters, title })
    )
}

export function getCurrentState(): Entry | null {
    // use localstorage
    if (typeof window === 'undefined') return null

    const current = localStorage.getItem('current')
    if (current) {
        return {
            ...JSON.parse(current),
            timestamp: Date.now()
        }
    }
    return null
}

export function addEntry(selectedFilters: SelectedFilters, title: string) {
    const prefix = 'entry_'
    const entry = prefix + Date.now()

    gtag('event', 'completed_questions', {
        title: title
    })

    // use localstorage
    localStorage.setItem(
        entry,
        JSON.stringify({ filters: selectedFilters, title })
    )
}

export function getEntries(): Entry[] {
    const prefix = 'entry_'

    if (typeof window === 'undefined') return []

    const entries: Entry[] = []
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(prefix)) {
            const entry = localStorage.getItem(key)
            if (entry) {
                entries.push({
                    ...JSON.parse(entry),
                    timestamp: Number.parseInt(key.substring(prefix.length))
                })
            }
        }
    }
    return entries.sort((a, b) => {
        return b.timestamp - a.timestamp
    })
}

export function deleteEntries() {
    // delete entries passing the 20th
    const prefix = 'entry_'
    const entries = getEntries()
    entries.sort((a, b) => {
        return a.timestamp - b.timestamp
    })
    const toDelete = entries.slice(0, entries.length - 20)
    toDelete.forEach((entry) => {
        localStorage.removeItem(prefix + entry.timestamp)
    })
}

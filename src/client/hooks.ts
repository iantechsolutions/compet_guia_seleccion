import { useEffect, useState } from 'preact/hooks'
import { apiClient } from './client'

export function useDefinitionsAndValues() {
    const [definitionsAndValues, setDefinitionsAndValues] = useState<
        Awaited<ReturnType<typeof apiClient.getFiltersAndValues>> | null
    >(null)

    const error: Error | null = null

    // Use effect, run once when component is mounted
    useEffect(() => {
        apiClient.getFiltersAndValues().then(setDefinitionsAndValues)
    }, [])

    return [definitionsAndValues, error]
}

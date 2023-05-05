import { useEffect, useState } from 'preact/hooks'
import { apiClient } from './client'

export function useMaxVoltages() {
    const [maxVoltages, setMaxVoltages] = useState<string[] | null>(null)

    const error: Error | null = null

    // Use effect, run once when component is mounted
    useEffect(() => {
        apiClient.getMaxVoltages().then(setMaxVoltages)
    }, [])

    return [maxVoltages, error]
}

export function useConductorsQuantities() {
    const [conductorsQuantites, setConductorsQuantities] = useState<string[] | null>(null)

    const error: Error | null = null

    // Use effect, run once when component is mounted
    useEffect(() => {
        apiClient.getConductorsQuantities().then(setConductorsQuantities)
    }, [])

    return [conductorsQuantites, error]
}

export function useShieldTypes() {
    const [shieldTypes, setShieldTypes] = useState<string[] | null>(null)

    const error: Error | null = null

    // Use effect, run once when component is mounted
    useEffect(() => {
        apiClient.getShiledTypes().then(setShieldTypes)
    }, [])

    return [shieldTypes, error]
}
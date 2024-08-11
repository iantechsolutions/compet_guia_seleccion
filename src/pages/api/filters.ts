import type { APIRoute } from 'astro'
import { readFilters } from '../../util/provider'

export const GET: APIRoute = async function get({ url }) {
    const filters = await readFilters()

    return Response.json({ filters })
}

import type { APIRoute } from "astro";
import fs from 'fs/promises'
import { productsEndpointQuerySchema, productsSchema } from "../../util/types";


export const get: APIRoute = async function get({ url }) {
    // Url query parameters to object. Example: ?foo=bar&baz=qux -> { foo: 'bar', baz: 'qux' }
    const query = Object.fromEntries(url.searchParams)

    // Use zod to validate the query parameters and transform them to the correct type
    const filters = productsEndpointQuerySchema.parse(query)

    // Read products database
    const data = await fs.readFile('./src/pages/api/data.json', 'utf-8')

    // Parse products database and convert it to the correct type
    const products = productsSchema.parse(JSON.parse(data))

    // Max required voltage
    const totalMaxVoltage = Math.max(filters.max_voltage_left || 0, filters.max_voltage_right || 0)

    // Filter products based on filters
    const filterProducts = products.filter((item) => {
        if(totalMaxVoltage > item.params.maxVoltage) return false
    })

    return {
        body: JSON.stringify(query)
    }
}
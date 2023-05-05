import type { APIRoute } from "astro";
import fs from 'fs/promises'
import { productsSchema } from "../../util/types";


export const get: APIRoute = async function get({ url }) {

    const data = await fs.readFile('./src/pages/api/data.json', 'utf-8')

    const products = productsSchema.parse(JSON.parse(data))

    return {
        body: JSON.stringify(products)
    }
}
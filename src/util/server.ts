import fs from "fs/promises";
import { FiltersValues, Product, productsSchema } from "./types";

let savedProducts: Product[] | null = null

export async function readProducts(filtersValues?: FiltersValues) {
    if(savedProducts != null) {
        return filterProducts(savedProducts, filtersValues)
    }

    // Read products database
    const data = await fs.readFile("./src/pages/api/data.json", "utf-8");

    // Parse products database and convert it to the correct type
    const products = productsSchema.parse(JSON.parse(data));

    savedProducts = products

    return filterProducts(products, filtersValues)
}

function filterProducts(products: Product[], filters?: FiltersValues) {
    if(!filters) return products

    const allFilters = getAllFilters(filters)

    const filteredProducts = products.filter((product) => {
        for (const key in allFilters) {
            const value = allFilters[key]

            if (!value.includes(product.params[key])) {
                return false
            }
        }

        return true
    })

    return filteredProducts
}

interface Filters { [key: string]: (string | number)[] }

function getAllFilters(filters: FiltersValues) {
    const allFilters: Filters = {}

    for (const key in filters.single) {
        const value = filters.single[key]

        if (!allFilters[key]) {
            allFilters[key] = []
        }

        allFilters[key].push(value)
    }

    // Do the same with multiple filters
    for (const params of filters.multiple) {
        for (const key in params) {
            const value = params[key]

            if (!allFilters[key]) {
                allFilters[key] = []
            }

            allFilters[key].push(value)
        }
    }

    return allFilters
}
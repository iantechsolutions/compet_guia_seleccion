import fs from "fs/promises";
import { type ExtractedFilters, type Product, type RawDataStructureDefinition, dataStructureDefinitionSchema, productsSchema } from "./types";
import { extractFilters } from "../functions/extract_filters";
import { transformProducts } from "../functions/transform_products";

let savedProducts: Product[] | null = null

export async function readProducts() {
    if (savedProducts != null) {
        return savedProducts
    }

    // Read products database
    const data = await fs.readFile("./src/pages/api/data.json", "utf-8");

    // Parse products database and convert it to the correct type
    const products = productsSchema.parse(JSON.parse(data));

    savedProducts = products

    return products
}

export async function readProductsTransformed() {
    const products = await readProducts()
    const filters = await readFilters()
    return transformProducts(products, filters)
}

export async function readRawFilters(): Promise<RawDataStructureDefinition> {
    const data = await fs.readFile("./src/pages/api/filters.json", "utf-8");

    return dataStructureDefinitionSchema.parse(JSON.parse(data))
}

export async function readFilters(): Promise<ExtractedFilters> {
    const rawFilters = await readRawFilters()
    return extractFilters(rawFilters)
}

export async function saveProducts(products: Product[]) {
    savedProducts = products

    await fs.writeFile("./src/pages/api/data_saved.json", JSON.stringify(products))
}
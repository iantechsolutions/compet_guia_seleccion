import fs from "fs/promises";
import { Product, dataStructureDefinitionSchema, productsSchema } from "./types";

let savedProducts: Product[] | null = null

export async function readProducts() {
    if(savedProducts != null) {
        return savedProducts
    }

    // Read products database
    const data = await fs.readFile("./src/pages/api/data.json", "utf-8");

    // Parse products database and convert it to the correct type
    const products = productsSchema.parse(JSON.parse(data));

    savedProducts = products

    return products
}

export async function readFilters() {
    const data = await fs.readFile("./src/pages/api/filters.json", "utf-8");

    try {
        const filtersDefinition = dataStructureDefinitionSchema.parse(JSON.parse(data))
        return filtersDefinition
    } catch (error) {
        console.log(error)
        throw error
    }
}
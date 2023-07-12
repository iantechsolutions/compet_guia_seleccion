import fs from "fs/promises";
import { type Product, type RawDataStructureDefinition, dataStructureDefinitionSchema, productsSchema, questionsFileSchema, QuestionFilter, ExtractedFilters } from "./types";
import { extractFilters } from "../functions/extract_filters";
import { transformProducts } from "../functions/transform_products";
import yaml from "yaml";
import { getDetailsFromUrl } from "./getDetailsFromUrl";

let savedProducts: Product[] | null = null

export async function readProducts() {
    if (savedProducts != null) {
        return savedProducts
    }

    // Read products database
    const data = await fs.readFile("./src/pages/api/data.json", "utf-8");

    // Parse products database and convert it to the correct type
    let products = productsSchema.parse(JSON.parse(data));

    // Get images from products
    products = await Promise.all(products.map(async product => ({
        ...product,
        ...await getDetailsFromUrl(product.url)
    })))

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

export async function readQuestions() {
    const filters = await readFilters()
    const data = await fs.readFile("./questions.yaml", "utf-8");

    const { groups } = questionsFileSchema.parse(yaml.parse(data))

    return groups.map(group => ({
        ...group,
        questions: group.questions.map((question): QuestionFilter => {
            const filter = filters[question.key]

            if (!filter) {
                throw new Error(`Filter with key "${question.key}" not found`)
            }

            return {
                ...question,
                type: "question",
                values: filter.values.map(value => ({
                    ...value,
                    icon: question.icons[value.key]
                }))
            }
        })
    }))
}

export async function saveProducts(products: Product[]) {
    savedProducts = products

    await fs.writeFile("./src/pages/api/data_saved.json", JSON.stringify(products))
}
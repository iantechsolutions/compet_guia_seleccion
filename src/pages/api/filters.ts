import type { APIRoute } from "astro";
import { productsSchema, type ConnectionFiltersParametersDefinitions, type ConnectionFiltersParametersValues, Product } from "../../util/types";
import fs from "fs/promises";

export const get: APIRoute = async function get({ url }) {

    const definitions: ConnectionFiltersParametersDefinitions = {
        single: [
            {
                key: 'CA_TECNOLOGA_PRINCIPAL',
                title: 'Tecnología principal',
            },
        ],
        multiple: [
            {
                key: 'CA_NIVEL_DE_TENSIN',
                title: 'Rango de tensión',
                description: 'Máxima tensión soportada',
            },
        ]
    }



    // Read products database
    const data = await fs.readFile("./src/pages/api/data.json", "utf-8");

    let products: Product[] = []

    try {
        // Parse products database and convert it to the correct type
        products = productsSchema.parse(JSON.parse(data));
    } catch (error) {
        console.log(error)
        return {
            status: 500,
            body: JSON.stringify(error),
        }
    }

    const values: ConnectionFiltersParametersValues = {}

    for(const product of products) {
        for(const key in product.params) {
            const value = product.params[key]

            if(value === null || value === undefined || value === '') continue

            if(!values[key]) {
                values[key] = []
            }

            if(!values[key].includes(value)) {
                values[key].push(value)
            }
        }
    }

    return {
        body: JSON.stringify({
            definitions, values
        }),
    };
};

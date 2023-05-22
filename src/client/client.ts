import { z } from "zod";
import { ConnectionFilterParameterDefinition, FiltersValues, Product, connectionFiltersParametersDefinitionsSchema, connectionFiltersParametersValuesSchema } from "../util/types";

export class ApiClient {
    async getFiltersAndValues() {
        const { definitions, values } = z.object({
            definitions: connectionFiltersParametersDefinitionsSchema,
            values: connectionFiltersParametersValuesSchema,
        }).parse(await fetch('/api/filters').then(r => r.json()))

        function mapDefinitionWithValue(definition: ConnectionFilterParameterDefinition) {
            const definitionValues = values[definition.key] || []

            return {
                ...definition,
                values: definitionValues.map(value => ({
                    label: definition.unit ? `${value} ${definition.unit}` : value.toString(),
                    value: value
                }))
            }
        }

        return {
            single: definitions.single.map(mapDefinitionWithValue),
            multiple: definitions.multiple.map(mapDefinitionWithValue),
        }
    }

    async getProducts(filtersValues: FiltersValues) {
        const response = await fetch(`/api/products/connector?filters=${encodeURIComponent(JSON.stringify(filtersValues))}`)

        const data = await response.json()

        return data as Product[]
    }

    static instance = new ApiClient();
}

export const apiClient = ApiClient.instance;
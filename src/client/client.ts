import { z } from "zod";
import { ConnectionFilterParameterDefinition, connectionFiltersParametersDefinitionsSchema, connectionFiltersParametersValuesSchema } from "../util/types";

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

    static instance = new ApiClient();
}

export const apiClient = ApiClient.instance;
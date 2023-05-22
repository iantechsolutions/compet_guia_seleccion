import { z } from "zod";
import { XMLParser } from "fast-xml-parser"

const parser = new XMLParser();

export const adittionalFieldsSchema = z.object({
    CAMPOS_ADICIONALES: z.record(z.string().or(z.number()))
})

export const productSchema = z.object({
    COD_ARTICU: z.string(),
    DESC_ADIC: z.string().optional(),
    DESCRIPCIO: z.string().optional(),
    TEXTO: z.string(),
    FECHA_MODI: z.string().optional(),
    "Incluido en Guia": z.string(),
    CAMPOS_ADICIONALES: z.string().optional().transform((value) => {
        if(!value) return {}
        const xmlParsed = parser.parse(value)
        return adittionalFieldsSchema.parse(xmlParsed).CAMPOS_ADICIONALES
    })
}).transform((value) => {
    const additionalFields = value.CAMPOS_ADICIONALES

    for(const key in additionalFields) {
        additionalFields[key] = additionalFields[key].toString()
    }

    return {
        code: value.COD_ARTICU,
        name: value.DESCRIPCIO,
        description: value.TEXTO,
        params: additionalFields
    }
})

export const productsSchema = z.array(productSchema)

export type Product = z.infer<typeof productSchema>
export type AdittionalFields = z.infer<typeof adittionalFieldsSchema>

export const connectionFilterParameterDefinitionSchema = z.object({
    // Internal identification (not readable by the user), ex: max_voltage
    key: z.string(),
    // Title
    title: z.string(),
    // Optional description
    description: z.string().optional().nullable(),
    // Example: kV, m, kg
    unit: z.string().optional().nullable(),
})

export const connectionFiltersParametersDefinitionsSchema = z.object({
    // Apply to the connection itslef (both conductors)
    single: z.array(connectionFilterParameterDefinitionSchema),
    // Apply separately to each side of the connection
    multiple: z.array(connectionFilterParameterDefinitionSchema),
})

export const connectionFiltersParametersValuesSchema = z.record(z.string(), z.array(z.string().or(z.number())))

export type ConnectionFilterParameterDefinition = z.infer<typeof connectionFilterParameterDefinitionSchema>
export type ConnectionFiltersParametersDefinitions = z.infer<typeof connectionFiltersParametersDefinitionsSchema>
export type ConnectionFiltersParametersValues = z.infer<typeof connectionFiltersParametersValuesSchema>


export const filtersValuesSchema = z.object({
    single: z.record(z.string(), z.string().or(z.number())),
    multiple: z.array(z.record(z.string(), z.string().or(z.number()))),
})

export type FiltersValues = z.infer<typeof filtersValuesSchema>

export const productsEndpointQuerySchema = z.object({
    filters: z.string().optional().transform((value) => {
        if(!value) return {
            single: {},
            multiple: []
        } as FiltersValues
        return filtersValuesSchema.parse(JSON.parse(value))
    })
})
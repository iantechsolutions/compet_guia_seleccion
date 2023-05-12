import { z } from "zod";
import { XMLParser } from "fast-xml-parser"

const parser = new XMLParser();

export const adittionalFieldsSchema = z.object({
    COMPONENTES_ADICIONALES: z.object({
        CAT_PRINCIPAL: z.string(),
        TENSION_MAX: z.number(),
        CANT_CONDUCTORES: z.number(),
        SECCION_MIN: z.number(),
        SECCION_MAX: z.number()
    })
})

export const productSchema = z.object({
    productID: z.string(),
    Name: z.string(),
    CamposAdicionales: z.string().transform((value) => {
        const xmlParsed = parser.parse(value)
        return adittionalFieldsSchema.parse(xmlParsed).COMPONENTES_ADICIONALES
    })
}).transform((value) => {
    return {
        id: value.productID,
        name: value.Name,
        params: {
            mainCat: value.CamposAdicionales.CAT_PRINCIPAL,
            maxVoltage: value.CamposAdicionales.TENSION_MAX,
            conductorsQuantity: value.CamposAdicionales.CANT_CONDUCTORES,
            sectionMin: value.CamposAdicionales.SECCION_MIN,
            sectionMax: value.CamposAdicionales.SECCION_MAX,
        }
    }
})

export const productsSchema = z.array(productSchema)

export type Product = z.infer<typeof productSchema>
export type AdittionalFields = z.infer<typeof adittionalFieldsSchema>

export const productsEndpointQuerySchema = z.object({
    max_voltage: z.string().transform((value) => parseInt(value)).optional(),
    conductors: z.string().transform((value) => parseInt(value)).optional(),
    section_right: z.string().transform((value) => parseInt(value)).optional(),
    section_left: z.string().transform((value) => parseInt(value)).optional(),
})

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

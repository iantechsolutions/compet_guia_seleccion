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
        if (!value) return {}
        const xmlParsed = parser.parse(value)
        return adittionalFieldsSchema.parse(xmlParsed).CAMPOS_ADICIONALES
    })
}).transform((value) => {
    const additionalFields = value.CAMPOS_ADICIONALES

    for (const key in additionalFields) {
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

// ---> Transformed products (see transform_products.ts)

export const productTransformedFiltersSchema = z.record(z.array(z.string()))

export type ProductTransformedFilters = z.infer<typeof productTransformedFiltersSchema>

export const transformedProductSchema = z.union([
    productSchema,
    z.object({ extracted_params: productTransformedFiltersSchema })
])

export type TransformedProduct = z.infer<typeof transformedProductSchema>

// ---> Data structure definition (like imported from filters.json)

// Checkbox group filter
export const filterDefinitionValueCheckboxSchema = z.object({
    label: z.string(),
    value: z.string(),
    type: z.literal('checkbox')
})

export const filterDefinitionCheckboxSchema = z.object({
    type: z.literal('checkbox-group'),
    label: z.string(),
    name: z.string(),
    values: z.array(filterDefinitionValueCheckboxSchema)
})

// Select filter
export const filterDefinitionValueSelectSchema = z.object({
    label: z.string(),
    value: z.string(),
})

export const filterDefinitionSelectSchema = z.object({
    type: z.literal('select'),
    label: z.string(),
    name: z.string(),
    values: z.array(filterDefinitionValueSelectSchema)
})

// Row
export const filterDefinitionRowSchema = z.object({
    type: z.literal('row'),
    label: z.string(), // 
    columns: z.number(),
    // Each Tabs contains a group of filters
    rowdata: z.array(z.array(filterDefinitionCheckboxSchema.or(filterDefinitionSelectSchema))),
})


// Group tabs sheet
export const filterDefinitionTabsGroupTabSchema = z.object({
    label: z.string(),
    value: z.string(),
    selected: z.boolean().optional(),
})

export const filterDefinitionTabsGroupSchema = z.object({
    type: z.literal('grouptabsheet'),
    label: z.string(), // 
    // Each Tabs contains a group of filters
    tabsdata: z.array(z.array(filterDefinitionCheckboxSchema.or(filterDefinitionSelectSchema).or(filterDefinitionRowSchema))),
    // Tab names are defined here
    values: z.array(filterDefinitionTabsGroupTabSchema)
})

export const dataStructureDefinitionSchema = z.array(filterDefinitionTabsGroupSchema.or(filterDefinitionCheckboxSchema.or(filterDefinitionSelectSchema).or(filterDefinitionRowSchema)))

export type RawDataStructureDefinition = z.infer<typeof dataStructureDefinitionSchema>

// ---> Extracted filters (see extract_filters.ts)

export const singleTransformedFilterSchema = z.array(z.object({
    key: z.string(),
    label: z.string(),
}))
export type SingleTransformedFilter = z.infer<typeof singleTransformedFilterSchema>

export const typedSingleTransformedFilterSchema = z.object({
    label: z.string(),
    type: z.union([z.literal('select'), z.literal('checkbox-group')]),
    values: singleTransformedFilterSchema,
})
export type TypedSingleTransformedFilter = z.infer<typeof typedSingleTransformedFilterSchema>

export const extractedFiltersSchema = z.record(typedSingleTransformedFilterSchema)
export type ExtractedFilters = z.infer<typeof extractedFiltersSchema>

// ---> Transformed filters (see filters.ts)

// Checkbox (can choose one or multiple values)
export const checkboxFilterSchema = z.object({
    type: z.literal('checkbox'),
    label: z.string(),
    key: z.string(),
    multiple: z.boolean(),
    values: z.array(z.object({
        label: z.string(),
        key: z.string(),
    }))
})

// Select (can choose only one value)
export const selectFilterSchema = z.object({
    type: z.literal('select'),
    label: z.string(),
    key: z.string(),
    values: z.array(z.object({
        label: z.string(),
        key: z.string(),
    }))
})

// Multiple filters (checkboxes and selects)
export const filterSubgroupGroupSchema = z.object({
    label: z.string(),
    description: z.string().optional(),
    filters: z.array(checkboxFilterSchema.or(selectFilterSchema)),
})

// Group of subgroups of filters
export const filterGroupSchema = z.object({
    label: z.string(),
    description: z.string().optional(),
    subgroups: z.array(filterSubgroupGroupSchema),
})

// Tabs (principal conductor and derivated conductors)
export const sideToSideFilterGroups = z.object({
    label: z.string(),
    description: z.string().optional(),
    left: filterGroupSchema,
    right: filterGroupSchema,
})

export const transformedFiltersSchema = z.array(filterGroupSchema.or(sideToSideFilterGroups))

export type CheckboxFilter = z.infer<typeof checkboxFilterSchema>
export type SelectFilter = z.infer<typeof selectFilterSchema>
export type FilterSubgroupGroup = z.infer<typeof filterSubgroupGroupSchema>
export type FilterGroup = z.infer<typeof filterGroupSchema>
export type SideToSideFilterGroups = z.infer<typeof sideToSideFilterGroups>
export type TransformedFilters = z.infer<typeof transformedFiltersSchema>
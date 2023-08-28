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
    OBSERVACIONES: z.string().optional().nullable().transform((value) => {
        if(!value) return undefined
        return value
    }),
    FECHA_MODI: z.string().optional(),
    "Incluido en Guia": z.string().optional().transform((value) => {
        if(!value) return true
        return value?.toLowerCase() === "si"
    }),
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
        shouldInclude: value["Incluido en Guia"],
        code: value.COD_ARTICU,
        name: value.DESCRIPCIO,
        description: value.TEXTO,
        text: value.TEXTO,
        url: value.OBSERVACIONES,
        params: additionalFields,
        picture: null as null | string,
        pdf: null as null | string,
    }
})

export const productsSchema = z.array(productSchema)

export type Product = z.infer<typeof productSchema>
export type AdittionalFields = z.infer<typeof adittionalFieldsSchema>

// ---> Transformed products (see transform_products.ts)

export const productTransformedFiltersSchema = z.record(z.array(z.string()))

export type ProductTransformedFilters = z.infer<typeof productTransformedFiltersSchema>


export const transformedProductSchema = productSchema.and(z.object({ extracted_params: productTransformedFiltersSchema }))

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


// We don't have selects and checkboxes anymore, we only have questions
// Only one value at a time and always required
export const questionFilterSchema = z.object({
    label: z.string(),
    description: z.string().optional(),
    key: z.string(),
    type: z.literal('question'),
    large_options: z.boolean().optional().default(false),
    icon: z.string().optional(),
    skippable: z.boolean().optional().default(false),
    skip_label: z.string().optional(),
    skip_icon: z.string().optional(),
    depends_on: z.record(z.string()).optional().default({}),
    values: z.array(z.object({
        label: z.string(),
        key: z.string(),
        icon: z.string().optional(),
    }))
})

export const importedQuestionFilterSchema = questionFilterSchema.pick({
    icon: true,
    key: true,
    label: true,
    description: true,
    large_options: true,
    depends_on: true,
    skip_icon: true,
    skip_label: true,
    skippable: true,
}).and(z.object({
    icons: z.record(z.string()).optional().default({}),
    options_order: z.array(z.string()).optional().default([]),
}))

export const questionsGroupSchema = z.object({
    label: z.string(),
    description: z.string().optional(),
    type: z.literal('group'),
    questions: z.array(questionFilterSchema),
})

export const importedQuestionsGroupSchema = z.object({
    label: z.string(),
    description: z.string().optional(),
    type: z.literal('group'),
    questions: z.array(importedQuestionFilterSchema),
})

export const questionsFileSchema = z.object({
    groups: z.array(importedQuestionsGroupSchema),
})

export const transformedFiltersSchema = z.array(questionsGroupSchema)

export type QuestionFilter = z.infer<typeof questionFilterSchema>
export type ImportedQuestionFilter = z.infer<typeof importedQuestionFilterSchema>
export type QuestionsGroup = z.infer<typeof questionsGroupSchema>
export type TransformedFilters = z.infer<typeof transformedFiltersSchema>

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never

export type SelectedFilter = {
    key: string
    questionIndex: number
    values: string[]
    question: QuestionFilter
}

export type SelectedFilters = SelectedFilter[]

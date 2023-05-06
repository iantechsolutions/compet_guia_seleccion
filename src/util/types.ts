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
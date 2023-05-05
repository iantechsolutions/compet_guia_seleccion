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
})

export type AdittionalFields = z.infer<typeof adittionalFieldsSchema>

export type Product = z.infer<typeof productSchema>

export const productsSchema = z.array(productSchema)
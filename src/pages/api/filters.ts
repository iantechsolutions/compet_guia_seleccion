import type { APIRoute } from "astro";
import type { ConnectionFiltersParametersDefinitions, ConnectionFiltersParametersValues } from "../../util/types";
import { map } from "zod";

export const get: APIRoute = async function get({ url }) {

    const definitions: ConnectionFiltersParametersDefinitions = {
        single: [
            {
                key: 'max_voltage',
                title: 'Tensión máxima',
                description: 'Máxima tensión soportada',
                unit: 'kV'
            },
        ],
        multiple: [
            {
                key: 'conductors_quantity',
                title: 'Conductors quantity',
            },
            {
                key: 'shield_type',
                title: 'Tipo de pantalla',
            },
        ]
    }

    const values: ConnectionFiltersParametersValues = new Map()

    values.set('max_voltage', [
        8, 15, 24, 36
    ])

    values.set('conductors_quantity', [
        1, 2, 3, 4
    ])

    values.set('shield_type', [
        'Cinta', 'Alambre',
    ])

    return {
        body: JSON.stringify({
            definitions, values
        }),
    };
};

// Transofrm raw filters (from "filters.json") to a better types and apply some changes if needed

import type { CheckboxFilter, ExtractedFilters, SelectFilter, TransformedFilters } from "./types";


// Preguntas

// La estructura se divide en grupos y subgrupos
// Todas las preguntas estan en subgrupos. Y todos los subgrupos estan en grupos.
// Las preguntas en un mismo subgrupo se muestran juntas, mientras que cada subgrupo se muestra independientemente.
// Los grupos grandes organizan subgrupos relacionados y tiene un título general.
// Los subgrupos tienen un título opcional

// Grupo general:
//  - Subgrupo 1:
//    1. Nivel de tensión (select)
//  - Subgrupo 2:
//    2. Tipo de accesorio (select)
//  - Subgrupo 3:
//    3. Tipo de tecnología (solo para algunos accesorios) (select)
//  - Subgrupo 4:
//    4. Uso interior o exterior (checkbox)
// Separacion lado a lado:
// (izquierda) Grupo cable principal:
//  - Subgrupo 1:
//    5. Número de fases del cable principal (checkbox)
//  - Subgrupo 2:
//    6. Tipo de Pantalla de la/s fase/s
//  - Subgrupo 3:
//    7. Sección de cable ppal. unipolar (checkbox)
//    8. Cable ppal. bipolar (mm2) (checkbox)
//    9. Cable ppal. tripolar (mm2) (checkbox)
//    10. Cable ppal. tripolar con neutro (mm2) (checkbox)
// (derecha) Grupo cable secundario:
//  - Subgrupo 1:
//    11. Cantidad de fases del cable derivado (checkbox)
// - Subgrupo 2:
//    12. Cable derivado unipolar (mm2) (checkbox)
//    13. Cable derivado bipolar (mm2)
//    14. Cable derivado tripolar (mm2)
//    15. Cable derivado tetrapolar (mm2)
// Grupo final: (debe aplicar a un solo tipo de accesorio pero no se)
//  - Subgrupo 1:
//    16. Interfaz / Corriente nominal de operación (select)
//    17. Tipo de separable (select)
//    18. Sistema de sujeción (select)



// Side note: acá podemos activar o desactviar, cambiar el orden, etc. de los filtros.
export function transformFilters(filters: ExtractedFilters): TransformedFilters {
    const transformedFilters: TransformedFilters = [
        {
            label: 'General',
            type: 'group',
            subgroups: [
                {
                    label: "",
                    filters: [
                        // 1
                        getFilterOfTypeSelect('CA_NIVEL_DE_TENSIN', filters),
                    ]
                },
                {
                    label: "",
                    filters: [
                        // 2
                        getFilterOfTypeSelect('CA_TIPO_DE_ACCESORIO', filters),
                    ]
                },
                {
                    label: "",
                    filters: [
                        // 3
                        getFilterOfTypeSelect('CA_TECNOLOGA_PRINCIPAL', filters),
                    ]
                },
                {
                    label: "",
                    filters: [
                        // 4
                        getFilterOfTypeCheckbox('CA_CHECKBOX-GROUP_1684438454148', filters),
                    ]
                },
            ]
        },
        {
            label: 'Conductores',
            type: 'side-to-side',
            left: {
                type: 'group',
                label: 'Cable principal',
                subgroups: [
                    {
                        label: "",
                        filters: [
                            // 5
                            getFilterOfTypeCheckbox('CA_CHECKBOX-GROUP_1684413233368', filters),
                        ]
                    },
                    {
                        label: "",
                        filters: [
                            // 6
                            getFilterOfTypeCheckbox('CA_CHECKBOX-GROUP_1684413076075', filters),
                        ]
                    },
                    {
                        label: "",
                        filters: [
                            // 7
                            getFilterOfTypeCheckbox('CA_CHECKBOX-GROUP_1684430004592', filters),
                            // 8
                            getFilterOfTypeCheckbox('CA_CHECKBOX-GROUP_1684430443116', filters),
                            // 9
                            getFilterOfTypeCheckbox('CA_CHECKBOX-GROUP_1684430969197', filters),
                            // 10
                            getFilterOfTypeCheckbox('CA_CHECKBOX-GROUP_1684431095631', filters),
                        ]
                    }
                ]
            },
            right: {
                type: 'group',
                label: 'Cable derivado',
                subgroups: [
                    {
                        label: "",
                        filters: [
                            // 11
                            getFilterOfTypeCheckbox('CA_CHECKBOX-GROUP_1684413315284', filters),
                        ]
                    },
                    {
                        label: "",
                        filters: [
                            // 12
                            getFilterOfTypeCheckbox('CA_CHECKBOX-GROUP_1684431809461', filters),
                            // 13
                            getFilterOfTypeCheckbox('CA_CHECKBOX-GROUP_1684431991660', filters),
                            // 14
                            getFilterOfTypeCheckbox('CA_CHECKBOX-GROUP_1684432348609', filters),
                            // 15
                            getFilterOfTypeCheckbox('CA_CHECKBOX-GROUP_1684432894891', filters),
                        ]
                    },
                ]
            }
        },
        {
            type: 'group',
            label: 'Últimas preguntas',
            subgroups: [
                {
                    label: "",
                    filters: [
                        // 16
                        getFilterOfTypeSelect('CA_INTERFAZ__CORRIENTE_NOMINAL_DE_OPERACIN', filters),
                        // 17
                        getFilterOfTypeSelect('CA_TIPO_DE_SEPARABLE', filters),
                        // 18
                        getFilterOfTypeSelect('CA_SISTEMA_DE_SUJECIN', filters),
                    ]
                }
            ]
        }

    ]

    return transformedFilters
}

function getFilterOfTypeCheckbox(key: string, filters: ExtractedFilters, isMultiple = true): CheckboxFilter {
    if (!filters[key]) {
        throw new Error(`Filter with key "${key}" not found`)
    }
    if (filters[key].type != 'checkbox-group') {
        throw new Error(`Filter with key "${key}" is not of type "checkbox-group"`)
    }

    return { key, ...filters[key], type: 'checkbox', multiple: isMultiple }
}

function getFilterOfTypeSelect(key: string, filters: ExtractedFilters): SelectFilter {
    if (!filters[key]) {
        throw new Error(`Filter with key "${key}" not found`)
    }
    if (filters[key].type != 'select') {
        throw new Error(`Filter with key "${key}" is not of type "select"`)
    }

    return { key, ...filters[key], type: 'select' }
}
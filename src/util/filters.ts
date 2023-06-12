// Transofrm raw filters (from "filters.json") to a better types and apply some changes if needed

import type { ExtractedFilters, QuestionFilter, QuestionsGroup, TransformedFilters } from "./types";

// Preguntas

// Grupo general:
//    1. Nivel de tensión (select)
//    2. Tipo de accesorio (select)
//    3. Tipo de tecnología (solo para algunos accesorios) (select)
//    4. Uso interior o exterior (checkbox)
// Grupo cable principal:
//    5. Número de fases del cable principal (checkbox)
//    6. Tipo de Pantalla de la/s fase/s
//    7. Sección de cable ppal. unipolar (checkbox)
//    8. Cable ppal. bipolar (mm2) (checkbox)
//    9. Cable ppal. tripolar (mm2) (checkbox)
//    10. Cable ppal. tripolar con neutro (mm2) (checkbox)
// Grupo cable secundario:
//    11. Cantidad de fases del cable derivado (checkbox)
//    12. Cable derivado unipolar (mm2) (checkbox)
//    13. Cable derivado bipolar (mm2)
//    14. Cable derivado tripolar (mm2)
//    15. Cable derivado tetrapolar (mm2)
// Grupo final: (debe aplicar a un solo tipo de accesorio pero no se)
//    16. Interfaz / Corriente nominal de operación (select)
//    17. Tipo de separable (select)
//    18. Sistema de sujeción (select)



// Side note: acá podemos activar o desactviar, cambiar el orden, etc. de los filtros.
export function transformFilters(filters: ExtractedFilters): TransformedFilters {
    const transformedFilters: TransformedFilters = [
        {
            label: 'General',
            type: "group",
            questions: [
                getFilter('CA_NIVEL_DE_TENSIN', filters),
                getFilter('CA_TIPO_DE_ACCESORIO', filters),
                getFilter('CA_TECNOLOGA_PRINCIPAL', filters),
                getFilter('CA_CHECKBOX-GROUP_1684438454148', filters),
            ]
        },
        {
            label: 'Conductor principal',
            type: "group",
            questions: [

                getFilter('CA_CHECKBOX-GROUP_1684413233368', filters),
                getFilter('CA_CHECKBOX-GROUP_1684413076075', filters),
                getFilter('CA_CHECKBOX-GROUP_1684430004592', filters),
                getFilter('CA_CHECKBOX-GROUP_1684430443116', filters),
                getFilter('CA_CHECKBOX-GROUP_1684430969197', filters),
                getFilter('CA_CHECKBOX-GROUP_1684431095631', filters),
            ]
        },
        {
            label: 'Conductor derivado',
            type: "group",
            questions: [
                getFilter('CA_CHECKBOX-GROUP_1684413315284', filters),
                getFilter('CA_CHECKBOX-GROUP_1684431809461', filters),

                getFilter('CA_CHECKBOX-GROUP_1684431991660', filters),
                getFilter('CA_CHECKBOX-GROUP_1684432348609', filters),
                getFilter('CA_CHECKBOX-GROUP_1684432894891', filters),
            ]
        },
        {
            label: 'Últimas preguntas',
            type: "group",
            questions: [
                getFilter('CA_INTERFAZ__CORRIENTE_NOMINAL_DE_OPERACIN', filters),
                getFilter('CA_TIPO_DE_SEPARABLE', filters),
                getFilter('CA_SISTEMA_DE_SUJECIN', filters),
            ]
        },
    ]

    return transformedFilters
}

interface ExtraOptions {
    icon?: string
    large_options?: boolean
    depends_on?: Record<string, string>
}

function getFilter(key: string, filters: ExtractedFilters, opts?: ExtraOptions): QuestionFilter {
    if (!filters[key]) {
        throw new Error(`Filter with key "${key}" not found`)
    }

    return { key, ...filters[key], type: 'question', icon: opts?.icon, large_options: opts?.large_options || false, depends_on: opts?.depends_on || {} }
}

export function flattenQuestions(filters: TransformedFilters) {
    const flattenedFilters: FlatQuestionFilter[] = []

    for (const group of filters) {
        group.questions.forEach(q => flattenedFilters.push({ ...q, parent: group, }))
    }

    return flattenedFilters
}

export interface FlatQuestionFilter extends QuestionFilter {
    parent: QuestionsGroup
}

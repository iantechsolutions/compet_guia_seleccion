// Transofrm raw filters (from "filters.json") to a better types and apply some changes if needed

import type {
    QuestionFilter,
    QuestionsGroup,
    TransformedFilters
} from './types'

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

export function flattenQuestions(filters: TransformedFilters) {
    const flattenedFilters: FlatQuestionFilter[] = []

    for (const group of filters) {
        group.questions.forEach((q) =>
            flattenedFilters.push({ ...q, parent: group })
        )
    }

    return flattenedFilters
}

export interface FlatQuestionFilter extends QuestionFilter {
    parent: QuestionsGroup
}

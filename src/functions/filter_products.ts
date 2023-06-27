import type { QuestionFilter, SelectedFilters, TransformedProduct } from "../util/types";

export function filterProducts(products: TransformedProduct[], filters: SelectedFilters) {
    return products.filter(product => {

        for(const question of filters) {
            const intersection = arrayValuesIntersection(product.extracted_params[question.key], question.values)
            if(intersection.length == 0) {
                return false
            }
        }

        return true
    })
}

export function shouldIgnoreQuestionOption(filteredProducts: TransformedProduct[], nextKey: string, nextValues: string[]) {
    const products = filterProducts(filteredProducts, [{ key: nextKey, values: nextValues, questionIndex: 999999 }])
    return products.length === 0
}

export function shouldIgnoreQuestion(filteredProducts: TransformedProduct[], nextQuestion: QuestionFilter) {
    for(const value of nextQuestion.values) {
        if(!shouldIgnoreQuestionOption(filteredProducts,  nextQuestion.key, [value.key])) {
            return false
        }   
    }
    return true
}

export function arrayValuesIntersection(a: string[], b: string[]) {
    return a.filter(value => b.includes(value))
}


// export function filterProducts(products: TransformedProduct[], filters: SelectedFilters, allFilters: QuestionFilter[]) {
//     const filtersAsMap = new Map(allFilters.map(filter => [filter.key, filter]))

//     return products.filter(product => {
//         for (const key in filters) {
//             if (filters[key].length == 0) {
//                 continue
//             }

//             let setContinue = false

//             const params = product.extracted_params[key]

//             for (const param of params) {
//                 if (filters[key].includes(param)) {
//                     setContinue = true
//                     continue
//                 }
//             }

//             if (setContinue) {
//                 continue
//             }

//             return false
//         }

//         return true
//     })
// }

// export function shouldIgnoreQuestion(products: TransformedProduct[], filters: SelectedFilters, extraFilters: { key: string, values: string[] }[], allFilters: QuestionFilter[]) {
//     if(extraFilters.length == 0) {
//         const filtered = filterProducts(products, filters, allFilters)
//         return filtered.length == 0
//     }
    
//     for (const extraFilter of extraFilters) {
//         const filtered = filterProducts(products, { ...filters, [extraFilter.key]: extraFilter.values }, allFilters)
//         if (filtered.length != 0) {
//             return false
//         }
//     }
//     return true
// }
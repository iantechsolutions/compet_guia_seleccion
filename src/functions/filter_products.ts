import type { CheckboxFilter, SelectFilter, SelectedFilters, TransformedProduct } from "../util/types";

export function filterProducts(products: TransformedProduct[], filters: SelectedFilters, allFilters: (SelectFilter | CheckboxFilter)[]) {
    const filtersAsMap = new Map(allFilters.map(filter => [filter.key, filter]))

    return products.filter(product => {
        for (const key in filters) {
            if(filtersAsMap.get(key)?.type === 'checkbox' && filters[key].length === 0) {
                return false
            }
            
            if (filters[key].length == 0) {
                continue
            }

            let setContinue = false

            const params = product.extracted_params[key]

            if (params.length == 0 || (params.length == 1 && params[0] == '') && filtersAsMap.get(key)?.ignoreIfEmpty) {
                continue
            }

            for (const param of params) {
                if (filters[key].includes(param)) {
                    setContinue = true
                    continue
                }
            }

            if (setContinue) {
                continue
            }

            return false
        }

        return true
    })
}

export function shouldIgnoreQuestion(products: TransformedProduct[], filters: SelectedFilters, extraFilters: { key: string, values: string[] }[], allFilters: (SelectFilter | CheckboxFilter)[]) {
    if(extraFilters.length == 0) {
        const filtered = filterProducts(products, filters, allFilters)
        return filtered.length == 0
    }
    
    for (const extraFilter of extraFilters) {
        const filtered = filterProducts(products, { ...filters, [extraFilter.key]: extraFilter.values }, allFilters)
        if (filtered.length != 0) {
            return false
        }
    }
    return true
}
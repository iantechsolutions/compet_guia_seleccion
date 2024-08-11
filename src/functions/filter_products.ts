import type {
	QuestionFilter,
	SelectedFilters,
	TransformedProduct,
} from "../util/types";

export function filterProducts(
	products: TransformedProduct[],
	filters: SelectedFilters,
) {
	return products.filter((product) => {
		for (const filter of filters) {
			if (filter.values.length == 1 && filter.values[0] == "__skip_question") {
				continue;
			}

			const intersection = arrayValuesIntersection(
				product.extracted_params[filter.key],
				filter.values,
			);

			if (intersection.length == 0) {
				return false;
			}
		}

		return true;
	});
}

export function shouldIgnoreQuestionOption(
	filteredProducts: TransformedProduct[],
	nextQuestion: QuestionFilter,
	nextValues: string[],
) {
	const products = filterProducts(filteredProducts, [
		{
			key: nextQuestion.key,
			values: nextValues,
			questionIndex: 999999,
			question: nextQuestion,
		},
	]);
	return products.length == 0;
}

export function shouldIgnoreQuestion(
	filteredProducts: TransformedProduct[],
	appliedFilters: SelectedFilters,
	nextQuestion: QuestionFilter,
) {
	const dependsOnKeys = Object.keys(nextQuestion.depends_on);

	let options = nextQuestion.skippable ? 1 : 0;

	if (filteredProducts.length === 1) return true;

	if (dependsOnKeys.length > 0) {
		for (const key of dependsOnKeys) {
			const filter = appliedFilters.find((filter) => filter.key == key);
			const expectedValue = nextQuestion.depends_on[key];
			const foundValue = !!filter?.values.find((v) => v == expectedValue);

			// console.table([
			//     { key, value: expectedValue, filterKey: filter?.key, filterValues: filter?.values, filterValue: filter?.values[0] }
			// ])

			if (!foundValue) {
				return true;
			}
		}
	}

	for (const value of nextQuestion.values) {
		if (
			!shouldIgnoreQuestionOption(filteredProducts, nextQuestion, [value.key])
		) {
			options++;
			if (options > 1) {
				return false;
			}
		}
	}
	return true;
}

export function arrayValuesIntersection(a: string[], b: string[]) {
	return a.filter((value) => b.includes(value));
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

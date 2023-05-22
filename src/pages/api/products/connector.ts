import type { APIRoute } from "astro";
import fs from "fs/promises";
import { FiltersValues, productsEndpointQuerySchema, productsSchema } from "../../../util/types";

export const get: APIRoute = async function get({ url }) {
  // Url query parameters to object. Example: ?foo=bar&baz=qux -> { foo: 'bar', baz: 'qux' }
  const query = Object.fromEntries(url.searchParams);

  // Use zod to validate the query parameters and transform them to the correct type
  const { filters } = productsEndpointQuerySchema.parse(query);

  // Read products database
  const data = await fs.readFile("./src/pages/api/data.json", "utf-8");

  // Parse products database and convert it to the correct type
  const products = productsSchema.parse(JSON.parse(data));

  const allFilters = getAllFilters(filters)

  const filteredProducts = products.filter((product) => {
    for (const key in allFilters) {
      const value = allFilters[key]

      if (!value.includes(product.params[key])) {
        return false
      } 
    }

    return true
  })

  return {
    body: JSON.stringify(filteredProducts),
  };
};

interface Filters { [key: string]: (string | number)[] }

function getAllFilters(filters: FiltersValues) {
  const allFilters: Filters = {}

  for (const key in filters.single) {
    const value = filters.single[key]

    if (!allFilters[key]) {
      allFilters[key] = []
    }

    allFilters[key].push(value)
  }

  // Do the same with multiple filters
  for (const params of filters.multiple) {
    for (const key in params) {
      const value = params[key]

      if (!allFilters[key]) {
        allFilters[key] = []
      }

      allFilters[key].push(value)
    }
  }

  return allFilters
}
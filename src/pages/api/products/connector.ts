import type { APIRoute } from "astro";
import { FiltersValues, productsEndpointQuerySchema, productsSchema } from "../../../util/types";
import { readProducts } from "../../../util/server";

export const get: APIRoute = async function get({ url }) {
  // Url query parameters to object. Example: ?foo=bar&baz=qux -> { foo: 'bar', baz: 'qux' }
  const query = Object.fromEntries(url.searchParams);

  // Use zod to validate the query parameters and transform them to the correct type
  const { filters } = productsEndpointQuerySchema.parse(query);

  const products = await readProducts(filters);

  return {
    body: JSON.stringify(products),
  };
};



import type { APIRoute } from "astro";
import fs from "fs/promises";
import { productsEndpointQuerySchema, productsSchema } from "../../util/types";

export const get: APIRoute = async function get({ url }) {
  // Url query parameters to object. Example: ?foo=bar&baz=qux -> { foo: 'bar', baz: 'qux' }
  const query = Object.fromEntries(url.searchParams);

  // Use zod to validate the query parameters and transform them to the correct type
  const filters = productsEndpointQuerySchema.parse(query);

  // Read products database
  const data = await fs.readFile("./src/pages/api/data.json", "utf-8");

  // Parse products database and convert it to the correct type
  const products = productsSchema.parse(JSON.parse(data));
  const maxSection = Math.max(
    filters.section_left ?? 0,
    filters.section_right ?? 0
  );
  const minSection = Math.min(
    filters.section_left ?? 0,
    filters.section_right ?? 0
  );
  // Filter products based on filters
  const filterProducts = products.filter((item) => {
    return (
      item.params.mainCat === "Empalme" &&
      (!filters.max_voltage || filters.max_voltage <= item.params.maxVoltage) &&
      maxSection <= item.params.sectionMax &&
      minSection >= item.params.sectionMin &&
      filters.conductors === item.params.conductorsQuantity
    );
  });

  return {
    body: JSON.stringify(filterProducts),
  };
};

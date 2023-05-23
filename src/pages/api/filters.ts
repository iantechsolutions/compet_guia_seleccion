import type { APIRoute } from "astro";
import { readFilters } from "../../util/server";

export const get: APIRoute = async function get({ url }) {

    const filters = await readFilters();

    return {
        body: JSON.stringify({
            filters
        }),
    };
};

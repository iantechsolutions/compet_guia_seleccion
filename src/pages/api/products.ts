import type { APIRoute, EndpointHandler, EndpointOutput } from 'astro'

export const get: APIRoute = async function get({ params, request, url, clientAddress, generator, cookies, props, redirect, site }) {
    // Ex: /api/product/:id -> params.id
    console.log(params)
    // url -> url.hred, url.pathname, etc...
    console.log(url.searchParams)
    return {
        body: JSON.stringify([
            {
                id: 1,
                name: 'Product 1',
            }
        ]),
    };
}
import type { EndpointHandler, EndpointOutput } from 'astro'

export async function get({ params, request }: EndpointHandler): Promise<EndpointOutput> {
    return {
        body: JSON.stringify([
            {
                id: 1,
                name: 'Product 1',
            }
        ]),
    };
}
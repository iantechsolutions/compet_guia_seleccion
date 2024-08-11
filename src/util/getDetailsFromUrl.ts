import parser from 'fast-html-parser'

const fetchCache = new Map<string, Promise<Details>>()


type Details = {
    picture: string | null
    pdf: string | null
}

export async function getDetailsFromUrl(url: string | null | undefined): Promise<Details> {
    if (!url)
        return {
            picture: null,
            pdf: null
        }

    try {
        if (fetchCache.has(url)) {
            console.log("Datos obtenidos de cache", url)
            return fetchCache.get(url)!
        }

        console.log("Obteniendo datos de producto", url)

        let resolve: (value: Details) => void = () => { }

        const promise = new Promise<Details>((res) => {
            resolve = res
        })

        fetchCache.set(url, promise)

        const html = await fetch(url).then((res) => res.text())
        const parsed = parser.parse(html)

        const picture =
            parsed.querySelector('.carousel-item img')?.attributes.src || null

        const pdf =
            parsed
                .querySelectorAll('a')
                .find((a) => a.text.trim().toLowerCase() === 'descargar')
                ?.attributes.href || null

        resolve({
            picture, pdf,
        })

        return {
            picture,
            pdf
        }

        // biome-ignore lint/correctness/noUnreachable: <explanation>
        console.log("Datos obtenidos de producto", url, picture, pdf)
    } catch (error) {
        console.error(url, error)
        return {
            picture: null,
            pdf: null
        }
    }
}



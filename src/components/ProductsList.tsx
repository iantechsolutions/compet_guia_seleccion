import classNames from "classnames"
import type { TransformedProduct } from "../util/types"

interface Props {
    products: TransformedProduct[]
    showTitle?: boolean
}

function gtag(...args: any[]) {
    return (window as any).gtag(...args)
}

export function ProductsList({ products, showTitle }: Props) {
    return <div>
        {/* {showTitle && <h1 className="my-2 text-lg">Se encontraron {products.length} productos</h1>} */}

        {products.map(product => {
            const whatsappURL = new URL('https://api.whatsapp.com/send/?phone=5491140444515&type=phone_number')

            const message = `Hola, me gustaría recibir información sobre:\n${product.text}`

            whatsappURL.searchParams.set('text', message)

            const mailUrl = new URL('mailto:ventas@competsa.com')

            mailUrl.searchParams.set('subject', `Consulta sobre ${product.text}`)
            mailUrl.searchParams.set('body', message)

            return <div className="flex flex-row md:items-center md:justify-between border-b border-gray-200 py-4 last:border-none">
                <div className="flex flex-row md:items-center gap-2">
                    {product.picture && <img className="w-24 h-24 object-contain" src={product.picture} alt={product.name} />}
                    <div className="flex flex-col">
                        <h2 className="text-sm font-semibold max-w-[600px]">{product.text}</h2>
                        {/* <h2 className="text-lg bg-primary font-semibold">{product.name}</h2>
                        <p className="text-sm font-semibold max-w-[600px] mt-2">{product.description}</p> */}

                        {/* <a href={product.url} className="bg-primary text-white px-4 py-2 rounded-md text-sm whitespace-nowrap">Detalles</a> */}
                        <div className="flex gap-1">
                            <a href={whatsappURL.href} target="_blank" onClick={() => {
                                gtag('event', 'contact_whatsapp', {
                                    'message': message,
                                    'product': product.text,
                                })
                            }}>
                                <img src="/whatsapp.png" alt="Consultar por Whatsapp" className="h-[30px]" />
                            </a>
                            <a href={mailUrl.href} target='_blank' onClick={() => {
                                gtag('event', 'contact_email', {
                                    'message': message,
                                    'product': product.text,
                                })
                            }}>
                                <img src="/mail-with-circle.svg" alt="Consultar por email" className="h-[30px]" />
                            </a>
                            {product.pdf && <a href={product.pdf} target='_blank' onClick={() => {
                                gtag('event', 'contact_pdf', {
                                    'message': message,
                                    'product': product.text,
                                })
                            }}>
                                <img src="/pdf.png" alt="Descargar PDF" className="h-[30px]" />
                            </a>}
                            <a href={product.url || 'https://competsa.com/'} target='_blank' onClick={() => {
                                gtag('event', 'contact_webpage', {
                                    'message': message,
                                    'product': product.text,
                                })
                            }}>
                                <img src="/sitio-web.png" alt="Sitio web" className="h-[30px]" />
                            </a>


                            {/* <a target='_blank' href={product.url} className="border-primary border-2 px-2 py-1 rounded-md text-sm whitespace-nowrap text-primary">Contacto</a> */}
                            {/* {product.pdf && <a target='_blank' href={product.pdf} className=" border-primary border-2 bg-primary text-white px-2 py-1 rounded-md text-sm whitespace-nowrap">Ficha técnica</a>} */}
                        </div>

                    </div>
                </div>
            </div>
        })}
    </div>
}
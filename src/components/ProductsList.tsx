import classNames from "classnames"
import type { TransformedProduct } from "../util/types"

interface Props {
    products: TransformedProduct[]
    showTitle?: boolean
}

export function ProductsList({ products, showTitle }: Props) {

    return <div>
        {/* {showTitle && <h1 className="my-2 text-lg">Se encontraron {products.length} productos</h1>} */}

        {products.map(product => {

            return <div className="flex flex-row md:items-center md:justify-between border-b border-gray-200 py-4 last:border-none">
                <div className="flex flex-row md:items-center gap-2">
                    {product.picture && <img className="w-24 h-24 object-contain" src={product.picture} alt={product.name} />}
                    <div className="flex flex-col">
                        <h2 className="text-sm font-semibold max-w-[600px]">{product.text}</h2>
                        {/* <h2 className="text-lg bg-primary font-semibold">{product.name}</h2>
                        <p className="text-sm font-semibold max-w-[600px] mt-2">{product.description}</p> */}

                        {/* <a href={product.url} className="bg-primary text-white px-4 py-2 rounded-md text-sm whitespace-nowrap">Detalles</a> */}
                        <div className="flex gap-1">
                            <a target='_blank' href={product.url} className="border-primary border-2 px-2 py-1 rounded-md text-sm whitespace-nowrap text-primary">Contacto</a>
                            {product.pdf && <a target='_blank' href={product.pdf} className=" border-primary border-2 bg-primary text-white px-2 py-1 rounded-md text-sm whitespace-nowrap">Ficha técnica</a>}
                        </div>

                    </div>
                </div>
            </div>
        })}
    </div>
}
import type { TransformedProduct } from "../util/types"

interface Props {
    products: TransformedProduct[]
    showTitle?: boolean
}

export function ProductsList({ products, showTitle }: Props) {

    return <div>
        {showTitle && <h1 className="my-2 text-lg">Se encontraron {products.length} productos</h1>}

        {products.map(product => {

            return <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 py-4">
                <div className="flex flex-col md:flex-row md:items-center">
                    {/* <img className="w-24 h-24 object-contain" src={product.image} alt={product.name} /> */}
                    <div className="flex flex-col _md:ml-4">
                        <h2 className="text-lg text-blue-500 font-semibold">{product.name}</h2>
                        <p className="text-sm font-semibold max-w-[600px] mt-2">{product.description}</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    {/* <div className="flex flex-col md:flex-row md:items-center">
                        <p className="text-sm">Desde</p>
                        <p className="text-lg font-bold ml-2">{product.price}</p>
                    </div> */}
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm whitespace-nowrap">Detalles</button>
                </div>
            </div>
        })}
    </div>
}
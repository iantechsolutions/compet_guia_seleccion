import { useState } from "preact/hooks";
import type { FiltersValues } from "../util/types";
import FilterEmpalme from "./FilterEmpalme";
import { useProducts } from "../client/hooks";

export default function Selector() {
    const [filtersValues, setFiltersValues] = useState<FiltersValues>({
        multiple: [],
        single: {}
    })

    const products = useProducts(filtersValues)

    return (
        <div className="sm:w-[85%] md:w-[70%] mx-auto px-3">
            <div className="grid sm:grid-cols-2 gap-3">
                <div>
                    <div class="h-36 flex justify-center ">
                        <img src="/connection_left.png" className="h-36" />
                    </div>
                    <FilterEmpalme
                        onFiltersValuesChange={setFiltersValues}
                    />
                </div>
                <div>
                    <div className="text-center text-gray-600 font-semibold py-2 cursor-pointer relative">
                        Productos
                    </div>
                    <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr)' }}>
                        {products.slice(0, 30).map(product => <div className="block border p-2 rounded-xl">
                            <h3>{product.name}</h3>
                        </div>)}
                    </div>
                </div>
            </div>

        </div>
    )
}
import { useEffect, useState } from "preact/hooks";
import type { FiltersValues } from "../util/types";
import FilterEmpalme from "./FilterEmpalme";
import Tabs from "./Tabs";

export default function Selector() {
    const [filtersValues, setFiltersValues] = useState<FiltersValues>({
        multiple: [],
        single: {}
    })

    console.log(filtersValues)

    useEffect(() => {
        fetch(`/api/products/connector?filters=${encodeURIComponent(JSON.stringify(filtersValues))}`).then(res => res.json()).then(products => {
            console.log(products)
        })
    }, [ filtersValues ])


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
                </div>
            </div>

        </div>
    )
}
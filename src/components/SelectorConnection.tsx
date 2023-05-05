import FilterEmpalme from "./FilterEmpalme";
import Tabs from "./Tabs";

export default function Selector() {

    return (
        <div className="sm:w-[85%] md:w-[70%] mx-auto px-3">
            <div className="grid sm:grid-cols-2 gap-3">
                <div>
                    <div class="h-36 flex justify-center ">
                        <img src="/connection_left.png" className="h-36" />
                    </div>
                    <Tabs
                        titles={["Izquierda", "Derecha"]}
                    >
                        {[
                            <FilterEmpalme />,
                            <FilterEmpalme />
                        ]}
                    </Tabs>
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
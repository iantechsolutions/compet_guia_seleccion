import type { ArrayElement, FilterGroup, SideToSideFilterGroups, TransformedFilters, TransformedProduct } from "../util/types";

export default function Questions({ filters, products }: { filters: TransformedFilters, products: TransformedProduct[] }) {
    return (
        <div>
            <h1 className="text-2xl">Filtros</h1>
            {/* <pre>{JSON.stringify(filters, null, 2)}</pre>
            <pre>{JSON.stringify(products, null, 2)}</pre> */}
            {filters.map((filter) => {
                if (filter.type === 'group') {
                    return <GroupRender group={filter} />
                }
                if (filter.type === 'side-to-side') {
                    return <SideToSideRender sideToSide={filter} />
                }
            })}
        </div>
    )
}

export function SideToSideRender({ sideToSide }: { sideToSide: SideToSideFilterGroups }) {
    return (
        <div class="bg-gray-400 grid grid-cols-2 gap-2">
           <div class="">
                <GroupRender group={sideToSide.left}/>
           </div>
           <div class="">
                <GroupRender group={sideToSide.right}/>
           </div>
        </div>
    )
}

export function GroupRender({ group }: { group: FilterGroup }) {
    return (
        <div>
            <h2 className="text-xl">{group.label}</h2>
            {
                group.subgroups.map((subgroup) => <SubGroupRender subgroup={subgroup} />)
            }
        </div>
    )
}

export function SubGroupRender({ subgroup }: { subgroup: ArrayElement<FilterGroup['subgroups']> }) {
    return (
        <div className="ml-4">
            {subgroup.label && <h3 className="text-lg">{subgroup.label}</h3>}
            {
                subgroup.filters.map((filter) => {

                    if(filter.type === 'select') return <SelectRender filter={filter} />
                    if(filter.type === 'checkbox') return <CheckboxRender filter={filter} />
                })
            }
        </div>
    )
}

export function SelectRender({ filter }: { filter: ArrayElement<ArrayElement<FilterGroup['subgroups']>['filters']> }) {
    return (
        <div>
            <p>{filter.label}</p>
            <select>
                {filter.values.map((value) => {
                    return <option>{value.label}</option>
                })}
            </select>
        </div>
    )
}
export function CheckboxRender({ filter }: { filter: ArrayElement<ArrayElement<FilterGroup['subgroups']>['filters']> }) {
    return (
        <div>
            <p>{filter.label}</p>
            <ul>
                {filter.values.map((value) => {
                    return <li className="ml-4">
                        <input type="checkbox" />
                        {value.label}
                    </li>
                })}
            </ul>
        </div>
    )
}

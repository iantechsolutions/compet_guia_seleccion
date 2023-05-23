import { useDefinitionsAndValues, useFiltersValues } from "../client/hooks";
import Card, { CardContent, CardTitle } from "./Card";
import { Chip, SkeletonChip } from "./Chip";
import { useEffect, useState } from 'preact/hooks'
import Tabs from "./Tabs";
import TabButton from "./TabButton";
import type { FiltersValues } from "../util/types";

interface Props {
    onFiltersValuesChange: (filtersValues: FiltersValues) => unknown
}

export default function FilterEmpalme({ onFiltersValuesChange }: Props) {

    const [definitionsAndValues, error] = useDefinitionsAndValues();

    const { filtersValues, setSingleValue, setMultipleValue } = useFiltersValues()

    const [tabIndex, setTabIndex] = useState(0)

    useEffect(() => {
        onFiltersValuesChange(filtersValues)
    }, [filtersValues, onFiltersValuesChange])

    function CardsList(props: { filters: NonNullable<typeof definitionsAndValues>['multiple'], setValue: (key: string, value: string | number | undefined | null) => unknown, values: { [key: string]: string | number } }) {
        return <>{props.filters?.map(({ key, title, values, unit }) => <div class="mb-3">
            <Card>
                <CardTitle>{title}</CardTitle>
                <CardContent>
                    <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr)' }}>
                        {values.map(value => <Chip selected={value.value === props.values[key]} onClick={() => props.setValue(key, value.value)}>{value.label}</Chip>)}
                    </div>
                </CardContent>
            </Card>
        </div>)}</>
    }

    return (<div>
        <TabButton
            title="General"
            selected={false}
            onClick={() => void 0}
        />
        <div class="mb-[-6px]">
            <CardsList key={'general'} filters={definitionsAndValues?.single || []} setValue={setSingleValue} values={filtersValues.single} />
        </div>

        <div class="grid grid-cols-3 gap-5 justify-center mt-[60px] mb-6">
            <img tabIndex={0} src={tabIndex === 0 ? "/left_selected.svg" : "/left_default.svg"} onClick={() => setTabIndex(0)} alt="Izquierda" className="block self-center w-max cursor-pointer" />
            <div class="pb-[3px]">
                <img src="/connector.svg" alt="Empalme" className="block self-center w-max" />
            </div>
            <img tabIndex={0} src={tabIndex === 1 ? "/right_selected.svg" : "/right_default.svg"} onClick={() => setTabIndex(1)} alt="Izquierda" className="block self-center w-max cursor-pointer" />
        </div>

        <Tabs
            titles={["", ""]}
            index={tabIndex}
            onIndexChange={setTabIndex}
        >
            {[
                <CardsList key={'left'} filters={definitionsAndValues?.multiple || []} values={filtersValues.multiple[0] || {}} setValue={(key: string, value: string | number | undefined | null) => setMultipleValue(0, key, value)} />,
                <CardsList key={'right'} filters={definitionsAndValues?.multiple || []} values={filtersValues.multiple[1] || {}} setValue={(key: string, value: string | number | undefined | null) => setMultipleValue(1, key, value)} />,
            ]}
        </Tabs>
    </div>)
}
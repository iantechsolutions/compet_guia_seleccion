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

    return (<div>

    </div>)
}
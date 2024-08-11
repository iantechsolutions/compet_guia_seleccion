import { mapSelectedFilters } from '../util/mapSelectedFilters'
import type { Product, QuestionFilter, SelectedFilters } from '../util/types'
import { Image } from './Image'

interface Props {
    question: QuestionFilter
    index: number
    filteredProducts: Product[]
    forward?: () => unknown
    back?: () => unknown
    selectedFilters: SelectedFilters
    filtersLabelsByValueKey: Map<string, string>
}

export default function QuestionStatus({
    question,
    index,
    filteredProducts,
    back,
    forward,
    selectedFilters,
    filtersLabelsByValueKey
}: Props) {
    const icon = question.icon

    return (
        <div className="py-2 px-2 bg-primary text-white mt-5 flex align-items-center">
            {icon && <Image src={`/icons/${icon}`} className="h-[50px] mr-2" />}

            <div className="max-w-full">
                {selectedFilters.length > 0 && (
                    <div className="px-2 py-0 bg-primary rounded-full whitespace-nowrap text-ellipsis overflow-hidden max-w-full">
                        {mapSelectedFilters(
                            selectedFilters,
                            filtersLabelsByValueKey,
                            (_, l) => l
                        ).join(', ')}
                    </div>
                )}
                {selectedFilters.length === 0 && (
                    <span>Elija una opción y presione siguiente</span>
                )}
                <div>
                    <span className="text-lg">
                        Pregunta {index + 1} - {filteredProducts?.length}{' '}
                        productos encontrados
                    </span>
                </div>
            </div>
            <div className="ml-[auto] hidden md:flex">
                <button type="button" onClick={back}>
                    {left}
                </button>
                <button type="button" onClick={forward}>
                    {right}
                </button>
            </div>
        </div>
    )
}

const left = (
    <svg
        className="fill-white"
        xmlns="http://www.w3.org/2000/svg"
        height="48"
        viewBox="0 -960 960 960"
        width="48"
    >
        <path d="M561-240 320-481l241-241 43 43-198 198 198 198-43 43Z" />
    </svg>
)
const right = (
    <svg
        className="fill-white"
        xmlns="http://www.w3.org/2000/svg"
        height="48"
        viewBox="0 -960 960 960"
        width="48"
    >
        <path d="m375-240-43-43 198-198-198-198 43-43 241 241-241 241Z" />
    </svg>
)

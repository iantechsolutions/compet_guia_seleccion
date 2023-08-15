import type { QuestionFilter } from "../util/types"
import QuestionButton from "./OptionButton"

interface QuestionProps {
    question: QuestionFilter
    values?: string[]
    onChange?: (value: { key: string, values: string[] }) => unknown
}

export default function Question({ question, values, onChange }: QuestionProps) {
    return <div className="w-full overflow-x-auto mt-[14px]">
        <div className="my-4 container">
            <div className="mt-4 grid gap-10 gap-y-3 lg:gap-y-10 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 pb-2">
                {question.values.map((qval, i) => {
                    return <QuestionButton
                        icon={qval.icon}
                        key={qval.key}
                        large={question.large_options}
                        selected={!!(values?.findIndex(v => qval.key === v) != -1 && values)}
                        onClick={() => {
                            onChange?.({ key: question.key, values: [qval.key] })
                        }}>{qval.label}</QuestionButton>
                })}
                {question.skippable && <QuestionButton
                    icon={question.skip_icon ?? 'clear.png'}
                    key={'__skip_question'}
                    large={question.large_options}
                    selected={!!(values?.findIndex(v => '__skip_question' === v) != -1 && values)}
                    onClick={() => {
                        onChange?.({ key: question.key, values: ['__skip_question'] })
                    }}>{question.skip_label ?? 'Saltar pregunta'}</QuestionButton>}
            </div>
        </div>
    </div>
}


import type { QuestionFilter } from "../util/types"
import QuestionButton from "./OptionButton"

interface QuestionProps {
    question: QuestionFilter
    values?: string[]
    onChange?: (value: { key: string, values: string[] }) => unknown
}

export default function Question({ question, values, onChange }: QuestionProps) {
    return <div className="my-4">
        <div className="mt-4 grid gap-10 gap-y-3 lg:gap-y-10 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
            {question.values.map((qval, i) => {
                return <QuestionButton
                    icon={qval.icon}
                    key={qval.key}
                    selected={!!(values?.findIndex(v => qval.key === v) != -1 && values)}
                    onClick={() => {
                        onChange?.({ key: question.key, values: [qval.key] })
                    }}>{qval.label}</QuestionButton>
            })}
        </div>
    </div>
}


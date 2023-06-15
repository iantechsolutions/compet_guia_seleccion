import classNames from "classnames"
import type { QuestionFilter } from "../util/types"

interface QuestionProps {
    question: QuestionFilter
    values?: string[]
    onChange?: (value: { key: string, values: string[] }) => unknown
}

export default function Question({ question, values, onChange }: QuestionProps) {
    return <div className="my-4">
        <h2 className="text-xl">{question.label}</h2>
        {question.description && <p>{question.description}</p>}

        <div className="mt-4 grid gap-2 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
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

interface QuestionButtonProps {
    children: any,
    selected?: boolean,
    icon?: string,
    onClick?: () => unknown
}

function QuestionButton({ children, selected, icon, onClick }: QuestionButtonProps) {
    const len = children.length

    return <button
        onClick={onClick}
        className={classNames([
            'rounded-xl',
            'relative',
            'flex',
            'p-[2px]',
            {
                'border-2 border-blue-500': selected,
                'border-2 border-gray-300': !selected,
            }
        ])}    >
        {icon && <img src={`/icons/${icon}`} className="h-[40px] rounded-lg" />}
        {!icon && <div className={classNames("h-[40px] w-[40px] rounded-lg", {
            'bg-gray-200': !selected,
            'bg-blue-500': selected,
        })} />}
        <div className={classNames("px-4 my-auto", {
            'text-lg': len < 20,
            'text-sm': len > 20,
        })}>
            {children}
        </div>
    </button>
}
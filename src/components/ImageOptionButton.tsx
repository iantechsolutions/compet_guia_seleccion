import classNames from "classnames"

interface QuestionButtonProps {
    children: any,
    selected?: boolean,
    icon?: string,
    onClick?: () => unknown
}

export default function ImageQuestionButton({ children, selected, icon, onClick }: QuestionButtonProps) {
    const len = children.length

    return <button
        onClick={onClick}
        className={classNames("border-2 border-primary py-1.5 rounded-md text-lg px-1", {
            'bg-primary text-white': selected,
        })}


    >{children}</button>
}
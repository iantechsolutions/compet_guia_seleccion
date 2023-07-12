import classNames from "classnames"

interface QuestionButtonProps {
    children: any,
    selected?: boolean,
    icon?: string,
    onClick?: () => unknown
}

export default function QuestionButton({ children, selected, icon, onClick }: QuestionButtonProps) {
    const len = children.length

    return <button
        onClick={onClick}
        className={classNames("border-2 border-primary py-1.5 rounded-md text-lg px-1", {
            'bg-primary text-white': selected,
        })}


    >{children}</button>

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
        {icon && <img src={`/icons/${icon}`} className="h-[40px] rounded-md" />}
        {!icon && <div className={classNames("h-[40px] w-[40px] rounded-md", {
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
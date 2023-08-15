import classNames from "classnames"
import { Image } from "./Image"

interface QuestionButtonProps {
    children: any,
    selected?: boolean,
    icon?: string,
    onClick?: () => unknown
}

export default function LargeOptionButton({ children, selected, icon, onClick }: QuestionButtonProps) {
    return <button
        onClick={onClick}
        style={{
            boxShadow: 'rgba(0, 0, 0, 0.15) 0px 0px 6px 2px'
        }}
        className={classNames("h-[60px] p-[4px] rounded-lg items-center justify-between", {
            'bg-primary text-white': selected,
            'bg-white': !selected,
            'text-center': true,
            'flex gap-1': true,
            'text-lg': children.length < 14,
            'text-md': children.length >= 22,
            'text-sm': children.length >= 30,
        })}
    >
        {icon && <Image src={`/icons/${icon}`} className="rounded-sm h-[52px] w-[52px] min-w-[52px] object-cover bg-white" alt="Ícono" />}
        {children}
        {icon && <div className={'w-[52px] min-w-[52px]'} />}
    </button>
}
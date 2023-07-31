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
        className={classNames("rounded-2xl text-lg px-2 relative items-center overflow-hidden h-[66px]", {
            'bg-primary text-white': selected,
            'bg-white': !selected,
            'text-center': !icon,
            'flex gap-1': icon,
        })}
    >
        {icon && <Image src={`/icons/${icon}`} className="h-[50px] my-2 rounded-xl" alt="Ícono" />}
        {children}
    </button>
}
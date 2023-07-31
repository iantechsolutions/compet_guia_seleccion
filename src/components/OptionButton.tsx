import classNames from "classnames"
import LargeOptionButton from "./LargeOptionButton"
import { Image } from "./Image"

interface QuestionButtonProps {
    children: any,
    selected?: boolean,
    icon?: string,
    large?: boolean,
    onClick?: () => unknown
}

export default function QuestionButton({ children, selected, icon, onClick, large }: QuestionButtonProps) {
    if (large) {
        return <LargeOptionButton selected={selected} icon={icon} onClick={onClick}>{children}</LargeOptionButton>
    }

    return <button
        onClick={onClick}
        className={classNames("border-2 border-primary py-1.5 rounded-lg text-lg px-1 relative", {
            'bg-primary text-white': selected,
        })}
    >
        {icon && <Image src={`/icons/${icon}`} alt="Ícono" className={classNames("absolute left-0 h-[28px] pl-[8px]", {
            'invert': selected,
        })} />}
        {children}
    </button>
}
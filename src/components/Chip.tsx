import classNames from "classnames";
import type { ComponentChildren } from "preact";

type Props = {
    children: ComponentChildren
    onClick?: () => unknown
    selected?: boolean
}


export function Chip({ children, onClick, selected }: Props) {
    return <button
        type="button"
        className={classNames(
            "rounded-lg border p-1 px-2 text-md font-semibold text-gray-600 whitespace-nowrap text-center focus:ring", {
            "cursor-pointer": !!onClick,
            "border-blue-500": selected
        }
        )}
        onClick={onClick}
    >
        {children}
    </button>
}

export function SkeletonChip(props: { width?: string }) {
    return <div
        tabIndex={0}
        className="rounded-lg border p-1 px-2 text-md font-semibold text-gray-600 bg-gray-200 animate-pulse"
        style={{ width: props.width }}
    >
        <div className="w-10 h-[24px]"></div>
    </div>
}
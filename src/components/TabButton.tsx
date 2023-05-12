import type { ComponentChildren } from "preact"

export default function TabButton(props: {
    onClick: () => unknown
    selected: boolean
    title: ComponentChildren
}) {
    return <button
        type="button"
        onClick={props.onClick}
        className="text-center text-gray-600 font-semibold py-2 cursor-pointer relative focus:ring w-full"
    >
        {props.title}
        {props.selected && <>
            <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-blue-500 rounded-full"></div>
            <svg height="20" width="20" viewBox="0 0 500 500" className="absolute bottom-[-4px] left-[calc(50%_-_10px)] fill-blue-500">
                <polygon points="250,160 100,400 400,400" class="triangle" />
            </svg>
        </>}
    </button>
}
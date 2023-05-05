import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import classNames from 'classnames'

type Props = {
    titles: ComponentChildren[]
    children: ComponentChildren[]
}

export default function Tabs(props: Props) {
    const [selected, setSelected] = useState(0)

    return <div>
        <div className="mb-2 grid grid-cols-2">
            {props.titles.map((title, i) => <button
                type="button"
                onClick={() => setSelected(i)}
                key={i}
                className="text-center text-gray-600 font-semibold py-2 cursor-pointer relative focus:ring"
            >
                {title}
                {selected === i && <>
                    <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-blue-500 rounded-full"></div>
                    <svg height="20" width="20" viewBox="0 0 500 500" className="absolute bottom-[-4px] left-[calc(50%_-_10px)] fill-blue-500">
                        <polygon points="250,160 100,400 400,400" class="triangle" />
                    </svg>
                </>}
            </button>)}
        </div>
        <div>
            {props.children.map((child, i) => <div
                className={classNames({
                    hidden: selected !== i
                })}
            >
                {props.children[i]}
            </div>)}
        </div>
    </div>
}


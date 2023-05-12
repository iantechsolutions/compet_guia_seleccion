import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import classNames from 'classnames'
import TabButton from "./TabButton";

type Props = {
    titles: ComponentChildren[]
    children: ComponentChildren[]
}

export default function Tabs(props: Props) {
    const [selected, setSelected] = useState(0)

    return <div>
        <div className="mb-1 grid grid-cols-2">
            {props.titles.map((title, i) => <TabButton
                key={i}
                title={title}
                selected={selected === i}
                onClick={() => setSelected(i)}
            />)}
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


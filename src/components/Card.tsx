import type { ComponentChildren } from "preact";

type Props = {
    children: ComponentChildren;
}

export default function Card(props: Props) {
    return <div className="shadow-[0_2px_10px_-2px_rgba(0,0,0,0.25)] rounded-xl w-full">
        {props.children}
    </div>
}

export function CardTitle(props: Props) {
    return <div className="p-3 pb-0">
        <h3 className="text-xl font-semibold">
            {props.children}
        </h3>
    </div>
}

export function CardContent(props: Props) {
    return <div className="p-3">
        {props.children}
    </div>
}
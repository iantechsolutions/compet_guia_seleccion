import classNames from 'classnames'

interface Props {
    children: any
    disabled?: boolean
    onClick?: () => unknown
    className?: string
}

export default function Button({
    children,
    onClick,
    className,
    disabled
}: Props) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={classNames(className, [
                'px-5 py-2',
                'rounded-full',
                'shadow-md  ',
                'text-white',
                'font-semibold',
                {
                    'bg-gray-300': disabled,
                    'bg-primary': !disabled
                }
            ])}
        >
            {children}
        </button>
    )
}

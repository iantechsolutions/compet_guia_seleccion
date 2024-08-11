import { useEffect, useLayoutEffect } from 'preact/hooks'
import { mapSelectedFilters } from '../util/mapSelectedFilters'
import type { QuestionFilter, SelectedFilters } from '../util/types'
import ContactLinks from './ContactLinks'
import { Image } from './Image'

export type QuestionViewHeaderProps = {
    question: QuestionFilter
    isLast: boolean
    isFirst: boolean
    productsCount?: number
    forward?: () => unknown
    back?: () => unknown
    selectedFilters: SelectedFilters
    filtersLabelsByValueKey: Map<string, string>
    resetToHome: () => unknown
}

const updateScrollButtons = () => {
    const container = document.querySelector('.overflow-x-auto')

    if (!container) return

    const scrollRight = document.getElementById('scroll-right')
    const scrollLeft = document.getElementById('scroll-left')

    if (container.scrollWidth > container.clientWidth) {
        if (container.scrollLeft > 0) {
            scrollLeft?.classList.remove('hidden')
        } else {
            scrollLeft?.classList.add('hidden')
        }

        if (
            container.scrollLeft <
            container.scrollWidth - container.clientWidth
        ) {
            scrollRight?.classList.remove('hidden')
        } else {
            scrollRight?.classList.add('hidden')
        }
    } else {
        scrollLeft?.classList.add('hidden')
        scrollRight?.classList.add('hidden')
    }

    scrollRight &&
        (scrollRight.onclick = () => {
            container.scrollTo({
                left: container.scrollLeft + 100,
                behavior: 'smooth'
            })
            setTimeout(updateScrollButtons, 200)
        })

    scrollLeft &&
        (scrollLeft.onclick = () => {
            container.scrollTo({
                left: container.scrollLeft - 100,
                behavior: 'smooth'
            })
            setTimeout(updateScrollButtons, 200)
        })
}

export default function QuestionsViewHeader({
    question,
    isFirst,
    isLast,
    productsCount,
    back,
    forward,
    selectedFilters,
    filtersLabelsByValueKey,
    resetToHome
}: QuestionViewHeaderProps) {
    const divider = (
        <div className="container">
            <hr className="border-none h-[4px] bg-primary mt-5 mb-5" />
        </div>
    )

    useLayoutEffect(updateScrollButtons)

    useEffect(() => {
        const container = document.querySelector('.overflow-x-auto')

        container?.addEventListener('scroll', updateScrollButtons)
        window?.addEventListener('resize', updateScrollButtons)

        return () => {
            container?.removeEventListener('scroll', updateScrollButtons)
            window?.removeEventListener('resize', updateScrollButtons)
        }
    }, [])

    if (!isLast) {
        return (
            <div className="bg-primary py-2">
                <div className="container relative">
                    {isFirst && (
                        <div className="my-2 flex gap-2 text-white font-medium">
                            Elija una opción y presione siguiente
                        </div>
                    )}
                    {!isFirst && (
                        <div className="my-2 flex gap-2 overflow-x-auto scrollbar-hide">
                            {mapSelectedFilters(
                                selectedFilters,
                                filtersLabelsByValueKey,
                                (filter, label, i) => {
                                    return (
                                        <span
                                            className="text-white text-md px-2 py-[1px] rounded-full block whitespace-nowrap"
                                            style={{
                                                backgroundColor: '#2CA9D2'
                                            }}
                                        >
                                            {label}
                                        </span>
                                    )
                                }
                            )}
                        </div>
                    )}

                    <button
                        type="button"
                        id="scroll-right"
                        className="hidden absolute right-0 top-0 py-[4px] pl-[6px] pr-[4px] bg-primary"
                    >
                        {right}
                    </button>
                    <button
                        type="button"
                        id="scroll-left"
                        className="hidden absolute left-0 top-0 py-[4px] pl-[9px] pr-[1px] bg-primary"
                    >
                        {left}
                    </button>

                    {/* {(question.icon && !isFirst) && <img src={`/icons/${question.icon}`} className="float-right h-[24px] invert" />} */}
                    <div className="flex justify-between">
                        <p className="my-1 text-white font-semibold lg:text-2xl">
                            {question.label}
                        </p>
                        <a
                            href="/"
                            onClick={(e) => {
                                e.preventDefault()
                                resetToHome()
                            }}
                        >
                            <Image
                                src="/home.png"
                                className="h-[24px] sm:h-[28px] min-w-[24px] sm:min-w-[28px] invert mt-[4px]"
                            />
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    if (isLast) {
        return (
            <>
                <div className="container">
                    <h1 className="text-2xl lg:text-5xl font-medium mt-[50px]">
                        Accesorios para cables subterráneos
                    </h1>
                </div>
                {divider}
                <div className="container mb-3">
                    <div className="relative">
                        <button
                            className="absolute top-0 right-0"
                            onClick={resetToHome}
                        >
                            <Image
                                src="/home2.png"
                                className="h-[24px] sm:h-[28px] min-w-[24px] sm:min-w-[28px] mt-[4px]"
                            />
                        </button>
                    </div>
                    <h2 className="text-xl lg:text-2xl font-semibold">
                        {productsCount === 1
                            ? `Se encontró un producto`
                            : `Se encontraron ${productsCount} productos`}
                    </h2>
                </div>
            </>
        )
    }

    return <></>
}

const right = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="fill-white"
        height="18"
        viewBox="0 -960 960 960"
        width="18"
    >
        <path d="m304-82-56-57 343-343-343-343 56-57 400 400L304-82Z" />
    </svg>
)
const left = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="fill-white"
        height="18"
        viewBox="0 -960 960 960"
        width="18"
    >
        <path d="M400-80 0-480l400-400 56 57-343 343 343 343-56 57Z" />
    </svg>
)

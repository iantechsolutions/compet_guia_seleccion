import { useEffect, useState } from "preact/hooks"
import { QuestionsView } from "./QuestionsView"
import { ShowEntries } from "./ShowEntries"
import type { Entry } from "../client/saveLocalState"

export default function IntroductionScreen({ onClickStart }: { onClickStart: (entry?: Entry) => unknown }) {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    }, [])

    const loader = <div>
        <div style={`
        position: relative;
        box-sizing: border-box;
        display: block;
        margin: auto;
        height: 32px;
        width: 32px;
        border: 6px solid #AAAAAA;
        border-top: 6px solid white;
        border-radius: 50%;
    `} class={'animate-spin'}></div>
    </div>

    return <div>
        <header className="container">
            <a href="https://competsa.com/">
                <img src="https://competsa.com/images/logos/header.png" alt="Compet S.A" className="h-[40px] float-right" />
            </a>
            <h1 className="text-2xl lg:text-5xl mt-10 lg:mt-[80px] lg:mb-[20px] uppercase font-medium">Guía de selección</h1>
            <p>Encontrá el producto exacto que necesitas</p>
        </header>

        <div className="container">
            <hr className="border-none h-[4px] bg-primary mt-5 mb-5" />
        </div>

        <div className="container">

            {/* <div className="grid gap-2 grid-cols-4 max-w-[400px] mx-auto mb-4">
                <img src="https://competsa.com/images/contenido/1633350112.jpg" alt="Conectores Enchufables Apantallados" className="aspect-square object-cover" />
                <img src="https://competsa.com/images/contenido/1592504511.png" alt="Terminales contraíbles en frío" className="aspect-square" />
                <img src="https://competsa.com/images/contenido/1597427805.png" alt="Terminales Termocontraíbles para Media Tensión" className="aspect-square" />
                <img src="https://competsa.com/images/contenido/1595862601.png" alt="Gel de Silicona reentrable" className="aspect-square" />
            </div> */}

            <div className="text-center my-[30px]">
                <button
                    className="w-full sm:w-[400px] bg-primary shadow-md rounded-lg py-3 px-6 text-xl text-white mx-auto grid grid-cols-[32px_1fr_32px] gap-3"

                    onClick={() => onClickStart()}
                >
                    {loaded  ? <div /> : loader}
                    <p>
                        Empezar
                    </p>
                </button>
            </div>

            <ShowEntries
                onEntryClick={(entry) => {
                    onClickStart(entry)
                }}
            />

            <div className="h-[100px]">

            </div>

            <div className="fixed bottom-0 left-0 px-4 py-2 bg-[#F6F6F6]">
                <a href="https://competsa.com/" className="text-primary">
                    competsa.com
                </a>
            </div>

            <a href="https://www.iantech.com.ar/" class="fixed bottom-0 right-[1px] text-sm px-2 py-1 bg-[#F6F6F6]">
                Powered by <u>IANTECH</u>
            </a>
        </div>
    </div>
}

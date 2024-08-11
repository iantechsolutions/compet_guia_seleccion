import { useEffect, useState } from "preact/hooks";
import type { Entry } from "../client/saveLocalState";
import ContactLinks from "./ContactLinks";
import Footer from "./Footer";
import { QuestionsView } from "./QuestionsView";
import { ShowEntries } from "./ShowEntries";

export default function IntroductionScreen({
	onClickStart,
	filtersLabelsByValueKey,
}: {
	onClickStart: (entry?: Entry) => unknown;
	filtersLabelsByValueKey: Map<string, string>;
}) {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setLoaded(true);
	}, []);

	const loader = (
		<div>
			<div
				style={`
        position: relative;
        box-sizing: border-box;
        display: block;
        margin: auto;
        height: 32px;
        width: 32px;
        border: 6px solid #AAAAAA;
        border-top: 6px solid white;
        border-radius: 50%;
    `}
				class={"animate-spin"}
			></div>
		</div>
	);

	return (
		<>
			<div className={"min-h-[calc(90vh_-_100px)]"}>
				<header className="container relative">
					<a href="https://competsa.com/">
						<img
							src="/compet.png"
							alt="Compet S.A"
							className="h-[60px] mx-auto mt-[40px] md:mt-0 md:absolute md:top-[-20px] md:right-0"
						/>
					</a>

					<h1 className="text-2xl lg:text-5xl mt-10 mb-2 lg:mt-[80px] lg:mb-[20px] font-medium">
						Accesorios para cables subterráneos
					</h1>

					<p className="sm:text-lg">
						Mediante esta guía de selección ud. podrá encontrar el kit adecuado
						según el nivel de tensión, tipo/sección de cable y categoría de
						accesorio necesario. Luego de completar la información solicitada,
						recibirá nuestra recomendación de producto junto a la información
						técnica relacionada.
					</p>
				</header>

				<div className="container">
					<hr className="border-none h-[4px] bg-primary mt-5 mb-5" />
				</div>

				<div className="container">
					<div className="text-center my-[30px]">
						<button
							className="w-full sm:w-[400px] bg-primary shadow-md rounded-lg py-3 px-6 text-xl text-white mx-auto grid grid-cols-[32px_1fr_32px] gap-3"
							onClick={() => onClickStart()}
						>
							{loaded ? <div /> : loader}
							<p>Empezar</p>
						</button>
					</div>

					<ShowEntries
						filtersLabelsByValueKey={filtersLabelsByValueKey}
						onEntryClick={(entry) => {
							onClickStart(entry);
						}}
					/>

					<div className="h-[100px]"></div>
				</div>
			</div>
			<Footer />
		</>
	);
}

import classNames from "classnames";
import type { TransformedProduct } from "../util/types";
import Footer, { ListItem } from "./Footer";

interface Props {
	products: TransformedProduct[];
	searchTitle: string;
}

function gtag(...args: any[]) {
	return (window as any).gtag(...args);
}

export function ProductsList({ products, searchTitle }: Props) {
	return (
		<>
			<div className="lg:grid lg:grid-cols-2 gap-[22.5px]">
				{products.map((product) => {
					const whatsappURL = new URL(
						"https://api.whatsapp.com/send/?phone=5491140444515&type=phone_number",
					);
					const phoneURL = new URL("tel:+541147707438");

					const lineJump = encodeURIComponent("\n");

					const message = `Hola, me gustaría recibir información sobre:\n*(código: ${product.code}) ${product.text}*\n\nBúsqueda:\n${searchTitle}`;
					const mailMessage = `Hola, me gustaría recibir información sobre:${lineJump}*(código: ${product.code}) ${product.text}*${lineJump}${lineJump}Búsqueda:\n${searchTitle}`;

					whatsappURL.searchParams.set("text", message);

					const mailUrl = `mailto:ventas@competsa.com?subject=Consulta sobre ${product.text} (${product.code})&body=${mailMessage}`;

					return (
						<div className="flex flex-row md:items-center md:justify-between py-2 text-left w-full border-l-4 px-2 border-stone-300 bg-stone-100 mb-5">
							<div className="flex flex-row md:items-center gap-2">
								{product.picture && (
									<img
										className="w-24 h-24 object-cover"
										src={product.picture}
										alt={product.name}
									/>
								)}
								<div className="flex flex-col">
									<h2
										className="font-medium max-w-[600px] text-stone-700"
										style={{ fontSize: "12px" }}
									>
										<span className="font-normal text-stone-500">CÓDIGO:</span>{" "}
										{product.code}
									</h2>
									<h2 className="text-sm font-semibold max-w-[600px]">
										{product.text}
									</h2>
									{/* <h2 className="text-lg bg-primary font-semibold">{product.name}</h2>
                        <p className="text-sm font-semibold max-w-[600px] mt-2">{product.description}</p> */}

									{/* <a href={product.url} className="bg-primary text-white px-4 py-2 rounded-md text-sm whitespace-nowrap">Detalles</a> */}
									<div className="flex gap-1">
										<a
											href={phoneURL.href}
											target="_blank"
											onClick={() => {
												gtag("event", "contact_phone", {
													message: message,
													product_info: product.text,
													product_code: product.code,
												});
											}}
											rel="noreferrer"
										>
											<img
												src="/phone-call.png"
												alt="Consultar por Whatsapp"
												className="h-[30px]"
											/>
										</a>
										<a
											href={whatsappURL.href}
											target="_blank"
											onClick={() => {
												gtag("event", "contact_whatsapp", {
													message: message,
													product_info: product.text,
													product_code: product.code,
												});
											}}
											rel="noreferrer"
										>
											<img
												src="/whatsapp.png"
												alt="Consultar por Whatsapp"
												className="h-[30px]"
											/>
										</a>
										<a
											href={mailUrl}
											target="_blank"
											onClick={() => {
												gtag("event", "contact_email", {
													message: message,
													product_info: product.text,
													product_code: product.code,
												});
											}}
											rel="noreferrer"
										>
											<img
												src="/mail-with-circle.svg"
												alt="Consultar por email"
												className="h-[30px]"
											/>
										</a>
										{product.pdf && (
											<a
												href={product.pdf}
												target="_blank"
												onClick={() => {
													gtag("event", "contact_pdf", {
														message: message,
														product_info: product.text,
														product_code: product.code,
													});
												}}
												rel="noreferrer"
											>
												<img
													src="/pdf.png"
													alt="Descargar PDF"
													className="h-[30px]"
												/>
											</a>
										)}
										<a
											href={product.url || "https://competsa.com/"}
											target="_blank"
											onClick={() => {
												gtag("event", "contact_webpage", {
													message: message,
													product_info: product.text,
													product_code: product.code,
												});
											}}
											rel="noreferrer"
										>
											<img
												src="/sitio-web.png"
												alt="Sitio web"
												className="h-[30px]"
											/>
										</a>

										{/* <a target='_blank' href={product.url} className="border-primary border-2 px-2 py-1 rounded-md text-sm whitespace-nowrap text-primary">Contacto</a> */}
										{/* {product.pdf && <a target='_blank' href={product.pdf} className=" border-primary border-2 bg-primary text-white px-2 py-1 rounded-md text-sm whitespace-nowrap">Ficha técnica</a>} */}
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
}

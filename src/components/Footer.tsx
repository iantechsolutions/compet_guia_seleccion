import classNames from 'classnames'

export default function Footer() {
    return (
        <footer className="bg-[#141C39] text-white">
            <div
                className={classNames(
                    'container grid grid-cols-1 py-6 sm:grid-cols-[250px_1fr] md:grid-cols-[330px_1fr] gap-[20px] relative'
                )}
                style={{ padding: '22.5px' }}
            >
                <section>
                    <h2 className="text-sm text-[#2AB0E1] font-medium">
                        Contacto
                    </h2>
                    <ListItem
                        title="(+54) 11 4044 4515"
                        alt="WhatsApp"
                        href="https://api.whatsapp.com/send/?phone=5491140444515&type=phone_number"
                        src="whatsapp.svg"
                    />
                    <ListItem
                        title="(+54) 11 4770 7438"
                        alt="Atención al cliente"
                        href="tel:+541147707438"
                        src="phone-solid.svg"
                    />
                    <ListItem
                        title="ventas@competsa.com"
                        alt="Correo electrónico"
                        href="mailto:ventas@competsa.com"
                        src="paper-plane-solid.svg"
                    />
                </section>
                <section>
                    <h2 className="text-sm text-[#2AB0E1] font-medium">
                        Enlaces
                    </h2>
                    <ListItem
                        title="competsa.com"
                        alt="Página web de Compet"
                        href="https://competsa.com"
                        src="icons8-globe-64.png"
                    />
                    <ListItem
                        title="Agrelo 3237, CABA, Argentina"
                        alt="Mapa de Google Maps"
                        href="https://goo.gl/maps/n1P1NWxXznwz9Xki6"
                        src="location-dot-solid.svg"
                    />
                    {/* <ListItem title="Iantech Solutions" alt="Iantech Logo" href="https://www.iantech.com.ar/" src="https://www.iantech.com.ar/favicon.png" /> */}
                </section>
                <div class="sm:hidden h-0"></div>
                <aside className="absolute bottom-3 left-5 sm:left-[inherit] sm:right-0 text-sm text-stone-300">
                    <a href="https://www.iantech.com.ar/">Iantech Solutions</a>
                </aside>
            </div>
        </footer>
    )
}

export function ListItem(props: {
    src: string
    alt: string
    title: string
    href: string
}) {
    return (
        <div className="flex gap-2 justify-start items-center my-3 text-sm">
            <img
                src={props.src}
                alt={props.alt}
                className="min-w-[20px] w-[20px] h-[20px] object-contain"
            />
            <a href={props.href}>{props.title}</a>
        </div>
    )
}

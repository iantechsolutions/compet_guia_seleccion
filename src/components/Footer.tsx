export default function Footer() {
    return <footer className="bg-stone-800 text-white">
        <div className="container grid grid-cols-1 py-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[20px]" style={{ padding: '22.5px' }}>
            <section>
                <h2 className="text-lg">Contacto</h2>
                <ListItem title="(+54) 11 4044 4515" alt="WhatsApp" href="https://api.whatsapp.com/send/?phone=5491140444515&type=phone_number" src="whatsapp.png" />
                <ListItem title="(+54) 11 4770 7438" alt="Atención al cliente" href="tel:+541147707438" src="phone-call-white.png" />
                <ListItem title="ventas@competsa.com" alt="Correo electrónico" href="mailto:ventas@competsa.com" src="email-white.png" />
            </section>
            <section>
                <h2 className="text-lg">Enlaces</h2>
                <ListItem title="competsa.com" alt="Página web de Compet" href="https://competsa.com" src="favicon.png" />
            </section>
            <section>
                <h2 className="text-lg">Desarrollado por</h2>
                <ListItem title="Iantech Solutions" alt="Iantech Logo" href="https://www.iantech.com.ar/" src="https://www.iantech.com.ar/favicon.png" />
            </section>
        </div>
    </footer>
}


export function ListItem(props: { src: string, alt: string, title: string, href: string }) {
    return <div className="flex gap-2 justify-start items-center my-3">
        <img src={props.src} alt={props.alt} className="min-w-[36px] w-[36px] h-[36px] object-contain" />
        <a href={props.href}>{props.title}</a>
    </div>
}
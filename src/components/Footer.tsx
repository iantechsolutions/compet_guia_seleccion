export default function Footer() {
    return <footer className="bg-stone-800 text-white">
        <div className="container grid py-6 sm:grid-cols-2 lg:grid-cols-3 2xl grid-cols-4 gap-[20px]">
            <section>
                <h2 className="text-lg">Contacto</h2>
                <ListItem title="(+54) 11 4044 4515" alt="WhatsApp" href="https://api.whatsapp.com/send/?phone=5491140444515&type=phone_number" src="whatsapp.png"/>
                <ListItem title="(+54) 11 4770 7438" alt="Atención al cliente" href="tel:+541147707438" src="phone-call-white.png"/>
                <ListItem title="ventas@competsa.com" alt="Correo electrónico" href="mailto:ventas@competsa.com" src="email-white.png"/>
            </section>
            <section>
                <h2 className="text-lg">Enlaces</h2>
                <ListItem title="competsa.com" alt="Página web de Compet" href="https://competsa.com" src="favicon.png"/>
            </section>
            <section>
                <h2 className="text-lg">Desarrollado por</h2>
                <ListItem title="Iantech Solutions" alt="Iantech Logo" href="https://www.iantech.com.ar/" src="https://www.iantech.com.ar/favicon.png"/>
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



{/* <div className="fixed bottom-0 left-0 px-4 py-2 bg-[#F6F6F6]">
<a href="https://competsa.com/" className="text-primary">
    competsa.com
</a>
</div>

<a href="https://www.iantech.com.ar/" class="fixed bottom-0 right-[1px] text-sm px-2 py-1 bg-[#F6F6F6]">
Powered by <u>IANTECH</u>
</a> */}

{/* <p>
<span className="">WhatsApp </span>
<a href="https://api.whatsapp.com/send/?phone=5491140444515&type=phone_number" className="underline">(+54) 11 4044 4515</a>
</p>
<p>
<span className="">Atención al cliente </span>
<a href="tel:+541147707438" className="underline">(+54) 11 4770 7438</a>
</p>
<p>
<span className="">Escribinos a </span> 
<a href="mailto:ventas@competsa.com" className="underline">ventas@competsa.com</a>
</p>
</div> */}
export default function ContactLinks() {
    return <div className="my-2 text-sm font-medium grid sm:grid-cols-2 md:grid-cols-3">
        <p>
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
    </div>
}
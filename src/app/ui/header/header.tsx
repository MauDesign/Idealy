import Image from "next/image";
import { useTranslations } from "next-intl";



export default function Header() {
const t = useTranslations("HeaderHero");
return( 

<div className="w-full bg-linear-to-r from-blue-500 via-cyan-500 to-teal-500 p-15 lg:max-h-160 flex flex-wrap sm:max-h-full">
    <div className=" lg:w-3/4 m-auto sm:w-full  justify-center items-center" >
        <div className="lg:p-5  sm:p-15 w-full items-center">
            <h1 className="text-6xl font-Poiret_One w-full text-center text-[#ffffff]">{t("title")}</h1>
            <h3 className="text-3xl font-vmonserrat w-full text-center mt-5"><span className="text-[#ffffff]" >{t("autor")}</span></h3>
        </div>
    </div>
        <div className="p-3 w-full flex justify-center items-center "  >
            <Image 
                src="/img/back-idealy.png"
                width={840}
                height={600}
                alt="Fondo Mauricio Casado"
                className=""
            />
        </div>
</div>
);
}

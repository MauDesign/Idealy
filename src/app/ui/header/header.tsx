import Image from "next/image";
import { useTranslations } from "next-intl";
import Hero from "../hero/hero";



export default function Header() {
    const t = useTranslations("HeaderHero");
    return (

        <Hero />
    );
}

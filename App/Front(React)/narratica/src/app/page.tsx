import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export default function HomePage() {
    return (
        <>
        <section>
            
        </section>
            <section>
                <p>Ceci est la page d'accueil</p>
                <Carousel>
                    <CarouselContent>
                        <CarouselItem className="md:basis-1/2 lg:basis-1/3">1</CarouselItem>
                        <CarouselItem className="md:basis-1/2 lg:basis-1/3">2</CarouselItem>
                        <CarouselItem className="md:basis-1/2 lg:basis-1/3">3</CarouselItem>
                    </CarouselContent>
                </Carousel>
            </section>
        </>
    )
}  
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Controls from "../components/audio/Controls";
import AudioPlayer from "../components/audio/AudioPlayer";
import Backdrop from "../components/audio/Backdrop";
import Card from "@/components/audio/custom/Card";
import Player from "@/components/audio/custom/Player";

export default function HomePage() {

    // Ici juste pour teste avec un fichier audio
    const audioSource = '/asset/';
    return (
        <>
            {/* <section>

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
            <section>
                <AudioPlayer tracks={tracks} />
            </section> */}

            <Card>
                <Player audioSource={audioSource} />
            </Card>
        </>
    )
}  
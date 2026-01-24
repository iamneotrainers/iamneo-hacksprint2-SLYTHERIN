import { Button } from "@/components/ui/button";
import { CheckCircle, Star } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const bulletPoints = [
  "World’s largest freelance marketplace",
  "Any job you can possibly think of",
  "Save up to 90% & get quotes for free",
  "Pay only when you’re 100% happy",
];

export default function HeroSection() {
  const heroIllustration = PlaceHolderImages.find(
    (img) => img.id === "hero-illustration"
  );
  const freelancerAvatar = PlaceHolderImages.find(
    (img) => img.id === "freelancer-1"
  );

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-7xl/none font-headline">
              Hire the best freelancers for any job, online.
            </h1>
            <ul className="grid gap-2">
              {bulletPoints.map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg">Hire a Freelancer</Button>
              <Button size="lg" variant="outline">
                Earn Money Freelancing
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:flex items-center justify-center">
            {heroIllustration && (
              <Image
                src={heroIllustration.imageUrl}
                alt={heroIllustration.description}
                width={600}
                height={500}
                className="rounded-lg shadow-2xl"
                data-ai-hint={heroIllustration.imageHint}
              />
            )}
            <Card className="absolute -bottom-8 -left-12 w-64 shadow-xl animate-fade-in-up">
              <CardContent className="p-4 flex items-center gap-4">
                {freelancerAvatar && (
                  <Avatar>
                    <AvatarImage
                      src={freelancerAvatar.imageUrl}
                      alt="Freelancer"
                      data-ai-hint={freelancerAvatar.imageHint}
                    />
                    <AvatarFallback>AV</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <p className="font-semibold">Top Developer</p>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="absolute -top-12 -right-16 w-72 shadow-xl animate-fade-in-down">
              <CardContent className="p-4 space-y-2">
                <p className="font-semibold">"Excellent work!"</p>
                <p className="text-sm text-muted-foreground">
                  Amazed by the quality and speed. Will definitely hire again.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

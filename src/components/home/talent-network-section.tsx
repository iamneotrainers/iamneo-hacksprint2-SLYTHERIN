import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Users,
  ShieldCheck,
  LifeBuoy,
  Star,
} from "lucide-react";

const steps = [
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Post your job",
    description: "It's free and easy to post a job. Simply fill in a title, description.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Choose freelancers",
    description: "No job is too big or too small. We've got freelancers for jobs of any size.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Pay safely",
    description: "Only pay when you are 100% happy with the work. Our payment system is secure.",
  },
  {
    icon: <LifeBuoy className="h-8 w-8 text-primary" />,
    title: "We’re here to help",
    description: "Our support team is available 24/7 to help you with any issues.",
  },
];

const freelancers = [
  { id: "freelancer-1", name: "Sarah K.", role: "UI/UX Designer", location: "USA" },
  { id: "freelancer-2", name: "Miguel R.", role: "Full-Stack Dev", location: "Spain" },
  { id: "freelancer-3", name: "Priya S.", role: "Illustrator", location: "India" },
  { id: "freelancer-4", name: "Chen W.", role: "Data Scientist", location: "China" },
];

export default function TalentNetworkSection() {
  const mapImage = PlaceHolderImages.find((img) => img.id === "talent-map");

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Tap into a global talent network
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our platform connects you with skilled professionals from over 247
            countries, regions, and territories.
          </p>
        </div>

        <div className="relative">
          {mapImage && (
            <Image
              src={mapImage.imageUrl}
              alt={mapImage.description}
              width={1200}
              height={600}
              className="rounded-lg object-cover opacity-20 w-full h-auto"
              data-ai-hint={mapImage.imageHint}
            />
          )}
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
            {steps.map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Floating freelancer cards */}
          {freelancers.map((freelancer, index) => {
            const avatar = PlaceHolderImages.find((img) => img.id === freelancer.id);
            const positions = [
              "top-1/4 left-[15%]",
              "top-1/2 left-[35%]",
              "top-[10%] left-[60%]",
              "top-2/3 left-[80%]",
            ];
            return (
              <Card key={freelancer.id} className={`absolute w-52 shadow-lg hidden md:block ${positions[index]}`}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    {avatar && (
                      <Image
                        src={avatar.imageUrl}
                        alt={freelancer.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                        data-ai-hint={avatar.imageHint}
                      />
                    )}
                    <div>
                      <p className="font-semibold">{freelancer.name}</p>
                      <p className="text-xs text-muted-foreground">{freelancer.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">(4.9)</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { Card } from "@/components/ui/card";
import { MoveRight } from "lucide-react";

const categories = [
  "Website Design",
  "Graphic Design",
  "Mobile App Development",
  "Software Development",
  "3D Artists",
  "Illustration",
  "Video Editing",
  "Content Writing",
];

export default function CategoriesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Browse talent by category
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Get it done faster. Find the right talent for your project, from
            design and development to marketing and content.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Card
              key={category}
              className="p-6 flex flex-col justify-between group hover:shadow-lg hover:-translate-y-1 hover:border-primary transition-all duration-300 cursor-pointer"
            >
              <h3 className="text-lg font-semibold">{category}</h3>
              <div className="flex items-center justify-end text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <MoveRight className="h-5 w-5" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

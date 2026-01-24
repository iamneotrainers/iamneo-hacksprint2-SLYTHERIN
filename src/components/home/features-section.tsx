import { Award, Zap, ShieldCheck, Gem } from "lucide-react";

const features = [
  {
    icon: <Gem className="h-8 w-8 text-primary" />,
    title: "The best talent",
    description:
      "Find the perfect freelance services for your business, from a global network of top-tier professionals.",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Fast bids",
    description:
      "Receive competitive quotes from our talented freelancers within minutes of posting your job.",
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: "Quality work",
    description:
      "Our freelancers are rated and reviewed for their work, so you can hire with confidence.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Be in control",
    description:
      "Chat with freelancers, share files, and collaborate easily from your desktop or mobile.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
            How it Works
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Make it real with TrustLance
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            A suite of tools and services designed to help you succeed, from
            start to finish.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center space-y-3"
            >
              {feature.icon}
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  const authIllustration = PlaceHolderImages.find(
    (img) => img.id === "auth-illustration"
  );

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 relative">
        <Button asChild variant="ghost" size="sm" className="absolute top-4 left-4 text-gray-600 hover:text-blue-600">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <div className="w-full max-w-md space-y-6">
          {children}
        </div>
      </div>
      <div className="hidden lg:flex bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="flex items-center justify-center w-full p-8">
          {authIllustration && (
            <Image
              src={authIllustration.imageUrl}
              alt={authIllustration.description}
              width={600}
              height={700}
              className="object-contain"
              priority
              data-ai-hint={authIllustration.imageHint}
            />
          )}
        </div>
      </div>
    </div>
  );
}

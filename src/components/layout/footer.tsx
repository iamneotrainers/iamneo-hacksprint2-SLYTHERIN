import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Logo from "@/components/logo";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

const footerLinks = {
  Categories: [
    "Websites, IT & Software",
    "Writing & Content", 
    "Design, Media & Architecture",
    "Data Entry & Admin",
    "Engineering & Science",
    "Sales & Marketing"
  ],
  Projects: [
    "Browse Projects",
    "Featured Projects", 
    "Project Catalog",
    "Local Projects",
    "Contests"
  ],
  Freelancers: [
    "Browse Freelancers",
    "Top Freelancers",
    "Local Freelancers",
    "Freelancer Directory",
    "Skill Tests"
  ],
  Enterprise: [
    "Enterprise Solutions",
    "API for Developers",
    "AI Development",
    "Field Services",
    "Custom Solutions"
  ],
  "Help & Support": [
    "Help Center",
    "Contact Support",
    "Community",
    "Success Stories",
    "Fees and Charges"
  ],
  About: [
    "About TrustLance",
    "How it Works",
    "Security",
    "Careers",
    "Press & News"
  ],
  Legal: [
    "Terms of Service",
    "Privacy Policy",
    "Copyright Policy",
    "Code of Conduct"
  ],
  Apps: []
};

const socialIcons = [
  { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
  { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
  { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
  { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
];

export default function Footer({ className }: { className?: string }) {
  const appStoreBadge = PlaceHolderImages.find(img => img.id === 'app-store-badge');
  const googlePlayBadge = PlaceHolderImages.find(img => img.id === 'google-play-badge');

  return (
    <footer className={cn("bg-gray-50 border-t", className)}>
      <div className="container px-4 md:px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-8">
          {/* Logo and Stats */}
          <div className="lg:col-span-2 space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-sm">
              The world's largest freelance marketplace connecting businesses with skilled professionals.
            </p>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Registered Users</p>
                <p className="text-xl font-bold text-blue-600">60,000,000+</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Total Jobs Posted</p>
                <p className="text-xl font-bold text-blue-600">22,000,000+</p>
              </div>
            </div>
          </div>
          
          {/* Footer Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
              {links.length > 0 ? (
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-2">
                  {appStoreBadge && (
                    <Link href="#" className="block">
                      <Image 
                        src={appStoreBadge.imageUrl} 
                        alt={appStoreBadge.description} 
                        width={120} 
                        height={40} 
                        className="h-10 w-auto"
                        data-ai-hint={appStoreBadge.imageHint} 
                      />
                    </Link>
                  )}
                  {googlePlayBadge && (
                    <Link href="#" className="block">
                      <Image 
                        src={googlePlayBadge.imageUrl} 
                        alt={googlePlayBadge.description} 
                        width={135} 
                        height={40} 
                        className="h-10 w-auto"
                        data-ai-hint={googlePlayBadge.imageHint} 
                      />
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-600">
              <p>© {new Date().getFullYear()} TrustLance Technology Pty Limited (ACN 142 189 759)</p>
              <div className="flex items-center gap-4">
                <Link href="#" className="hover:text-blue-600">Sitemap</Link>
                <Link href="#" className="hover:text-blue-600">Accessibility</Link>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {socialIcons.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, Code, Palette, Smartphone, Globe, Briefcase, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/logo";

const skillsData = [
  { name: "Graphic Designers", icon: <Palette className="h-5 w-5" />, href: "#" },
  { name: "Website Designers", icon: <Globe className="h-5 w-5" />, href: "#" },
  { name: "Mobile App Developers", icon: <Smartphone className="h-5 w-5" />, href: "#" },
  { name: "Software Developers", icon: <Code className="h-5 w-5" />, href: "#" },
  { name: "3D Artists", icon: <PenTool className="h-5 w-5" />, href: "#" },
  { name: "Illustration", icon: <Briefcase className="h-5 w-5" />, href: "#" },
];

const locationsData = [
  "United States", "United Kingdom", "Canada", "India", "Australia", 
  "Pakistan", "Bangladesh", "Indonesia", "Brazil", "China", "Turkey", "Philippines"
];

const categoriesData = {
  "Websites, IT & Software": [
    "Website Design", "Web Development", "Mobile Apps", "Software Development", 
    "Game Development", "Database Administration", "DevOps & Cloud", "Cybersecurity"
  ],
  "Writing & Content": [
    "Content Writing", "Copywriting", "Technical Writing", "Creative Writing", 
    "Proofreading", "Translation", "Ghostwriting", "Blog Writing"
  ],
  "Design, Media & Architecture": [
    "Graphic Design", "Logo Design", "UI/UX Design", "Video Editing", 
    "Animation", "Architecture", "Interior Design", "3D Modeling"
  ],
  "Data Entry & Admin": [
    "Data Entry", "Virtual Assistant", "Web Research", "Lead Generation", 
    "CRM Management", "Email Management", "Document Conversion", "Typing"
  ]
};

const findWorkNavigation = [
  {
    id: 'skill',
    title: 'By skill',
    description: 'Search for work that requires a particular skill.',
    icon: <Code className="h-5 w-5" />
  },
  {
    id: 'language',
    title: 'By language', 
    description: 'Find projects that are in your language.',
    icon: <Globe className="h-5 w-5" />
  },
  {
    id: 'featured',
    title: 'Featured jobs',
    description: 'Explore our current list of excited top featured projects.',
    icon: <Briefcase className="h-5 w-5" />
  },
  {
    id: 'contests',
    title: 'Find contests',
    description: 'Unleash your talent and find freelancer contests to enter.',
    icon: <PenTool className="h-5 w-5" />
  }
];

const skillJobsData = [
  { title: 'Website jobs' },
  { title: 'Graphic design jobs' },
  { title: 'Data entry jobs' },
  { title: 'Mobile app development jobs' },
  { title: 'Internet marketing jobs' },
  { title: 'Local jobs' }
];

const languageJobsData = [
  'Jobs in English', 'Jobs in Spanish', 'Jobs in Portuguese',
  'Jobs in French', 'Jobs in German', 'Jobs in Hindi',
  'Jobs in Chinese', 'Jobs in Japanese'
];

const popularJobsData = [
  'Software development jobs', 'Internet marketing jobs', 'Data entry jobs',
  'SEO jobs', 'Writing jobs', 'Legal jobs', 'Finance jobs',
  'Manufacturing jobs', 'Logistics jobs'
];

const solutionsData = [
  { name: "Enterprise", description: "Solutions for large organizations", href: "#" },
  { name: "TrustLance API", description: "Integrate our marketplace", href: "#" },
  { name: "AI Development", description: "AI-powered solutions", href: "#" },
  { name: "Field Services", description: "On-site professional services", href: "#" },
];

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'hire' | 'work' | 'solutions';
}

const FindWorkMegaMenu: React.FC<{ activeSection: string; setActiveSection: (section: string) => void }> = ({ activeSection, setActiveSection }) => {
  const renderRightPanel = () => {
    switch (activeSection) {
      case 'skill':
        return (
          <div>
            <div className="grid grid-cols-2 gap-4">
              {skillJobsData.map((job, index) => (
                <Link key={index} href="#" className="flex items-center gap-3 p-3 rounded hover:bg-gray-50">
                  <div className="w-12 h-9 bg-gray-200 rounded flex-shrink-0"></div>
                  <span className="text-sm font-medium">{job.title}</span>
                </Link>
              ))}
            </div>
          </div>
        );
      case 'language':
        return (
          <div>
            <h4 className="font-semibold mb-4">Find work in different languages</h4>
            <div className="space-y-2">
              {languageJobsData.map((lang, index) => (
                <Link key={index} href="#" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                  {lang}
                </Link>
              ))}
              <Link href="#" className="text-sm text-blue-600 hover:underline mt-2 block">
                View more →
              </Link>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Select a category to view options</p>
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-4 gap-8 h-80">
      <div className="col-span-1 bg-gray-800 text-white p-6 rounded-l">
        <div className="space-y-1">
          {findWorkNavigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left p-3 rounded transition-colors ${
                activeSection === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </div>
                <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
              </div>
              <p className="text-xs text-gray-300 mt-1 ml-8">{item.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="col-span-2 p-6">
        {renderRightPanel()}
      </div>

      <div className="col-span-1 p-6 border-l">
        <h4 className="font-semibold mb-4">Other popular jobs</h4>
        <div className="space-y-2">
          {popularJobsData.map((job, index) => (
            <Link key={index} href="#" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
              {job}
            </Link>
          ))}
          <Link href="#" className="text-sm text-blue-600 hover:underline mt-2 block">
            View more →
          </Link>
        </div>
      </div>
    </div>
  );
};

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, type }) => {
  const [activeWorkSection, setActiveWorkSection] = useState('skill');
  
  if (!isOpen) return null;

  if (type === 'hire') {
    return (
      <div 
        className="absolute top-full left-0 right-0 bg-white border-t shadow-lg z-50 max-w-none"
        onMouseLeave={onClose}
        style={{ left: '50%', transform: 'translateX(-50%)', width: 'min(100vw, 1200px)' }}
      >
        <div className="px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">By Skill</h3>
              <div className="space-y-3">
                {skillsData.map((skill) => (
                  <Link key={skill.name} href={skill.href} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                    <div className="text-blue-600">{skill.icon}</div>
                    <span className="text-sm">{skill.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">By Location</h3>
              <div className="space-y-2">
                {locationsData.map((location) => (
                  <Link key={location} href="#" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                    {location}
                  </Link>
                ))}
                <Link href="#" className="text-sm text-blue-600 hover:underline mt-2 block">
                  View more →
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">By Category</h3>
              <div className="max-h-80 overflow-y-auto">
                <div className="space-y-4">
                  {Object.entries(categoriesData).map(([category, skills]) => (
                    <div key={category}>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">{category}</h4>
                      <div className="space-y-1">
                        {skills.slice(0, 4).map((skill) => (
                          <Link key={skill} href="#" className="block text-xs text-gray-600 hover:text-blue-600">
                            {skill}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'work') {
    return (
      <div 
        className="absolute top-full left-0 right-0 bg-white border-t shadow-lg z-50 max-w-none overflow-x-hidden"
        onMouseLeave={onClose}
        style={{ left: '50%', transform: 'translateX(-50%)', width: 'min(100vw, 1200px)' }}
      >
        <div className="px-4 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-1 bg-gray-800 text-white p-6 rounded">
              <div className="space-y-1">
                {findWorkNavigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveWorkSection(item.id)}
                    className={`w-full text-left p-3 rounded transition-colors ${
                      activeWorkSection === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="font-medium text-sm">{item.title}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                    </div>
                    <p className="text-xs text-gray-300 mt-1 ml-8">{item.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="xl:col-span-2">
              {activeWorkSection === 'skill' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skillJobsData.map((job, index) => (
                      <Link key={index} href="#" className="flex items-center gap-3 p-3 rounded hover:bg-gray-50">
                        <div className="w-12 h-9 bg-gray-200 rounded flex-shrink-0"></div>
                        <span className="text-sm font-medium">{job.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {activeWorkSection === 'language' && (
                <div>
                  <h4 className="font-semibold mb-4">Find work in different languages</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {languageJobsData.map((lang, index) => (
                      <Link key={index} href="#" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                        {lang}
                      </Link>
                    ))}
                  </div>
                  <Link href="#" className="text-sm text-blue-600 hover:underline mt-3 block">
                    View more →
                  </Link>
                </div>
              )}
            </div>

            <div className="xl:col-span-1">
              <h4 className="font-semibold mb-4">Other popular jobs</h4>
              <div className="space-y-2">
                {popularJobsData.slice(0, 6).map((job, index) => (
                  <Link key={index} href="#" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                    {job}
                  </Link>
                ))}
                <Link href="#" className="text-sm text-blue-600 hover:underline mt-2 block">
                  View more →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'solutions') {
    return (
      <div 
        className="absolute top-full left-0 right-0 bg-gradient-to-b from-slate-800 to-slate-900 border-t border-slate-600/30 shadow-xl z-50 max-w-none overflow-x-hidden"
        onMouseLeave={onClose}
        style={{ left: '50%', transform: 'translateX(-50%)', width: 'min(100vw, 1200px)' }}
      >
        <div className="px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-white font-semibold text-lg mb-4">Solutions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {solutionsData.map((solution) => (
                  <Link key={solution.name} href={solution.href} className="block p-4 rounded hover:bg-slate-700/50 transition-colors">
                    <h4 className="font-medium text-sm mb-1 text-white">{solution.name}</h4>
                    <p className="text-xs text-slate-300">{solution.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-4">How it works</h3>
              <div className="space-y-2">
                <Link href="#" className="block text-sm text-slate-300 hover:text-blue-400 py-1">How to hire freelancers</Link>
                <Link href="#" className="block text-sm text-slate-300 hover:text-blue-400 py-1">How to earn money</Link>
                <Link href="#" className="block text-sm text-slate-300 hover:text-blue-400 py-1">Project management</Link>
                <Link href="#" className="block text-sm text-slate-300 hover:text-blue-400 py-1">Payment protection</Link>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
              <div className="space-y-2">
                <Link href="#" className="block text-sm text-slate-300 hover:text-blue-400 py-1">Get Web Design Ideas</Link>
                <Link href="#" className="block text-sm text-slate-300 hover:text-blue-400 py-1">Get Mobile App Ideas</Link>
                <Link href="#" className="block text-sm text-slate-300 hover:text-blue-400 py-1">What Is Adobe Photoshop</Link>
                <Link href="#" className="block text-sm text-slate-300 hover:text-blue-400 py-1">What Is Graphic Design</Link>
                <Link href="/solutions" className="block text-sm text-blue-400 hover:underline mt-3">View all solutions →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default function Header({ className }: { className?: string }) {
  const [activeMegaMenu, setActiveMegaMenu] = useState<'hire' | 'work' | 'solutions' | null>(null);

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-white backdrop-blur supports-[backdrop-filter]:bg-white/95", className)}>
      <div className="container flex h-16 items-center">
        <div className="mr-8">
          <Link href="/">
            <Logo asLink={false} />
          </Link>
        </div>
        
        <nav className="flex items-center h-full space-x-1">
          <div 
            className="relative h-full"
            onMouseEnter={() => setActiveMegaMenu('hire')}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <Button variant="ghost" className="h-full rounded-none px-4">
              Hire Freelancers
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
            {activeMegaMenu === 'hire' && (
              <MegaMenu 
                isOpen={true} 
                onClose={() => setActiveMegaMenu(null)} 
                type="hire" 
              />
            )}
          </div>
          
          <div 
            className="relative h-full"
            onMouseEnter={() => setActiveMegaMenu('work')}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <Button 
              variant="ghost" 
              className="h-full rounded-none px-4"
              onClick={() => window.location.href = '/find-jobs'}
            >
              Find Work
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
            {activeMegaMenu === 'work' && (
              <MegaMenu 
                isOpen={true} 
                onClose={() => setActiveMegaMenu(null)} 
                type="work" 
              />
            )}
          </div>
          
          <div 
            className="relative h-full"
            onMouseEnter={() => setActiveMegaMenu('solutions')}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <Button variant="ghost" className="h-full rounded-none px-4">
              Solutions
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
            {activeMegaMenu === 'solutions' && (
              <MegaMenu 
                isOpen={true} 
                onClose={() => setActiveMegaMenu(null)} 
                type="solutions" 
              />
            )}
          </div>
        </nav>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button asChild variant="ghost">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/post-project">Post a Project</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
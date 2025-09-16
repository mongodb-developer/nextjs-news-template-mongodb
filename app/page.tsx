import Image from "next/image";
import logo from "@/assets/logo.svg";
import logoDark from "@/assets/logo-dark.svg";
import vercelLogotypeLight from "@/assets/vercel-logotype-light.svg";
import vercelLogotypeDark from "@/assets/vercel-logotype-dark.svg";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatabaseStatusBadge } from "@/components/DatabaseStatusBadge";
import { AuthButton } from "@/components/AuthButton";
import { PostSection } from "@/components/PostSection";

const DATA = {
  title: "Next.js with MongoDB",
  description:
    "A full-stack React template with Next.js, Vercel, and MongoDB. Ships with forum and auth, or strip it all out.",
  buttons: {
    primary: {
      className: "rounded-full bg-[#00ED64] px-5 py-2.5 font-semibold tracking-tight text-[#001E2B] transition-colors duration-200 hover:bg-[#58C860] lg:px-7 lg:py-3"
    },
    ghost: {
      className: "group flex items-center gap-2 leading-none tracking-tight dark:hover:bg-white/10 hover:bg-black/5 dark:hover:text-white hover:text-black"
    }
  },
  link: {
    text: "View on Github",
    href: "https://github.com/mongodb-developer/nextjs-news-template-mongodb",
  },
  footerLinks: {
    nextjs: {
      text: "Next.js",
      href: "https://nextjs.org"
    },
    mongodb: {
      text: "MongoDB",
      href: "https://www.mongodb.com/?utm_campaign=devrel&utm_source=third-party-content&utm_medium=cta&utm_content=template-nextjs-news-mongodb&utm_term=jesse.hall"
    },
    vercel: {
      text: "Vercel",
      href: "https://vercel.com/marketplace/mongodbatlas"
    },
    betterAuth: {
      text: "Better Auth",
      href: "https://better-auth.com"
    },
    github: {
      text: "GitHub",
      href: "https://github.com/mongodb-developer/nextjs-news-template-mongodb"
    }
  },
};

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);

  return (
    <div className="flex min-h-screen flex-col justify-center">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col p-8 px-5 md:max-w-lg md:px-0 lg:max-w-xl max-h-[1000px]">
          <main className="flex flex-1 flex-col">
            <div className="flex gap-6 lg:gap-5 items-center mb-5">
              <Image
                className="lg:h-7 lg:w-auto dark:hidden"
                src={logo}
                alt="MongoDB logo"
                width={88}
                height={24}
                priority
              />
              <Image
                className="hidden lg:h-7 lg:w-auto dark:block"
                src={logoDark}
                alt="MongoDB logo"
                width={88}
                height={24}
                priority
              />
              <Image
                className="lg:h-5 lg:w-auto dark:hidden"
                src={vercelLogotypeLight}
                alt="Vercel logo"
                width={88}
                height={24}
                priority
              />
              <Image
                className="hidden lg:h-5 lg:w-auto dark:block"
                src={vercelLogotypeDark}
                alt="Vercel logo"
                width={88}
                height={24}
                priority
              />
            </div>
            <h1 className="text-3xl font-semibold leading-none tracking-tighter md:text-4xl md:leading-none">
              {DATA.title}
            </h1>
            <p className="mt-3.5 max-w-lg text-base leading-snug tracking-tight text-[#61646B] md:text-lg md:leading-snug lg:text-xl lg:leading-snug dark:text-[#94979E]">
              {DATA.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-5">
              <AuthButton className={DATA.buttons.primary.className} />
              <Button
                variant="ghost"
                asChild
                className={DATA.buttons.ghost.className}
              >
                <Link href={DATA.link.href} target="_blank">
                  {DATA.link.text}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 dark:text-white" />
                </Link>
              </Button>
            </div>

            <PostSection currentPage={currentPage} />
          </main>
          <footer className="flex flex-col sm:flex-row items-start justify-between gap-4 border-t border-[#023430] mt-4 py-5 sm:gap-6 md:pt-10 dark:border-[#023430]">
            <div className="text-sm text-[#61646B] dark:text-[#94979E] flex-1">
              Built with{" "}
              <Link 
                href={DATA.footerLinks.nextjs.href} 
                target="_blank" 
                className="text-[#00684A] dark:text-[#00ED64] hover:underline"
              >
                {DATA.footerLinks.nextjs.text}
              </Link>{", "}
              <Link
                href={DATA.footerLinks.betterAuth.href}
                target="_blank"
                className="text-[#00684A] dark:text-[#00ED64] hover:underline"
              >
                {DATA.footerLinks.betterAuth.text}
              </Link>{" "}
              and the native{" "}
              <Link 
                href={DATA.footerLinks.mongodb.href} 
                target="_blank" 
                className="text-[#00684A] dark:text-[#00ED64] hover:underline"
              >
                {DATA.footerLinks.mongodb.text}
              </Link>{" "}
              integration on{" "}
              <Link 
                href={DATA.footerLinks.vercel.href} 
                target="_blank" 
                className="text-[#00684A] dark:text-[#00ED64] hover:underline"
              >
                {DATA.footerLinks.vercel.text}
              </Link>
              . The source code is available on{" "}
              <Link 
                href={DATA.footerLinks.github.href} 
                target="_blank" 
                className="text-[#00684A] dark:text-[#00ED64] hover:underline"
              >
                {DATA.footerLinks.github.text}
              </Link>
              .
            </div>
            <DatabaseStatusBadge />
          </footer>
      </div>
    </div>
  );
}

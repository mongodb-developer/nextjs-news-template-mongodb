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
    "A minimal template for building full-stack React applications using Next.js, Vercel, MongoDB, and Better Auth.",
  buttons: {
    primary: {
      className: "rounded-full bg-[#00ED64] px-5 py-2.5 font-semibold tracking-tight text-[#001E2B] transition-colors duration-200 hover:bg-[#00684A] hover:text-[#FFFFFF] lg:px-7 lg:py-3"
    },
    ghost: {
      className: "group flex items-center gap-2 leading-none tracking-tight"
    }
  },
  link: {
    text: "Deploy Now",
    href: "https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmongodb-developer%2Fnextjs-news-template-mongodb&project-name=mongodb-news-nextjs&repository-name=mongodb-news-nextjs&demo-title=MongoDB%20%26%20Next.js%20Auth%20Starter%20Template&demo-description=A%20minimal%20template%20for%20building%20full-stack%20React%20applications%20using%20Next.js%2C%20Vercel%2C%2C%20Better%20Auth%20and%20MongoDB.&demo-url=https%3A%2F%2Fnews.mongodb.com&demo-image=https%3A%2F%2Fnews.mongodb.com%2Fog.png&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22mongodbatlas%22%2C%22productSlug%22%3A%22atlas%22%2C%22protocol%22%3A%22storage%22%7D%5D",
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
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col p-8 px-5 md:max-w-lg md:px-0 lg:max-w-xl">
          <main className="flex flex-1 flex-col">
            <div className="flex gap-6 lg:gap-8 items-center mb-6 md:mb-7">
              <Image
                className="lg:h-8 lg:w-auto dark:hidden"
                src={logo}
                alt="MongoDB logo"
                width={88}
                height={24}
                priority
              />
              <Image
                className="hidden lg:h-8 lg:w-auto dark:block"
                src={logoDark}
                alt="MongoDB logo"
                width={88}
                height={24}
                priority
              />
              <Image
                className="lg:h-6 lg:w-auto dark:hidden"
                src={vercelLogotypeLight}
                alt="MongoDB logo"
                width={88}
                height={24}
                priority
              />
              <Image
                className="hidden lg:h-6 lg:w-auto dark:block"
                src={vercelLogotypeDark}
                alt="MongoDB logo"
                width={88}
                height={24}
                priority
              />
            </div>
            <h1 className="text-3xl font-semibold leading-none tracking-tighter md:text-4xl md:leading-none lg:text-5xl lg:leading-none">
              {DATA.title}
            </h1>
            <p className="mt-3.5 max-w-lg text-base leading-snug tracking-tight text-[#61646B] md:text-lg md:leading-snug lg:text-xl lg:leading-snug dark:text-[#94979E]">
              {DATA.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5 md:mt-9 lg:mt-10">
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
          <footer className="flex flex-col sm:flex-row items-start justify-between gap-4 border-t border-[#023430] mt-4 py-5 sm:gap-6 md:pb-12 md:pt-10 dark:border-[#023430]">
            <div className="text-sm text-[#61646B] dark:text-[#94979E] flex-1">
              Built with{" "}
              <Link 
                href={DATA.footerLinks.nextjs.href} 
                target="_blank" 
                className="text-[#00ED64] hover:underline"
              >
                {DATA.footerLinks.nextjs.text}
              </Link>{", "}
              <Link
                href={DATA.footerLinks.betterAuth.href}
                target="_blank"
                className="text-[#00ED64] hover:underline"
              >
                {DATA.footerLinks.betterAuth.text}
              </Link>{" "}
              and the native{" "}
              <Link 
                href={DATA.footerLinks.mongodb.href} 
                target="_blank" 
                className="text-[#00ED64] hover:underline"
              >
                {DATA.footerLinks.mongodb.text}
              </Link>{" "}
              integration on{" "}
              <Link 
                href={DATA.footerLinks.vercel.href} 
                target="_blank" 
                className="text-[#00ED64] hover:underline"
              >
                {DATA.footerLinks.vercel.text}
              </Link>
              . The source code is available on{" "}
              <Link 
                href={DATA.footerLinks.github.href} 
                target="_blank" 
                className="text-[#00ED64] hover:underline"
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

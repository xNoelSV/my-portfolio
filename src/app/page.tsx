import React from "react";
import Link from "next/link";
import { SOCIALS } from "@/data/socials";
import { SocialLink } from "@/components/social-link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { LINKS } from "@/data/links";
import { Separator } from "@/components/ui/separator";
import { allBlogs } from ".contentlayer/generated";
import { BlogListItem } from "@/components/blog/blog-item";

export default function HomePage() {
  const blogs = allBlogs
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 2);

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div className="flex items-center gap-6">
          <Image
            src="/_static/me.jpg"
            width={120}
            height={120}
            alt="Adarsha Acharya"
            className="rounded-2xl transition-all duration-300 hover:scale-105"
            priority
          />
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-bold">Noel Sariñena Varela</h1>

            <div className="flex items-center gap-4">
              {SOCIALS.map((social) => (
                <SocialLink
                  key={social.label}
                  aria-label={`Follow on ${social.label}`}
                  href={social.href}
                  icon={social.icon}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            I&apos;m a software engineer with a strong ability to learn quickly
            and a deep passion for technology. While I work across the full
            stack, I have a special affinity for backend development.
          </p>
          <p>
            I&apos;m particularly enthusiastic about Java Spring and
            continuously expanding my expertise in building robust, scalable
            applications. My drive to keep learning fuels my commitment to
            staying current with emerging technologies and best practices.
          </p>
          <p>
            If you have an exciting opportunity that aligns with my skills and
            passion for backend development, feel free to reach out at{" "}
            <a
              href="mailto:noelsava25@gmail.com"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
            >
              noelsava25@gmail.com
            </a>{" "}
            or connect with me through any of my social channels.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <a href={LINKS.RESUME} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />
              Resume
            </a>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/projects">
              View Projects
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* <Separator />

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          About my experience
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <h3 className="mt-5 text-lg font-bold racking-tight">
            Software Engineer at Everis (an NTT DATA Company) - June 2023 to
            Present
          </h3>
          <p></p>
        </div>
      </section> */}

      <Separator />

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Latest Posts
          </h2>
          <Button variant="ghost" asChild>
            <Link href="/blog">
              View all posts
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl divide-y divide-border/40">
          {!blogs.length ? (
            <p className="flex items-center justify-center mt-5 text-muted-foreground leading-relaxed">
              No blogs found.
            </p>
          ) : (
            blogs.map((blog) => (
              <Link
                key={blog.slug}
                href={`/blog/${blog.slug}`}
                className="block hover:bg-muted/30 transition-colors duration-200 rounded-lg -mx-4 px-4"
              >
                <BlogListItem blog={blog} />
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

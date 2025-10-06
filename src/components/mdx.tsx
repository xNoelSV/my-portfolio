import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { getMDXComponent } from "next-contentlayer2/hooks";

function CustomLink(props: { href: string; children: React.ReactNode }) {
  const { href, ...rest } = props;

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...rest}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage(props: { alt: string; src: string }) {
  return <Image {...props} alt={props.alt} className="rounded-lg" />;
}

const components = {
  Image: RoundedImage,
  a: CustomLink,
};

export function Mdx({ code }: { code: string }) {
  const Content = getMDXComponent(code);

  return (
    <React.Fragment>
      <article className="prose prose-neutral dark:prose-invert prose-quoteless max-w-none">
        <Content components={components} />
      </article>
    </React.Fragment>
  );
}

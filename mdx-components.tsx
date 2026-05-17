import type { MDXComponents } from "mdx/types";
import { Block } from "@/components/project/Block";
import { Media } from "@/components/project/Media";
import { SectionBreak } from "@/components/project/SectionBreak";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Block,
    Media,
    SectionBreak,
    ...components,
  };
}

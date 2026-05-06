import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { blogPosts } from "@/content/blog-data";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return { title: "Post Not Found | Worldwide Visa Adviser" };
  return {
    title: `${post.title} | Worldwide Visa Adviser`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col wva-page-bg">
      <Navbar
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/#services" },
          { label: "Referral Program", href: "/#leaders" },
          { label: "About", href: "/#about" },
          { label: "Blog", href: "/blog" },
          { label: "Contact Us", href: "/#contact" },
          { label: "Login", href: "/login" },
        ]}
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10 md:px-8 md:py-12">
        <Link href="/blog" className="text-sm font-semibold text-[#0B3C5D] hover:underline">
          ← Back to Blog
        </Link>
        <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs text-slate-500">{post.author}</p>
          <p className="mt-1 text-xs text-slate-500">Comments (0)</p>
          <p className="mt-1 text-xs text-slate-500">{post.date}</p>
          <h1 className="mt-4 text-3xl font-extrabold text-slate-900 md:text-4xl">
            {post.title}
          </h1>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700 md:text-base">
            {post.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}

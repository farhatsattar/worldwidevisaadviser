import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { blogPosts, blogTags } from "@/content/blog-data";

export const metadata: Metadata = {
  title: "Blog | Worldwide Visa Adviser",
  description: "Insights, guidance, and updates from Worldwide Visa Adviser.",
};

export default function BlogPage() {
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

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 md:px-8 md:py-12">
        <h1 className="text-4xl font-extrabold text-slate-900 md:text-5xl">Blog</h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-5">
            {blogPosts.map((post) => (
              <article
                key={post.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-xs text-slate-500">{post.author}</p>
                <p className="mt-1 text-xs text-slate-500">Comments (0)</p>
                <p className="mt-1 text-xs text-slate-500">{post.date}</p>
                <h2 className="mt-4 text-2xl font-bold text-slate-900">{post.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:border-emerald-700 hover:bg-emerald-700"
                >
                  Read More
                </Link>
              </article>
            ))}
          </section>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Search</h3>
              <input
                type="text"
                placeholder="Search"
                className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0B3C5D]"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Recent Posts</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {blogPosts.map((post) => (
                  <li key={post.title}>
                    -{" "}
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Archives</h3>
              <p className="mt-3 text-sm text-slate-700">- February 2026</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Categories</h3>
              <p className="mt-3 text-sm text-slate-700">- Blog</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Tags</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {blogTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Search</h3>
              <label className="mt-3 block text-sm text-slate-600">Search for:</label>
              <input
                type="text"
                placeholder="Search"
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0B3C5D]"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Recent Posts</h3>
              <div className="mt-3 space-y-3">
                {blogPosts.map((post) => (
                  <div key={`${post.slug}-dup`} className="text-sm">
                    <p className="text-xs text-slate-500">{post.date}</p>
                    <Link href={`/blog/${post.slug}`} className="font-semibold text-slate-800 hover:underline">
                      {post.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Categories</h3>
              <p className="mt-3 text-sm text-slate-700">- Blog</p>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

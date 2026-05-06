"use client";

import { useState } from "react";
import { Reveal } from "./reveal";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill all fields before submitting.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSuccess("Your message has been submitted successfully.");
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <section id="contact" className="py-16 md:py-20">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_20px_45px_rgba(11,60,93,0.12)] backdrop-blur-sm md:p-10">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B3C5D]">
            Contact Us
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Do you have questions or want more information?
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-8 max-w-3xl">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 md:col-span-2"
            />
            {error ? (
              <p className="text-sm font-medium text-rose-600 md:col-span-2">{error}</p>
            ) : null}
            {success ? (
              <p className="text-sm font-medium text-emerald-600 md:col-span-2">
                {success}
              </p>
            ) : null}
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-[#0B3C5D] to-[#1c5d88] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:from-[#072c44] hover:to-[#0B3C5D] md:col-span-2"
            >
              Send Message
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { waLink } from "@/lib/wa";
import styles from "./contact.module.css";

const BUYER_TYPES = [
  "Casual buyer",
  "Office / business buyer",
  "Hobbyist / maker / student",
  "Reseller / bulk",
];

const INTERESTS = [
  "General enquiry",
  "Audio (speakers, soundbars)",
  "Multimeters & test gear",
  "Peripherals (keyboard, mouse)",
  "Cables & adapters",
  "Components / ICs / DIY",
];

export function ContactForm({ whatsapp }: { whatsapp: string }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    buyer: BUYER_TYPES[0],
    interest: INTERESTS[0],
    message: "",
  });

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      "Hi Wireless India! I'd like to enquire.",
      `Name: ${form.name}`,
      form.phone && `Phone: ${form.phone}`,
      form.email && `Email: ${form.email}`,
      `I'm a: ${form.buyer}`,
      `Looking for: ${form.interest}`,
      form.message && `Details: ${form.message}`,
    ].filter(Boolean);
    window.open(waLink(whatsapp, lines.join("\n")), "_blank", "noopener");
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.row2}>
        <label>
          Your name
          <input
            placeholder="e.g. Priya R."
            required
            value={form.name}
            onChange={update("name")}
          />
        </label>
        <label>
          Phone / WhatsApp
          <input
            placeholder="+91 98xxx xxxxx"
            required
            value={form.phone}
            onChange={update("phone")}
          />
        </label>
      </div>
      <label>
        Email
        <input
          type="email"
          placeholder="you@company.in"
          value={form.email}
          onChange={update("email")}
        />
      </label>
      <div className={styles.row2}>
        <label>
          I&apos;m a...
          <select value={form.buyer} onChange={update("buyer")}>
            {BUYER_TYPES.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label>
          Looking for...
          <select value={form.interest} onChange={update("interest")}>
            {INTERESTS.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Tell us more
        <textarea
          placeholder="Models, quantities, deadlines — anything that helps us reply faster."
          value={form.message}
          onChange={update("message")}
        />
      </label>
      <button className={styles.submit} type="submit">
        Send on WhatsApp
        <Icon name="whatsapp" size={14} />
      </button>
      <p className={styles.formNote}>
        Opens WhatsApp with your enquiry pre-filled — usually the fastest way to
        reach us.
      </p>
    </form>
  );
}

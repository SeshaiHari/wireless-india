import type { Metadata } from "next";
import { getCategories, getShopSettings } from "@/lib/catalog";
import { telHref, waLink } from "@/lib/wa";
import { localBusinessJsonLd } from "@/lib/jsonld";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactForm } from "./ContactForm";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Visit us",
  description:
    "Visit Wireless India at 8, Kadarkarai Nadar St, Theni — 625531. Open Mon–Sat, 10:30 am – 8:30 pm. Call or WhatsApp +91 98658 11796.",
};

const HOURS = [
  { day: "Monday", time: "10:30 am – 8:30 pm" },
  { day: "Tuesday", time: "10:30 am – 8:30 pm" },
  { day: "Wednesday", time: "10:30 am – 8:30 pm" },
  { day: "Thursday", time: "10:30 am – 8:30 pm" },
  { day: "Friday", time: "10:30 am – 8:30 pm" },
  { day: "Saturday", time: "10:30 am – 8:30 pm" },
  { day: "Sunday", time: "Closed", closed: true },
];

const FAQS = [
  {
    q: "Can I try things before buying?",
    a: "Yes. We have a demo bench for audio and most peripherals are out of the box for you to try. Just walk in.",
    open: true,
  },
  {
    q: "Do you give GST invoices?",
    a: "Always. Share your company name and GSTIN at the counter, or in the enquiry form above for bulk orders.",
  },
  {
    q: "Do you deliver outside the city?",
    a: "Yes — anywhere in India via courier. In-city is usually same-day or next-day; outside, 2–5 days depending on location.",
  },
  {
    q: "What about returns & warranty?",
    a: "Brand warranty on everything. For dead-on-arrival items, bring it back within 7 days for a no-questions replacement.",
  },
  {
    q: "Do you offer repairs?",
    a: "Cable termination, soldering and basic audio repairs — yes. For brand-warranty service we coordinate with the official centre.",
  },
  {
    q: "Can I order online today?",
    a: "The full online store is on its way — for now, browse here and ping us on WhatsApp; we'll confirm stock and arrange pickup or delivery.",
  },
];

export default async function ContactPage() {
  const [categories, shop] = await Promise.all([
    getCategories(),
    getShopSettings(),
  ]);

  const todayIdx = (new Date().getDay() + 6) % 7; // Mon=0 … Sun=6
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    shop.address,
  )}`;

  return (
    <>
      <JsonLd data={localBusinessJsonLd(shop)} />
      <SiteHeader categories={categories} shop={shop} variant="sub" />

      <main id="main">
      {/* Hero */}
      <section className={styles.hero}>
        <div className="wrap">
          <span className={styles.eyebrow}>Come say hi</span>
          <h1 className={styles.title}>
            Visit the
            <br />
            <em>shop in person.</em>
          </h1>
          <p>
            There&apos;s no replacement for actually hearing a soundbar in a
            room, or holding the keyboard before you buy. Open six days a week —
            coffee while you compare? Sure.
          </p>

          <div className={styles.quick}>
            <a className={styles.qcard} href={telHref(shop.phone)}>
              <div className={styles.ico}>
                <Icon name="phone" size={22} />
              </div>
              <div>
                <span className={styles.label}>Call us</span>
                <div className={styles.val}>{shop.phone}</div>
                <div className={styles.sub}>{shop.hours}</div>
              </div>
            </a>
            <a
              className={`${styles.qcard} ${styles.wa}`}
              href={waLink(shop.whatsapp)}
              target="_blank"
              rel="noopener"
            >
              <div className={styles.ico}>
                <Icon name="whatsapp" size={22} />
              </div>
              <div>
                <span className={styles.label}>WhatsApp · fastest</span>
                <div className={styles.val}>{shop.phone}</div>
                <div className={styles.sub}>Replies in 15 min during shop hours</div>
              </div>
            </a>
            <a
              className={styles.qcard}
              href={directions}
              target="_blank"
              rel="noopener"
            >
              <div className={styles.ico}>
                <Icon name="pin" size={22} />
              </div>
              <div>
                <span className={styles.label}>Directions</span>
                <div className={styles.val}>8, Kadarkarai Nadar St</div>
                <div className={styles.sub}>Theni — 625531 · Open in Maps ↗</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Visit + map */}
      <section className={styles.main}>
        <div className="wrap">
          <div className={styles.grid2}>
            <div className={styles.visitCard}>
              <span className={styles.eyebrow}>The shop</span>
              <h2>Find us.</h2>
              <dl>
                <dt>Address</dt>
                <dd>{shop.address}</dd>
                <dt>Hours</dt>
                <dd>
                  <div className={styles.hoursTable}>
                    {HOURS.map((h, i) => (
                      <div
                        key={h.day}
                        className={`${styles.r} ${i === todayIdx ? styles.today : ""} ${
                          h.closed ? styles.closed : ""
                        }`}
                      >
                        <span className={styles.day}>{h.day}</span>
                        <span className={styles.time}>{h.time}</span>
                      </div>
                    ))}
                  </div>
                </dd>
                <dt>Parking</dt>
                <dd>Two-wheeler parking out front. Paid 4-wheeler parking nearby.</dd>
              </dl>
              <div className={styles.actions}>
                <a className="btn" href={directions} target="_blank" rel="noopener">
                  Get directions ↗
                </a>
                <a
                  className="btn wa"
                  href={waLink(shop.whatsapp)}
                  target="_blank"
                  rel="noopener"
                >
                  <Icon name="whatsapp" size={14} /> Message us
                </a>
              </div>
            </div>

            <div className={styles.mapCard}>
              {shop.mapEmbedUrl && (
                <iframe
                  src={shop.mapEmbedUrl}
                  title="Wireless India location"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Enquire */}
      <section className={styles.enquire}>
        <div className="wrap">
          <div className={styles.enquireCard}>
            <div className={styles.enquireInfo}>
              <span className={styles.eyebrow} style={{ color: "#ffd1bf" }}>
                Bulk or office buyer?
              </span>
              <h2>
                Request a<br />
                <em>quote.</em>
              </h2>
              <p>
                Outfitting a few desks or a whole floor — tell us what you need
                and we&apos;ll send pricing with GST, lead time and bulk rates.
              </p>
              <div className={styles.checks}>
                {[
                  "15-minute reply during shop hours",
                  "GST invoice on every order",
                  "Delivery anywhere in India",
                  'Honest stock status. No "soon".',
                ].map((c) => (
                  <div key={c} className={styles.check}>
                    <span className={styles.b}>
                      <Icon name="check" size={12} />
                    </span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <ContactForm whatsapp={shop.whatsapp} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className="wrap">
          <div className={styles.faqGrid}>
            <div>
              <span className={styles.eyebrow}>FAQ</span>
              <h2>
                Asked
                <br />
                often.
              </h2>
              <p className={styles.faqIntro}>
                Quick answers to the things we hear at the counter every week.
                Don&apos;t see yours? Just WhatsApp us.
              </p>
            </div>
            <div className={styles.faqList}>
              {FAQS.map((f) => (
                <details key={f.q} className={styles.qa} open={f.open}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
      </main>

      <SiteFooter categories={categories} shop={shop} />
    </>
  );
}

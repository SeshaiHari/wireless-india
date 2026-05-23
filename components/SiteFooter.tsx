import Link from "next/link";
import type { Category, ShopSettings } from "@/lib/types";
import { telHref, waLink } from "@/lib/wa";
import styles from "./SiteFooter.module.css";

export function SiteFooter({
  categories,
  shop,
}: {
  categories: Category[];
  shop: ShopSettings;
}) {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.cols}`}>
        <div>
          <Link href="/" className={styles.logo}>
            <span className={styles.mark}>
              <img src="/logo.svg" alt="Wireless India" />
            </span>
            <span>{shop.name}</span>
          </Link>
          <p className={styles.blurb}>
            A neighbourhood electronics shop, online. Audio, peripherals,
            components &amp; tools — under one roof in Theni.
          </p>
        </div>

        <div>
          <h4>Shop</h4>
          <ul>
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.id}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Help</h4>
          <ul>
            <li>
              <Link href="/contact">Visit shop</Link>
            </li>
            <li>Bulk &amp; trade buyers</li>
            <li>Repairs &amp; service</li>
            <li>Warranty claim</li>
            <li>
              <a href={waLink(shop.whatsapp)} target="_blank" rel="noopener">
                WhatsApp enquiry
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul>
            <li>
              <a href={telHref(shop.phone)}>{shop.phone}</a>
            </li>
            <li>{shop.hours}</li>
            <li>{shop.address}</li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Wireless India · Designed with care</span>
        <span>Components, audio &amp; accessories</span>
      </div>
    </footer>
  );
}

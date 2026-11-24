import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Price and was price become plain numbers (the site adds ₹ and commas).
// Existing text values like "₹1,499", "Rs. 1,499/-" or "1499" keep their first
// number; anything without a number becomes 0 (shown as "Price on request")
// for price, or empty for was price.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" ALTER COLUMN "price" SET DATA TYPE numeric USING COALESCE(replace(substring("price" from '[0-9][0-9,]*(?:\\.[0-9]+)?'), ',', '')::numeric, 0);
  ALTER TABLE "products" ALTER COLUMN "was_price" SET DATA TYPE numeric USING replace(substring("was_price" from '[0-9][0-9,]*(?:\\.[0-9]+)?'), ',', '')::numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" ALTER COLUMN "price" SET DATA TYPE varchar USING '₹' || rtrim(to_char("price", 'FM99,99,99,999.99'), '.');
  ALTER TABLE "products" ALTER COLUMN "was_price" SET DATA TYPE varchar USING '₹' || rtrim(to_char("was_price", 'FM99,99,99,999.99'), '.');`)
}

import type { SchemaTypeDefinition } from "sanity";
import { shopSettings } from "./shopSettings";
import { category } from "./category";
import { brand } from "./brand";
import { product } from "./product";

export const schemaTypes: SchemaTypeDefinition[] = [
  shopSettings,
  category,
  brand,
  product,
];

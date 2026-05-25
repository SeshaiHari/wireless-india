const KEY = "wi-favourites";
export const FAVOURITES_EVENT = "wi-favourites-updated";

export function getFavourites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function toggleFavourite(id: string): void {
  const current = getFavourites();
  const updated = current.includes(id)
    ? current.filter((x) => x !== id)
    : [...current, id];
  localStorage.setItem(KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event(FAVOURITES_EVENT));
}

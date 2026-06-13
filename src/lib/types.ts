export interface Product {
  id: string;
  name: string;
  category: string; // Men-Shirts, Men-Pants, Men-Jackets, Men-Accessories, Women-Tops, Women-Dresses, Women-Bottoms, Women-Accessories
  image: string;
  affiliateLink: string;
  newArrival: boolean;
  createdAt: number;
}

export interface AffiliateLinkItem {
  label: string;
  url: string;
}

export function parseAffiliateLinks(linksStr: string): AffiliateLinkItem[] {
  if (!linksStr) return [];
  return linksStr
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const parts = line.split("|");
      if (parts.length >= 2) {
        return {
          label: parts[0].trim(),
          url: parts.slice(1).join("|").trim(),
        };
      }
      return {
        label: "Shop Item",
        url: line,
      };
    });
}

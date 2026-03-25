export type Product = {
  id: string;
  category: string;
  slug: string;
  name: string;
  industry: string;
  shortDesc: string;
  technicalSpecs: Record<string, string>;
  features: string[];
  image: string;
};

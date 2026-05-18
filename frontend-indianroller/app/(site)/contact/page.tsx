import ContactClient from "../../../components/contact/ContactClient";
import { getSeoMetadataByPath } from "@/lib/seo";

export async function generateMetadata() {
  return getSeoMetadataByPath("/contact", {
    title: "Contact Indian Roller",
    description: "Get in touch with Indian Roller for industrial roller product enquiries, support, and business assistance.",
  });
}

export default function ContactPage() {
  return <ContactClient />;
}

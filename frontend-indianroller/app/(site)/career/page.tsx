import CareerClient from "../../../components/career/CareerClient";
import { getSeoMetadataByPath } from "@/lib/seo";

export async function generateMetadata() {
  return getSeoMetadataByPath("/career", {
    title: "Careers at Indian Roller",
    description: "Explore career opportunities at Indian Roller.",
  });
}

export default function CareerPage() {
  return <CareerClient />;
}

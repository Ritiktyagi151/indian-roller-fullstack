"use client";

import { useSearchParams } from "next/navigation";
import ApiEnquiriesManager from "@/components/admin/panel/ApiEnquiriesManager";

export default function EnquiriesPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") === "forms" ? "forms" : "contact";

  return <ApiEnquiriesManager initialTab={tab} />;
}

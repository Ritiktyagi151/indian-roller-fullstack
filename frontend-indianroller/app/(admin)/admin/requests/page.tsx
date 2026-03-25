"use client";

import { useSearchParams } from "next/navigation";
import EnquiriesManager from "@/components/admin/panel/EnquiriesManager";

export default function RequestsPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") === "forms" ? "forms" : "contact";

  return <EnquiriesManager initialTab={tab} />;
}

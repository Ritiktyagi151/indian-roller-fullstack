"use client";

import { useSearchParams } from "next/navigation";
import SettingsPanel from "@/components/admin/panel/SettingsPanel";

export default function ConfigPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") === "roles" ? "roles" : "profile";

  return <SettingsPanel initialTab={tab} />;
}

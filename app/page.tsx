import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/shared/presentation/i18n/locale";

export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`);
}

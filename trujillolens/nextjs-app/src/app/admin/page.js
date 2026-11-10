import { redirect } from "next/navigation";

export const metadata = {
  title: "Portal Staff & Panel de Decisiones | Lens Group Trujillo",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  redirect("/admin.html");
}


// Redirect root "/" to "/login"
import { redirect } from "next/navigation";

export default function HomeRedirect() {
  redirect("/login");
}

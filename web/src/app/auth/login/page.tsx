import { authOptions } from "@/app/api/auth/[...nextauth]/constants";
import LoginForm from "@/components/LoginForm/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const serverSession = await getServerSession(authOptions);

  if (serverSession) {
    redirect("/");
  }

  return <LoginForm />;
}

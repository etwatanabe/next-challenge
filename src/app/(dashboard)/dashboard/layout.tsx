import { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/utils/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-[var(--background)]">
      <DashboardSidebar />
      <main className="flex-1 md:ml-64 p-4 overflow-y-auto">
        <div className="container mx-auto py-6">{children}</div>
      </main>
    </div>
  );
}

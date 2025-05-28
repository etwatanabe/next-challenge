import "@/app/globals.css";
import { SessionProvider } from "@/contexts/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="pt-br">
      <body>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}

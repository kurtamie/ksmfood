import RequireAuth from "@/components/auth/require-auth";

export default function PesananLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}

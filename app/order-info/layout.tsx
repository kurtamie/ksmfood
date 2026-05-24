import RequireAuth from "@/components/auth/require-auth";

export default function OrderInfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}

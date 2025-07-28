import { notFound } from "next/navigation";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  return <div>Payment Success</div>;
}

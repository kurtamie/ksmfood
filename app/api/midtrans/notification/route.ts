import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { updateInvoicePaymentStatusByOrder } from "@/lib/invoices";
import {
  getMidtransServerKey,
  parseOrderIdFromMidtransOrderId,
} from "@/lib/midtrans";

const PAID_STATUSES = new Set(["capture", "settlement"]);

function verifySignature(payload: Record<string, string>): boolean {
  const { order_id, status_code, gross_amount, signature_key } = payload;

  if (!order_id || !status_code || !gross_amount || !signature_key) {
    return false;
  }

  const serverKey = getMidtransServerKey();
  const expected = createHash("sha512")
    .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
    .digest("hex");

  return expected === signature_key;
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Record<string, string>;
    const transactionStatus = payload.transaction_status;
    const fraudStatus = payload.fraud_status;

    if (!verifySignature(payload)) {
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 403 },
      );
    }

    const orderId = parseOrderIdFromMidtransOrderId(payload.order_id);
    if (!orderId) {
      return NextResponse.json({ success: true, message: "Ignored order id" });
    }

    const isPaid =
      PAID_STATUSES.has(transactionStatus) &&
      (fraudStatus === "accept" || !fraudStatus);

    if (isPaid) {
      await updateInvoicePaymentStatusByOrder(orderId, "paid", {
        invoiceNo: payload.transaction_id
          ? `INV/${payload.transaction_id}`
          : undefined,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Midtrans notification error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Notification handler error",
      },
      { status: 500 },
    );
  }
}

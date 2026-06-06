import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/app/data/services/get-token";
import {
  getMidtransAuthHeader,
  getMidtransTransactionStatusUrl,
  parseOrderIdFromMidtransOrderId,
} from "@/lib/midtrans";
import { updateInvoicePaymentStatusByMidtransOrder } from "@/lib/invoices";
import type { InvoiceStatus } from "@/types/invoices";

const PAID_STATUSES = new Set(["capture", "settlement"]);
const OVERDUE_STATUSES = new Set(["expire"]);

type MidtransStatusResponse = {
  order_id?: string;
  transaction_id?: string;
  transaction_status?: string;
  fraud_status?: string;
  status_message?: string;
  error_messages?: string[];
};

function mapMidtransStatus(
  transactionStatus: string | undefined,
  fraudStatus: string | undefined,
): InvoiceStatus | null {
  if (
    transactionStatus &&
    PAID_STATUSES.has(transactionStatus) &&
    (fraudStatus === "accept" || !fraudStatus)
  ) {
    return "paid";
  }

  if (transactionStatus && OVERDUE_STATUSES.has(transactionStatus)) {
    return "overdue";
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const midtransOrderId =
      typeof body?.midtransOrderId === "string" ? body.midtransOrderId : "";

    if (!midtransOrderId) {
      return NextResponse.json(
        { success: false, error: "midtransOrderId wajib diisi." },
        { status: 400 },
      );
    }

    const orderId = parseOrderIdFromMidtransOrderId(midtransOrderId);
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID Midtrans tidak valid." },
        { status: 400 },
      );
    }

    const statusRes = await fetch(
      getMidtransTransactionStatusUrl(midtransOrderId),
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: getMidtransAuthHeader(),
        },
        cache: "no-store",
      },
    );
    const statusData = (await statusRes
      .json()
      .catch(() => null)) as MidtransStatusResponse | null;

    if (!statusRes.ok) {
      const message =
        statusData?.error_messages?.join(", ") ??
        statusData?.status_message ??
        "Gagal mengecek status pembayaran Midtrans.";
      return NextResponse.json(
        { success: false, error: message },
        { status: statusRes.status },
      );
    }

    const paymentStatus = mapMidtransStatus(
      statusData?.transaction_status,
      statusData?.fraud_status,
    );

    if (paymentStatus) {
      await updateInvoicePaymentStatusByMidtransOrder(
        orderId,
        midtransOrderId,
        paymentStatus,
        {
          invoiceNo:
            paymentStatus === "paid" && statusData?.transaction_id
              ? `INV/${statusData.transaction_id}`
              : undefined,
          token: await getToken(),
        },
      );
    }

    return NextResponse.json({
      success: true,
      paymentStatus,
      midtransStatus: statusData?.transaction_status ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal sinkronisasi status pembayaran Midtrans.",
      },
      { status: 500 },
    );
  }
}

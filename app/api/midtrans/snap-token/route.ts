import { NextRequest, NextResponse } from "next/server";
import {
  buildMidtransOrderId,
  getMidtransAuthHeader,
  getMidtransSnapApiUrl,
} from "@/lib/midtrans";
import { getOrderPaymentAmount } from "@/lib/orders";
import { getToken } from "@/app/data/services/get-token";
import {
  findInvoiceByIdentifier,
  findInvoiceByOrderId,
  updateInvoiceMidtransPaymentData,
  updateInvoiceMidtransPaymentDataByOrder,
} from "@/lib/invoices";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orderId = Number(body?.orderId);
    const grossAmountFromClient = Number(body?.grossAmount);
    const invoiceDocumentId =
      typeof body?.invoiceDocumentId === "string"
        ? body.invoiceDocumentId
        : null;
    const invoiceId = Number(body?.invoiceId);

    if (!Number.isFinite(orderId) || orderId <= 0) {
      return NextResponse.json(
        { success: false, error: "orderId tidak valid." },
        { status: 400 },
      );
    }

    const token = await getToken();
    const invoiceIdentifier =
      invoiceDocumentId ??
      (Number.isFinite(invoiceId) && invoiceId > 0 ? invoiceId : null);
    const invoice = invoiceIdentifier
      ? await findInvoiceByIdentifier(invoiceIdentifier, token)
      : await findInvoiceByOrderId(orderId, token);
    const existingSnapToken = invoice?.midtrans_snap_token ?? null;
    const existingRedirectUrl = invoice?.midtrans_redirect_url ?? null;

    if (
      invoice?.payment_status === "overdue" ||
      invoice?.payment_status === "expired"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invoice sudah jatuh tempo. Pembayaran tidak dapat dilanjutkan.",
        },
        { status: 409 },
      );
    }

    if (existingSnapToken || existingRedirectUrl) {
      return NextResponse.json({
        success: true,
        token: existingSnapToken,
        redirectUrl: existingRedirectUrl,
        midtransOrderId: invoice?.midtrans_order_id ?? null,
        reused: true,
      });
    }

    const payment =
      Number.isFinite(grossAmountFromClient) && grossAmountFromClient > 0
        ? { amount: grossAmountFromClient, order: null }
        : await getOrderPaymentAmount(orderId);

    const amount = payment.amount;
    const order = payment.order;

    if (amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Total pembayaran tidak valid.",
        },
        { status: 400 },
      );
    }

    const midtransOrderId = buildMidtransOrderId(orderId);

    const snapPayload = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: Math.round(amount),
      },
      customer_details: {
        first_name:
          body?.customerName ?? order?.recipient_name ?? "Pelanggan KSM",
        phone: body?.customerPhone ?? order?.recipient_phone_no ?? undefined,
      },
      item_details: [
        {
          id: String(orderId),
          price: Math.round(amount),
          quantity: 1,
          name: `Pesanan KSM #${order?.order_no ?? orderId}`,
        },
      ],
    };

    const snapRes = await fetch(getMidtransSnapApiUrl(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: getMidtransAuthHeader(),
      },
      body: JSON.stringify(snapPayload),
    });

    const snapData = await snapRes.json();

    if (!snapRes.ok) {
      const message =
        snapData?.error_messages?.join?.(", ") ??
        snapData?.status_message ??
        "Gagal membuat token Midtrans Snap.";
      return NextResponse.json(
        { success: false, error: message },
        { status: snapRes.status },
      );
    }

    try {
      const saveResult = invoiceIdentifier
        ? await updateInvoiceMidtransPaymentData(
            invoiceIdentifier,
            {
              midtransOrderId,
              snapToken: snapData.token,
              redirectUrl: snapData.redirect_url,
            },
            token,
          )
        : await updateInvoiceMidtransPaymentDataByOrder(
            orderId,
            {
              midtransOrderId,
              snapToken: snapData.token,
              redirectUrl: snapData.redirect_url,
            },
            token,
          );

      if (!saveResult) {
        return NextResponse.json(
          {
            success: false,
            error: "Invoice pembayaran tidak ditemukan untuk menyimpan Snap.",
          },
          { status: 404 },
        );
      }
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Gagal menyimpan data pembayaran Midtrans ke invoice.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      token: snapData.token,
      redirectUrl: snapData.redirect_url,
      midtransOrderId,
      grossAmount: Math.round(amount),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat membuat Snap token.",
      },
      { status: 500 },
    );
  }
}

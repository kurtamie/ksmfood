import type { OrderDisplayStep } from "@/types/orders";

const STEPS: {
  key: OrderDisplayStep;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "waiting_payment",
    label: "Menunggu Pembayaran",
    sublabel: "Tagihan belum dibayar",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    key: "packing",
    label: "Packing",
    sublabel: "Pesanan sedang disiapkan",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16.5 9.4 7.55 4.24" />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.29 7 12 12 20.71 7" />
        <line x1="12" x2="12" y1="22" y2="12" />
      </svg>
    ),
  },
  {
    key: "send",
    label: "Pengiriman",
    sublabel: "Dalam perjalanan",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    key: "success",
    label: "Diterima",
    sublabel: "Pesanan selesai",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

const BANNER: Record<
  OrderDisplayStep,
  { bg: string; text: string; message: string }
> = {
  waiting_payment: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    message:
      "Pesanan sudah dibuat dan menunggu pembayaran sebelum mulai diproses.",
  },
  packing: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    message: "Pesanan kamu sedang dikemas dengan teliti. Mohon menunggu ya!",
  },
  send: {
    bg: "bg-blue-50",
    text: "text-blue-800",
    message:
      "Pesanan sedang dalam perjalanan menuju alamatmu. Harap siapkan diri untuk menerima.",
  },
  success: {
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    message:
      "Pesanan sudah diterima! Terima kasih telah memesan dari KSM Katering.",
  },
};

// Icon X untuk garis putus
function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-red-500"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

interface OrderStepperProps {
  currentStep: OrderDisplayStep;
  isExpired?: boolean;
}

export function OrderStepper({
  currentStep,
  isExpired = false,
}: OrderStepperProps) {
  const currentIndex = Math.max(
    STEPS.findIndex((step) => step.key === currentStep),
    0,
  );

  const banner = isExpired
    ? {
        bg: "bg-red-50",
        text: "text-red-800",
        message:
          "Pembayaran untuk pesanan ini sudah kedaluwarsa. Pesanan tidak dapat diproses lebih lanjut.",
      }
    : BANNER[currentStep];

  return (
    <div className="space-y-4">
      <div className="relative grid grid-cols-4 items-start">
        {/* Garis abu-abu penuh (background) */}
        <div
          className="absolute top-[18px] h-0.5 bg-gray-200"
          style={{ left: "12.5%", right: "12.5%" }}
          aria-hidden="true"
        />

        {/* Garis hijau progres — tidak tampil saat expired */}
        {!isExpired && (
          <div
            className="absolute top-[18px] h-0.5 bg-emerald-500 transition-all duration-500"
            style={{ left: "12.5%", width: `${currentIndex * 25}%` }}
            aria-hidden="true"
          />
        )}

        {/* Garis putus-putus merah antara step 0 → 1 saat expired */}
        {isExpired && (
          <div
            className="absolute top-[14px] flex items-center justify-center"
            style={{ left: "12.5%", width: "25%" }}
            aria-hidden="true"
          >
            {/* Garis kiri */}
            <div className="h-0.5 flex-1 border-t-2 border-dashed border-red-400" />
            {/* Icon X di tengah */}
            <div className="mx-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-red-300">
              <XIcon />
            </div>
            {/* Garis kanan */}
            <div className="h-0.5 flex-1 border-t-2 border-dashed border-red-400" />
          </div>
        )}

        {STEPS.map((step, index) => {
          const isDone = index <= currentIndex;
          const isActive = index === currentIndex;

          // Saat expired: hanya step pertama (waiting_payment) yang aktif/berwarna
          const isExpiredActive = isExpired && index === 0;
          const isExpiredInactive = isExpired && index > 0;

          // Label khusus untuk step waiting_payment saat expired
          const label =
            isExpired && step.key === "waiting_payment"
              ? "Pembayaran Kedaluwarsa"
              : step.label;

          return (
            <div
              key={step.key}
              className="relative z-10 flex min-w-0 flex-col items-center gap-2 px-1"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                  isExpiredInactive
                    ? "bg-gray-100 text-gray-400"
                    : isExpiredActive
                      ? "bg-red-500 text-white ring-4 ring-red-100"
                      : isDone
                        ? isActive
                          ? "bg-emerald-500 text-white ring-4 ring-emerald-100"
                          : "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-400"
                }`}
              >
                {step.icon}
              </div>

              <div className="flex min-w-0 flex-col items-center text-center">
                <span
                  className={`max-w-[5.5rem] text-xs font-semibold leading-tight ${
                    isExpiredInactive
                      ? "text-gray-400"
                      : isExpiredActive
                        ? "text-red-700"
                        : isDone
                          ? "text-emerald-700"
                          : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
                <span className="mt-0.5 max-w-[5.5rem] text-[10px] leading-tight text-secondary-500">
                  {step.sublabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`rounded-xl px-4 py-3 text-sm ${banner.bg} ${banner.text}`}
      >
        {banner.message}
      </div>
    </div>
  );
}

import type { OrderStep } from "@/types/orders";

const STEPS: {
  key: OrderStep;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}[] = [
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
        <line x1="12" y1="22" x2="12" y2="12" />
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

const BANNER: Record<OrderStep, { bg: string; text: string; message: string }> =
  {
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
        "Pesanan sudah diterima! Terima kasih telah memesan dari KSM Katering 🎉",
    },
  };

interface OrderStepperProps {
  currentStep: OrderStep;
}

export function OrderStepper({ currentStep }: OrderStepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
  const banner = BANNER[currentStep];

  return (
    <div className="space-y-4">
      {/* Stepper */}
      <div className="relative flex items-start justify-between">
        {/* Background line (gray) */}
        <div
          className="absolute left-0 right-0 top-[18px] h-0.5 bg-gray-200"
          style={{ left: "calc(16.6%)", right: "calc(16.6%)" }}
          aria-hidden="true"
        />

        {/* Progress line (green) */}
        <div
          className="absolute top-[18px] h-0.5 bg-emerald-500 transition-all duration-500"
          style={{
            left: "calc(16.6%)",
            width:
              currentIndex === 0
                ? "0%"
                : currentIndex === 1
                  ? "calc(50% - 0px)"
                  : "calc(66.8%)",
          }}
          aria-hidden="true"
        />

        {STEPS.map((step, index) => {
          const isDone = index <= currentIndex;
          const isActive = index === currentIndex;

          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-1 flex-col items-center gap-2"
            >
              {/* Circle */}
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
                  isDone
                    ? isActive
                      ? "bg-emerald-500 ring-4 ring-emerald-100 text-white"
                      : "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {step.icon}
              </div>

              {/* Labels */}
              <div className="flex flex-col items-center text-center">
                <span
                  className={`text-xs font-semibold ${
                    isDone ? "text-emerald-700" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
                <span className="mt-0.5 text-[10px] leading-tight text-secondary-500">
                  {step.sublabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Banner info */}
      <div
        className={`rounded-xl px-4 py-3 text-sm ${banner.bg} ${banner.text}`}
      >
        {banner.message}
      </div>
    </div>
  );
}
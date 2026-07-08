import { toast } from "sonner";

type Opts = Record<string, unknown> | undefined;

export function toastSuccess(message: string, opts?: Opts) {
  const className = [
    // prefer a sensible max width and let content wrap
    "max-w-sm",
    "w-auto",
    // keep existing user className if provided
    typeof opts?.["className"] === "string" ? (opts as any).className : "",
  ]
    .filter(Boolean)
    .join(" ");

  // pass through other options while ensuring className is set
  toast.success(message, { ...(opts || {}), className });
}

export function toastError(message: string, opts?: Opts) {
  const className = ["max-w-sm", "w-auto", typeof opts?.["className"] === "string" ? (opts as any).className : ""].filter(Boolean).join(" ");
  toast.error(message, { ...(opts || {}), className });
}

export default toast;

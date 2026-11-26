import { goneResponse } from "@/lib/gone";

export const runtime = "edge";

export const dynamic = "force-static";

export function GET() {
  return goneResponse();
}

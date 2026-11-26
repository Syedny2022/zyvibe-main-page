import { NextResponse } from "next/server";

/**
 * Retired route families return 410 rather than redirecting dead or unrelated
 * URLs to the homepage. Search engines can then drop them without treating the
 * homepage as a replacement.
 */
export function goneResponse(): NextResponse {
  return new NextResponse(
    "410 Gone. This path was retired. Browse https://zyvibe.com/use-cases for current records.\n",
    {
      status: 410,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-robots-tag": "noindex",
        "cache-control": "public, max-age=86400",
      },
    }
  );
}

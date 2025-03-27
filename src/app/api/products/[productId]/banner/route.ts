import { Banner } from "@/components/Banner";
import { env } from "@/data/env/server";
import { getProductForBanner } from "@/server/db/products";
import { createProductView } from "@/server/db/productViews";
import { canRemoveBranding, canShowDiscountBanner } from "@/server/permissions";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createElement } from "react";

export const runtime = "nodejs";

// export async function GET(
//   request: NextRequest,
//   context: { params?: { productId?: string } } // ✅ Optional params
// ) {
//   const productId = context.params?.productId;

//   if (!productId) {
//     return NextResponse.json({ error: "Product ID not found" }, { status: 404 });
//   }

//   // ✅ Remove `await` because `headers()` is synchronous
//   const headersMap = await headers();
//   const requestingUrl = headersMap.get("referer") || headersMap.get("origin");

//   if (!requestingUrl) return notFound();

//   const countryCode = getCountryCode(request);
//   if (!countryCode) return notFound();

//   const { product, discount, country } = await getProductForBanner({
//     id: productId,
//     countryCode,
//     url: requestingUrl,
//   });

//   if (!product) return notFound();

//   const canShowBanner = await canShowDiscountBanner(product.clerkUserId);

//   await createProductView({
//     productId: product.id,
//     countryId: country?.id,
//     userId: product.clerkUserId,
//   });

//   if (!canShowBanner || !country || !discount) return notFound();

//   return new Response(
//     await getJavaScript(
//       product,
//       country,
//       discount,
//       await canRemoveBranding(product.clerkUserId)
//     ),
//     { headers: { "content-type": "text/javascript" } }
//   );
// }


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> } // ✅ Await needed
) {
  const { productId } = await context.params; // ✅ Await params before using

  if (!productId) {
    return NextResponse.json({ error: "Product ID not found" }, { status: 404 });
  }

  
  const headersMap = await headers();
  const requestingUrl = headersMap.get("referer") || headersMap.get("origin");

  if (!requestingUrl) {
    return NextResponse.json({ error: "Requesting URL not found" }, { status: 404 });
  }

  const countryCode = getCountryCode(request);
  if (!countryCode) {
    return NextResponse.json({ error: "Country code not found" }, { status: 404 });
  }

  try {
    const { product, discount, country } = await getProductForBanner({
      id: productId,
      countryCode,
      url: requestingUrl,
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const canShowBanner = await canShowDiscountBanner(product.clerkUserId);

    await createProductView({
      productId: product.id,
      countryId: country?.id,
      userId: product.clerkUserId,
    });

    if (!canShowBanner || !country || !discount) {
      return NextResponse.json({ error: "Banner cannot be shown" }, { status: 404 });
    }

    const responseJS = await getJavaScript(
      product,
      country,
      discount,
      await canRemoveBranding(product.clerkUserId)
    );

    return new Response(responseJS, { headers: { "content-type": "text/javascript" } });
  } catch (error) {
    console.error("Error fetching product banner:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}




function getCountryCode(request: NextRequest): string {
  const customRequest = request as NextRequest & { geo?: { country?: string } };

  if (customRequest.geo?.country) return customRequest.geo.country;
  if (process.env.NODE_ENV === "development") return env.TEST_COUNTRY_CODE;

  return "US"; // Default country code
}

async function getJavaScript(
  product: {
    customization: {
      locationMessage: string;
      bannerContainer: string;
      backgroundColor: string;
      textColor: string;
      fontSize: string;
      isSticky: boolean;
      classPrefix?: string | null;
    };
  },
  country: { name: string },
  discount: { coupon: string; percentage: number },
  canRemoveBranding: boolean
) {
  const { renderToStaticMarkup } = await import("react-dom/server");

  return `
    const banner = document.createElement("div");
    banner.innerHTML = '${renderToStaticMarkup(
      createElement(Banner, {
        message: product.customization.locationMessage,
        mappings: {
          country: country.name,
          coupon: discount.coupon,
          discount: (discount.percentage * 100).toString(),
        },
        customization: product.customization,
        canRemoveBranding,
      })
    )}';
    document.querySelector("${
      product.customization.bannerContainer
    }").prepend(...banner.children);
  `.replace(/(\r\n|\n|\r)/g, "");
}

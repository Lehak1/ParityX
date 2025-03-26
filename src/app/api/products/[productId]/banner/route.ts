import { Banner } from "@/components/Banner"
import { env } from "@/data/env/server"
import { getProductForBanner } from "@/server/db/products"
import { createProductView } from "@/server/db/productViews"
import { canRemoveBranding, canShowDiscountBanner } from "@/server/permissions"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import { createElement } from "react"

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: { params: { productId: string } }
) {
  const { productId } = context.params;

  if (!productId) return NextResponse.json({ error: "Product ID not found" }, { status: 404 });
  const headersMap = await headers()
  const requestingUrl = headersMap.get("referer") || headersMap.get("origin")
  if (requestingUrl == null) return notFound()
   
  const countryCode = getCountryCode(request)
  if (countryCode == null) return notFound()
   
  const { product, discount, country } = await getProductForBanner({
    id: productId,
    countryCode,
    url: requestingUrl,
  })

  if (product == null) return notFound()
   
  const canShowBanner = await canShowDiscountBanner(product.clerkUserId)

  await createProductView({
    productId: product.id,
    countryId: country?.id,
    userId: product.clerkUserId,
  })

  if (!canShowBanner) return notFound()
   
  if (country == null || discount == null) return notFound()

  return new Response(
    await getJavaScript(
      product,
      country,
      discount,
      await canRemoveBranding(product.clerkUserId)
    ),
    { headers: { "content-type": "text/javascript" } }
  )
}

function getCountryCode(request: NextRequest): string {
  const customRequest = request as NextRequest & { geo?: { country?: string } };
  
  if (customRequest.geo?.country) return customRequest.geo.country;

  if (process.env.NODE_ENV === "development") return env.TEST_COUNTRY_CODE;

  // Set a default country code if none is found
  return "US"; // You can change "US" to any default country code you prefer
}


async function getJavaScript(
  product: {
    customization: {
      locationMessage: string
      bannerContainer: string
      backgroundColor: string
      textColor: string
      fontSize: string
      isSticky: boolean
      classPrefix?: string | null
    }
  },
  country: { name: string },
  discount: { coupon: string; percentage: number },
  canRemoveBranding: boolean
) {
  const { renderToStaticMarkup } = await import("react-dom/server")
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
  `.replace(/(\r\n|\n|\r)/g, "")
}


 "use server"

import { PaidTierNames, subscriptionTiers } from "@/data/subscriptionTiers"
import { auth, currentUser, User } from "@clerk/nextjs/server"
import { getUserSubscription } from "../db/subscription"
import { Stripe } from "stripe"
import { env as serverEnv } from "@/data/env/server"
import { env as clientEnv } from "@/data/env/client"
import { redirect } from "next/navigation"

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY)

// export async function createCancelSession() {
//   const user = await currentUser()
//   if (user == null) return { error: true }

//   const subscription = await getUserSubscription(user.id)

//   if (subscription == null) return { error: true }

//   if (
//     subscription.stripeCustomerId == null ||
//     subscription.stripeSubscriptionId == null
//   ) {
//     return new Response(null, { status: 500 })
//   }

//   const portalSession = await stripe.billingPortal.sessions.create({
//     customer: subscription.stripeCustomerId,
//     return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
//     flow_data: {
//       type: "subscription_cancel",
//       subscription_cancel: {
//         subscription: subscription.stripeSubscriptionId,
//       },
//     },
//   })
//     console.log(portalSession.url)
//   redirect(portalSession.url)
// }

export async function createCancelSession() {
  console.log("🔹 createCancelSession() has been called");
  const user = await currentUser();
  if (user == null) return { error: true };

  const subscription = await getUserSubscription(user.id);
  if (subscription == null) return { error: true };

  if (
    subscription.stripeCustomerId == null ||
    subscription.stripeSubscriptionId == null
  ) {
    console.error("Missing Stripe Customer ID or Subscription ID");
    return new Response(null, { status: 500 });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    flow_data: {
      type: "subscription_cancel",
      subscription_cancel: {
        subscription: subscription.stripeSubscriptionId,
      },
    },
  });

  console.log("Cancel session URL:", portalSession.url); // ✅ Log the URL
  redirect(portalSession.url);
}



export async function createCustomerPortalSession() {
  console.log("🔹 customerprotal() has been called");
  const { userId } =await auth()

  if (userId == null) return { error: true }

  const subscription = await getUserSubscription(userId)

  if (subscription?.stripeCustomerId == null) {
    return { error: true }
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
  })

  redirect(portalSession.url)
}

// export async function createCheckoutSession(tier: PaidTierNames) {
//   const user = await currentUser()
//   if (user == null) return { error: true }

//   const subscription = await getUserSubscription(user.id)

//   if (subscription == null) return { error: true }

//   if (subscription.stripeCustomerId == null) {
//     const url = await getCheckoutSession(tier, user)
//     if (url == null) return { error: true }
//     console.log(url)
//     redirect(url)
//   } else {
//     const url = await getSubscriptionUpgradeSession(tier, subscription)
//     console.log(url)
//     redirect(url)
//   }
// }

export async function createCheckoutSession(tier: PaidTierNames) {
  console.log("🔹 createCheckoutSession() has been called");
  const user = await currentUser();
  console.log("hi")
  if (user == null) return { error: true };
  console.log("User ID:", user.id);
  const subscription = await getUserSubscription(user.id);
  console.log(subscription)
  if (subscription == null) return { error: true };

  if (subscription.stripeCustomerId == null) {
    const url = await getCheckoutSession(tier, user);
    if (url == null) {
      console.error("Checkout session URL is null");
      return { error: true };
    }
    console.log("Checkout session URL:", url); // ✅ Log the URL
    redirect(url);
  } else {
    const url = await getSubscriptionUpgradeSession(tier, subscription);
    console.log("Subscription upgrade URL:", url); // ✅ Log the URL
    redirect(url);
  }
}


async function getCheckoutSession(tier: PaidTierNames, user: User) {
  console.log("🔹 getCheckoutSession() has been called");
  const session = await stripe.checkout.sessions.create({
    customer_email: user.primaryEmailAddress?.emailAddress,
    subscription_data: {
      metadata: {
        clerkUserId: user.id,
      },
    },
    line_items: [
      {
        price: subscriptionTiers[tier].stripePriceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    cancel_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
  })

  return session.url
}

async function getSubscriptionUpgradeSession(
  tier: PaidTierNames,
  subscription: {
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    stripeSubscriptionItemId: string | null
  }
) {
  if (
    subscription.stripeCustomerId == null ||
    subscription.stripeSubscriptionId == null ||
    subscription.stripeSubscriptionItemId == null
  ) {
    throw new Error()
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscription`,
    flow_data: {
      type: "subscription_update_confirm",
      subscription_update_confirm: {
        subscription: subscription.stripeSubscriptionId,
        items: [
          {
            id: subscription.stripeSubscriptionItemId,
            price: subscriptionTiers[tier].stripePriceId,
            quantity: 1,
          },
        ],
      },
    },
  })

  return portalSession.url
}
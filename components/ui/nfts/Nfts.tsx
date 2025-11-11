import { Check } from "lucide-react";
import React from "react";
import PageInfo from "../shared/PageInfo";

const Nfts = () => {
  const pricing = {
    tiers: [
      {
        id: "freelancer",
        name: "QUARTZ ACTIVATOR GEM",
        price: "$299",
        description:
          "Quartz is the first and most affordable Activator Gem. It's perfect for beginners and those looking to get started with ACTXION.",
        features: [
          "5 products",
          "Up to 1,000 subscribers",
          "Basic analytics",
          "48-hour support response time",
        ],
        featured: false,
      },
      {
        id: "startup",
        name: "EMERALD ACTIVATOR GEM",
        price: "$499",
        description:
          "Emerald is the second Activator Gem. It's perfect for those looking to scale their business and reach a larger audience.",
        features: [
          "25 products",
          "Up to 10,000 subscribers",
          "Advanced analytics",
          "24-hour support response time",
          "Marketing automations",
        ],
        featured: true,
      },
      {
        id: "enterprise",
        name: "RUBY ACTIVATOR GEM",
        price: "$999",
        description:
          "Ruby is the third and most powerful Activator Gem. It's perfect for those looking to scale their business and reach a larger audience.",
        features: [
          "Unlimited products",
          "Unlimited subscribers",
          "Advanced analytics",
          "1-hour, dedicated support response time",
          "Marketing automations",
          "Custom reporting tools",
        ],
        featured: false,
      },
    ],
  };

  return (
    <>
      <div className="pt-3">
        <div className="mx-auto max-w-7xl px-2 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <PageInfo title="Pricing" />
            <p className="mt-2 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">
              ACTXION NFT: Your Ad Access Pass
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-600 sm:text-xl/8">
            Launch verifiable Web3 campaigns by holding an ACTXION Genesis NFT.
            Your pass ensures premium access, priority validation, and
            commitment to real-world activity tracking. Mint it. Use it. Start
            driving action.
          </p>
          <div className="mt-16 flex justify-center">
            <div className="rounded-full bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white">
              Lifetime Access
            </div>
          </div>
          <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {pricing.tiers.map((tier) => (
              <div
                key={tier.id}
                data-featured={tier.featured ? "true" : undefined}
                className="group/tier rounded-3xl p-8 ring-1 ring-gray-200 data-featured:ring-2 data-featured:ring-indigo-600 xl:p-10"
              >
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={`tier-${tier.id}`}
                    className="text-lg/8 font-semibold text-gray-900 group-data-featured/tier:text-indigo-600"
                  >
                    {tier.name}
                  </h3>
                  <p className="rounded-full bg-indigo-600/10 px-4 py-1 text-xs/5 font-semibold text-indigo-600 group-not-data-featured/tier:hidden whitespace-nowrap">
                    Most popular
                  </p>
                </div>
                <p className="mt-4 text-sm/6 text-gray-600">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-semibold tracking-tight text-gray-900">
                    {tier.price}
                  </span>
                  <span className="text-sm/6 font-semibold text-gray-600">
                    /lifetime
                  </span>
                </p>

                <a
                  href="#"
                  aria-describedby={tier.id}
                  className="mt-6 block w-full rounded-md px-3 py-2 text-center text-sm/6 font-semibold text-indigo-600 inset-ring-1 inset-ring-indigo-200 group-data-featured/tier:bg-indigo-600 group-data-featured/tier:text-white group-data-featured/tier:shadow-xs group-data-featured/tier:inset-ring-0 hover:inset-ring-indigo-300 group-data-featured/tier:hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Buy plan
                </a>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm/6 text-gray-600 xl:mt-10"
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check
                        aria-hidden="true"
                        className="h-6 w-5 flex-none text-indigo-600"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Nfts;

import { lemonSqueezyApiInstance } from "@/utils/axios";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
  
    const reqData = await req.json();

    // Validate the parsed JSON
    if (!reqData.productId) {
      return new Response(JSON.stringify({ message: "productId is required" }), { status: 400 });
    }

    // Proceed with API call
    const response = await lemonSqueezyApiInstance.post("/checkouts", {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: {
              user_id: "123",
            },
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env.LEMON_SQUEEZY_STORE_ID.toString(),
            },
          },
          variant: {
            data: {
              type: "variants",
              id: reqData.productId.toString(),
            },
          },
        },
      },
    });

    const checkoutUrl = response.data.data.attributes.url;

    return new Response(JSON.stringify({ checkoutUrl }));
  } catch (error) {
    // console.error("Error occurred:", error);

    if (error instanceof SyntaxError) {
      return new Response(JSON.stringify({ message: "Invalid JSON format" }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "An error occurred" }), { status: 500 });
  }
}

// export async function GET(req) {
//   try {
//     const response = await lemonSqueezyApiInstance.get(`/products`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching product details:", error);
//     throw error;
//   }
// }
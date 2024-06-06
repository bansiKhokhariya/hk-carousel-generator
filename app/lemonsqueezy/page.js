"use client";

import axios from "axios";
import Link from "next/link";

export default function Home() {
  const buyProduct = async (productId) => {
    try {
      const response = await axios.post("/api/purchaseProduct", {
        productId,
      });
      if (response.data.checkoutUrl) {
        window.open(response.data.checkoutUrl, "_blank");
      } else {
        alert("Failed to get checkout URL");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to buy product");
    }
  };

  return (
    <main className="pt-5 pl-5">
      <Link
        href="/"
        className="link !no-underline text-base-content/80 hover:text-base-content inline-flex items-center gap-1 mb-5"
        title="Back to Blog"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
            clipRule="evenodd"
          />
        </svg>
        Back to Home
      </Link>
      <br />
      <button type="button" onClick={() => buyProduct("389646")} className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">
        Buy product single payment
      </button>
      <button type="button" onClick={() => buyProduct("389647")} className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
        Buy product lead magnet
      </button>
    </main>
  );
}

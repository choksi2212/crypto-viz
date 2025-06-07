// app/page.tsx

import CryptoViz from "./crypto-viz-client"

export const metadata = {
  title: "Crypto-Viz",
  description: "Interactive Cryptography Visualization Tool",
}

export default function HomePage() {
  return <CryptoViz />
}

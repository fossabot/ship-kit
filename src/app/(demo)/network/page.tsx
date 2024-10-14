import { NetworkRequestLogger } from "@/app/(demo)/network/network-request-logger"

export default function Page() {
  
  return (
    <div className="min-h-screen bg-indigo-900 flex items-center justify-center p-4">
      <NetworkRequestLogger />
    </div>
  )
}
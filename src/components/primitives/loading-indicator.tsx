
import { Loader } from "lucide-react";

export const LoadingIndicator = () => {
  return (
    <div className="grow flex min-h-20 h-full w-full items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  )
}

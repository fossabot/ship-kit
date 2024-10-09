import { useEffect } from "react"

export default function Log() {
    console.log('before')
    useEffect(() => {
        console.log('after')
    }, [])
  return <div>Next.JS Pages Route - LogFlare Demo</div>
}
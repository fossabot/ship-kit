import logo from "@/public/logo.svg";
import Image from "next/image";

export const Logo = () => {
  return <Image src={logo} alt="logo" width={100} height={100} />;
};

"use client";
import { useRouter } from "next/navigation";

export default function KSA() {
  const router = useRouter();
  router.push("/ksa/login");
}

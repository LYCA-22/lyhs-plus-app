// lyhs-plus-app/app/school/login/openId/page.tsx
import { Suspense } from "react";
import { LoginForm } from "./form";

export default function Page() {
  return (
    <Suspense fallback={<div></div>}>
      <LoginForm />
    </Suspense>
  );
}

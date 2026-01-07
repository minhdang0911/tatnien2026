import { Suspense } from "react";
import CheckinClient from "./CheckinClient";

export default function CheckinPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Đang tải...</div>}>
      <CheckinClient />
    </Suspense>
  );
}

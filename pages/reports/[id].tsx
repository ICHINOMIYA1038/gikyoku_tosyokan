import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ReportDetail() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      router.replace(`/announcements/${id}`);
    }
  }, [id, router]);

  return null;
}

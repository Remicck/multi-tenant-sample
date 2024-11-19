import { List } from "@/app/page";
import { Suspense } from "react";
import { Dialog } from "../_components/Dialog";

export default function Page() {
  return (
    <Dialog>
      <Suspense fallback={<p>loading ...</p>}>
        <List />
      </Suspense>
    </Dialog>
  );
}

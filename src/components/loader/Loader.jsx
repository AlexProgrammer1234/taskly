import { Spinner } from "@radix-ui/themes";
import "./Loader.css";

export default function Loader() {
  return (
    <div className="loader">
      <Spinner size="3" />
    </div>
  );
}

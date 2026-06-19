import localAdapter from "./localAdapter";
import r2Adapter from "./r2Adapter";

type Adapter = typeof localAdapter | typeof r2Adapter;

// Pick adapter based on env
const mode = process.env.STORAGE_MODE || "local";

let adapter: Adapter = localAdapter;

if (mode === "local") {
  adapter = localAdapter;
} else if (mode === "r2") {
  adapter = r2Adapter as unknown as Adapter;
} else {
  adapter = localAdapter;
}

export default adapter;

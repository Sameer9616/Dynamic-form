interface Field {
  name: string;
  type: "string" | "number" | "date" | "boolean" | "select";
  options?: string[];
  required?: boolean;
  default?: string;
}

interface SubView {
  name: string;
  type: "form" | "table";
  tablename?: string;
  fields?: Field[];
}

interface View {
  name: string;
  subViews: SubView[];
}

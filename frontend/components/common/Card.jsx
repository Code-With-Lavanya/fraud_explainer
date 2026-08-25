import { C } from "@/lib/constants";

export default function Card({ children, style, ...rest }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, ...style }} {...rest}>
      {children}
    </div>
  );
}

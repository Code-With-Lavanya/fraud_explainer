import { C, FONT_MONO } from "@/lib/constants";

export default function DistributionBar({ low, med, high }) {
  const total = low + med + high || 1;
  const seg = (v, c) => <div style={{ width: `${(v / total) * 100}%`, background: c, height: "100%" }} />;
  return (
    <div>
      <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", background: "#161E29" }}>
        {seg(low, C.low)}
        {seg(med, C.med)}
        {seg(high, C.high)}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 10, fontFamily: FONT_MONO, fontSize: 11 }}>
        <span style={{ color: C.low }}>● LOW {low}</span>
        <span style={{ color: C.med }}>● MED {med}</span>
        <span style={{ color: C.high }}>● HIGH {high}</span>
      </div>
    </div>
  );
}

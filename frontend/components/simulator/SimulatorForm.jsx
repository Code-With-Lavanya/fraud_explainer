import { Hash } from "lucide-react";
import { C, FONT_BODY, FONT_MONO } from "@/lib/constants";
import { DEVICES, LOCATIONS } from "@/lib/mockData";
import Card from "@/components/common/Card";
import SectionLabel from "@/components/common/SectionLabel";

const TEXT_FIELDS = [
  ["sender", "Sender"],
  ["recipient", "Recipient"],
  ["amount", "Amount (₹)"],
];

const inputStyle = {
  width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6,
  padding: "8px 10px", color: C.text, fontFamily: FONT_BODY, fontSize: 13, boxSizing: "border-box",
};

const selectStyle = {
  width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6,
  padding: "8px 10px", color: C.text, fontFamily: FONT_BODY, fontSize: 12.5,
};

const labelStyle = { display: "block", fontFamily: FONT_MONO, fontSize: 10.5, color: C.textFaint, marginBottom: 5 };

export default function SimulatorForm({ form, onChange }) {
  return (
    <Card style={{ padding: 18 }}>
      <SectionLabel icon={Hash}>Transaction Event</SectionLabel>

      {TEXT_FIELDS.map(([k, label]) => (
        <div key={k} style={{ marginBottom: 12 }}>
          <label style={labelStyle}>{label.toUpperCase()}</label>
          <input
            value={form[k]}
            onChange={(e) => onChange(k, e.target.value)}
            type={k === "amount" ? "number" : "text"}
            style={inputStyle}
          />
        </div>
      ))}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <label style={labelStyle}>DEVICE</label>
          <select value={form.device} onChange={(e) => onChange("device", e.target.value)} style={selectStyle}>
            {DEVICES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>LOCATION</label>
          <select value={form.location} onChange={(e) => onChange("location", e.target.value)} style={selectStyle}>
            {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>
    </Card>
  );
}

import {
  X, Hash, User, Clock, Smartphone, MapPin, Wifi,
  Gauge, AlertTriangle, Brain, Zap, BarChart3, Settings,
} from "lucide-react";
import { C, FONT_HEAD, FONT_BODY, FONT_MONO } from "@/lib/constants";
import Card from "@/components/common/Card";
import SectionLabel from "@/components/common/SectionLabel";
import RiskPill from "@/components/common/RiskPill";
import ActionPill from "@/components/common/ActionPill";
import ProbBar from "@/components/common/ProbBar";
import SignalBars from "./SignalBars";

export default function TransactionDrawer({ txn, onClose, showShap }) {
  if (!txn) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "#000A0F99" }} />
      <div
        className="txn-drawer-panel"
        style={{
          position: "relative", width: 460, maxWidth: "92vw", height: "100%", background: C.bgGrid,
          borderLeft: `1px solid ${C.border}`, overflowY: "auto", padding: "22px 22px 60px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: C.textFaint, letterSpacing: 1 }}>TRANSACTION ANALYSIS</div>
            <div style={{ fontFamily: FONT_HEAD, fontSize: 18, fontWeight: 700, color: C.text, marginTop: 2 }}>{txn.id}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <SectionLabel icon={Hash}>Transaction Details</SectionLabel>
        <Card style={{ padding: 14, marginBottom: 18 }}>
          {[
            [User, "Sender", txn.sender],
            [User, "Recipient", txn.recipient],
            [Hash, "Amount", `₹${txn.amount.toLocaleString("en-IN")}`],
            [Clock, "Timestamp", txn.timestamp.toLocaleString("en-IN")],
            [Smartphone, "Device", txn.device],
            [MapPin, "Location", txn.location],
            /* The real backend returns risk signals as sentences, not a
               keyed enum, so "elevated" is derived from the actual
               returned wording rather than a synthetic key the backend
               never provides. */
            [Wifi, "Network / IP Risk", txn.signals.up.some((s) => /ip|network/i.test(s.label)) ? "Elevated" : "Normal"],
          ].map(([Icon, k, v], i) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < 6 ? `1px solid ${C.borderSoft}` : "none" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: FONT_BODY, fontSize: 12.5, color: C.textDim }}>
                <Icon size={13} />
                {k}
              </span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 12.5, color: C.text }}>{v}</span>
            </div>
          ))}
        </Card>

        <SectionLabel icon={Gauge}>Fraud Assessment</SectionLabel>
        <Card style={{ padding: 16, marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textFaint, letterSpacing: 1 }}>FRAUD PROBABILITY</div>
              <div style={{ fontFamily: FONT_HEAD, fontSize: 30, fontWeight: 700, color: C.text }}>{(txn.fraudProbability * 100).toFixed(2)}%</div>
            </div>
            <RiskPill level={txn.riskLevel} size="lg" />
          </div>
          <div style={{ margin: "12px 0" }}>
            <ProbBar value={txn.fraudProbability} level={txn.riskLevel} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.textDim }}>Recommended Action</span>
            <ActionPill action={txn.action} />
          </div>
        </Card>

        <SectionLabel icon={AlertTriangle}>Why Was This Transaction Flagged?</SectionLabel>
        <Card style={{ padding: 16, marginBottom: 18 }}>
          {txn.signals.up.length > 0 && (
            <div style={{ marginBottom: txn.signals.down.length ? 16 : 0 }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: C.high, letterSpacing: 0.6, marginBottom: 8 }}>RISK INCREASING SIGNALS</div>
              {txn.signals.up.map((s) => (
                <div key={s.key} style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.text, padding: "4px 0", display: "flex", gap: 7 }}>
                  <span style={{ color: C.high }}>•</span>
                  {s.label}
                </div>
              ))}
            </div>
          )}
          {txn.signals.down.length > 0 && (
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: C.low, letterSpacing: 0.6, marginBottom: 8 }}>RISK REDUCING SIGNALS</div>
              {txn.signals.down.map((s) => (
                <div key={s.key} style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.text, padding: "4px 0", display: "flex", gap: 7 }}>
                  <span style={{ color: C.low }}>•</span>
                  {s.label}
                </div>
              ))}
            </div>
          )}
        </Card>

        <SectionLabel icon={Brain}>AI Transaction Analysis</SectionLabel>
        <Card style={{ padding: 16, marginBottom: 18, borderColor: C.accent + "44", background: "linear-gradient(180deg, #0E1B20, #10151E)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
            <Zap size={13} color={C.accent} />
            <span style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: C.accent, letterSpacing: 0.6 }}>GEMINI EXPLANATION LAYER</span>
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.text, lineHeight: 1.55, marginBottom: 10 }}>
            <strong style={{ color: C.textDim, fontWeight: 600 }}>Summary: </strong>
            {txn.aiSummary.summary}
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.textDim, lineHeight: 1.55, marginBottom: 10 }}>
            <strong style={{ color: C.textDim, fontWeight: 600 }}>Why flagged:</strong>
            <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
              {txn.aiSummary.reasons.map((r, i) => (
                <li key={i} style={{ marginBottom: 2 }}>{r}</li>
              ))}
            </ul>
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.text, lineHeight: 1.55, marginBottom: 10 }}>
            <strong style={{ color: C.textDim, fontWeight: 600 }}>Recommended action: </strong>
            {txn.aiSummary.action}
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.textFaint, lineHeight: 1.5, fontStyle: "italic", borderTop: `1px solid ${C.borderSoft}`, paddingTop: 9 }}>
            Analyst note: {txn.aiSummary.analystNote}
          </div>
        </Card>

        <SectionLabel icon={BarChart3}>Risk Signal Visualization</SectionLabel>
        <Card style={{ padding: 16, marginBottom: 18 }}>
          {txn.signals.up.length > 0 && (
            <>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.high, marginBottom: 8, letterSpacing: 0.6 }}>RISK INCREASING</div>
              <SignalBars signals={txn.signals.up} dir="up" />
            </>
          )}
          {txn.signals.down.length > 0 && (
            <>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.low, margin: "16px 0 8px", letterSpacing: 0.6 }}>RISK REDUCING</div>
              <SignalBars signals={txn.signals.down} dir="down" />
            </>
          )}
        </Card>

        {showShap && (
          <>
            <SectionLabel icon={Settings}>Technical / Analyst View — SHAP Values</SectionLabel>
            <Card style={{ padding: 16 }}>
              {txn.shap.map((s) => (
                <div key={s.feature} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontFamily: FONT_MONO, fontSize: 11.5, color: C.textDim }}>
                  <span>{s.feature}</span>
                  <span style={{ color: s.value >= 0 ? C.high : C.low }}>{s.value >= 0 ? "+" : ""}{s.value}</span>
                </div>
              ))}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

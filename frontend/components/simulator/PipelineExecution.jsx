import React from "react";
import { GitBranch, CheckCircle2, RefreshCw, XCircle, AlertTriangle } from "lucide-react";
import { C, FONT_BODY, FONT_MONO, PIPELINE_STAGES } from "@/lib/constants";
import Card from "@/components/common/Card";
import SectionLabel from "@/components/common/SectionLabel";

export default function PipelineExecution({ running, stageIdx, result, error }) {
  return (
    <Card style={{ padding: 18, ...(error ? { borderColor: `${C.high}55` } : {}) }}>
      <SectionLabel icon={GitBranch}>Pipeline Execution</SectionLabel>
      <div style={{ display: "flex", alignItems: "center", gap: 6, overflowX: "auto", paddingBottom: 6 }}>
        {PIPELINE_STAGES.map((s, i) => {
          const failed = !!error && i === stageIdx;
          const done = !error && (result ? true : i < stageIdx);
          const active = !result && !error && i === stageIdx;
          return (
            <React.Fragment key={s.key}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 92 }}>
                <div
                  style={{
                    width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1.5px solid ${failed ? C.high : done || active ? C.accent : C.border}`,
                    background: failed ? C.highDim : active ? C.accentDim : done ? "#0F2429" : "transparent",
                    boxShadow: active ? `0 0 0 4px ${C.accent}22` : failed ? `0 0 0 4px ${C.high}22` : "none",
                    transition: "all .2s",
                  }}
                >
                  {failed ? (
                    <XCircle size={16} color={C.high} />
                  ) : done ? (
                    <CheckCircle2 size={16} color={C.accent} />
                  ) : (
                    <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: active ? C.accent : C.textFaint }}>{i + 1}</span>
                  )}
                </div>
                <span style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: failed ? C.high : done || active ? C.text : C.textFaint, textAlign: "center" }}>
                  {s.label}
                </span>
              </div>
              {i < PIPELINE_STAGES.length - 1 && (
                <div style={{ flex: 1, height: 1.5, minWidth: 16, background: result || (!error && i < stageIdx) ? C.accent : C.border }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {running && !error && (
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.textFaint, marginTop: 12, display: "flex", alignItems: "center", gap: 7 }}>
          <RefreshCw size={12} className="spin" />
          Processing transaction event…
        </div>
      )}
      {error && (
        <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.high}55`, background: C.highDim, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <AlertTriangle size={13} color={C.high} />
            <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 600, color: C.high }}>Fraud Engine Unavailable</span>
          </div>
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.textDim, paddingLeft: 19 }}>{error}</span>
        </div>
      )}
    </Card>
  );
}

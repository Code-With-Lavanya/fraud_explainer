"use client";

import { C, FONT_HEAD, FONT_BODY } from "@/lib/constants";
import { useSimulator } from "@/hooks/useSimulator";
import SimulatorForm from "@/components/simulator/SimulatorForm";
import ScenarioPresets from "@/components/simulator/ScenarioPresets";
import PipelineExecution from "@/components/simulator/PipelineExecution";
import SimulationResult from "@/components/simulator/SimulationResult";

export default function SimulatorPage() {
  const { form, updateField, running, stageIdx, result, error, runSimulation } = useSimulator();

  return (
    <div>
      <h1 style={{ fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Live Transaction Simulator</h1>
      <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.textDim, margin: "0 0 18px", maxWidth: 640 }}>
        Simulate an incoming payment event. The backend derives behavioral features automatically —
        you only provide the transaction, not the model&apos;s engineered inputs.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
        <SimulatorForm form={form} onChange={updateField} />
        <ScenarioPresets running={running} onRun={runSimulation} />
      </div>

      <PipelineExecution running={running} stageIdx={stageIdx} result={result} error={error} />

      <SimulationResult result={result} />
    </div>
  );
}

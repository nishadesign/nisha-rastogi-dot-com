"use client";

import { useState } from "react";
import {
  MultiLanguageCard,
  DEFAULT_CONFIG,
  type MultiLanguageCardConfig,
} from "@/components/home/MultiLanguageCard";

type DialDef = {
  key: keyof MultiLanguageCardConfig;
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
};

const DIALS: DialDef[] = [
  {
    key: "arcCenterXRatio",
    label: "Arc center X",
    hint: "Where the arc's center sits horizontally. 0 = left edge, 1 = right edge, >1 = outside right.",
    min: 0.5,
    max: 1.5,
    step: 0.01,
  },
  {
    key: "arcCenterYRatio",
    label: "Arc center Y",
    hint: "Where the arc's center sits vertically. 0.5 = middle.",
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    key: "radiusMultiplier",
    label: "Radius (×min-side)",
    hint: "Distance from arc center to pills. Larger = flatter curve.",
    min: 0.3,
    max: 2,
    step: 0.05,
  },
  {
    key: "radiusMin",
    label: "Radius minimum (px)",
    hint: "Floor for the radius so it doesn't get too tight on small cards.",
    min: 100,
    max: 600,
    step: 10,
  },
  {
    key: "angularSpacing",
    label: "Angular spacing (rad)",
    hint: "Gap between adjacent pills along the arc.",
    min: 0.06,
    max: 0.5,
    step: 0.01,
  },
  {
    key: "fadeRangeRatio",
    label: "Fade range (×π)",
    hint: "Half-width of the visible band. Bigger = pills visible further from center.",
    min: 0.2,
    max: 1,
    step: 0.01,
  },
  {
    key: "fadeHold",
    label: "Fade hold",
    hint: "Fraction of the band that stays fully opaque before fading.",
    min: 0,
    max: 0.95,
    step: 0.01,
  },
  {
    key: "springStiffness",
    label: "Spring stiffness",
    hint: "Higher = snappier. Drives the post-input smoothing.",
    min: 30,
    max: 300,
    step: 5,
  },
  {
    key: "springDamping",
    label: "Spring damping",
    hint: "Higher = less bounce.",
    min: 5,
    max: 60,
    step: 1,
  },
  {
    key: "springMass",
    label: "Spring mass",
    hint: "Higher = heavier feel, more lag.",
    min: 0.1,
    max: 2,
    step: 0.05,
  },
  {
    key: "wheelSensitivity",
    label: "Wheel sensitivity",
    hint: "How much one wheel tick scrolls the arc.",
    min: 0.0005,
    max: 0.01,
    step: 0.0005,
  },
  {
    key: "dragSensitivity",
    label: "Drag sensitivity",
    hint: "How much one pixel of drag scrolls the arc.",
    min: 0.001,
    max: 0.02,
    step: 0.001,
  },
];

export default function MultiLanguageLabPage() {
  const [config, setConfig] = useState<MultiLanguageCardConfig>(DEFAULT_CONFIG);
  const [copied, setCopied] = useState(false);

  const update = <K extends keyof MultiLanguageCardConfig>(
    key: K,
    value: MultiLanguageCardConfig[K]
  ) => setConfig((prev) => ({ ...prev, [key]: value }));

  const reset = () => setConfig(DEFAULT_CONFIG);

  const copyConfig = async () => {
    const text = `export const DEFAULT_CONFIG: MultiLanguageCardConfig = ${JSON.stringify(
      config,
      null,
      2
    )};`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="min-h-screen p-6 tablet:p-10 bg-[var(--color-background)]">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 desktop:grid-cols-[1fr_360px] gap-8 items-start">
        <section>
          <h1 className="text-2xl mb-4">Multi-language card — dial kit</h1>
          <div
            className="w-full"
            style={{ aspectRatio: 1.2, maxWidth: 640 }}
          >
            <MultiLanguageCard config={config} />
          </div>
          <p
            className="mt-4 text-sm"
            style={{ color: "var(--color-muted)" }}
          >
            Scroll-wheel or click-and-drag vertically inside the card.
          </p>
        </section>

        <aside
          className="rounded-xl p-5 sticky top-6"
          style={{
            background: "var(--color-background-alt)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg">Parameters</h2>
            <div className="flex gap-2">
              <button
                onClick={reset}
                className="text-xs px-2 py-1 rounded-md border"
                style={{
                  borderColor: "var(--color-border-strong)",
                  color: "var(--color-content)",
                }}
              >
                Reset
              </button>
              <button
                onClick={copyConfig}
                className="text-xs px-2 py-1 rounded-md"
                style={{
                  background: "var(--color-content)",
                  color: "var(--color-background)",
                }}
              >
                {copied ? "Copied" : "Copy config"}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {DIALS.map((dial) => (
              <Dial
                key={dial.key}
                def={dial}
                value={config[dial.key]}
                onChange={(v) => update(dial.key, v)}
              />
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}

function Dial({
  def,
  value,
  onChange,
}: {
  def: DialDef;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: "var(--color-content)" }}>{def.label}</span>
        <span
          className="font-mono"
          style={{ color: "var(--color-muted)" }}
        >
          {value.toFixed(def.step < 0.01 ? 4 : def.step < 1 ? 3 : 0)}
        </span>
      </div>
      <input
        type="range"
        min={def.min}
        max={def.max}
        step={def.step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
      <span
        className="text-[11px] leading-tight"
        style={{ color: "var(--color-muted)" }}
      >
        {def.hint}
      </span>
    </label>
  );
}

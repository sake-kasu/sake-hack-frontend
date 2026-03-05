import LiquorOutlinedIcon from "@mui/icons-material/LiquorOutlined";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import SportsBarIcon from "@mui/icons-material/SportsBar";
import WineBarIcon from "@mui/icons-material/WineBar";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { FC } from "react";
import { useState } from "react";

type RandomBoozeSpinnerProps = {
  size?: number;
  color?: string;
};

type EffectType = "none" | "sparkles" | "pop" | "droplet" | "aroma";

type SpinnerVariant = {
  icon: FC<SvgIconProps>;
  defaultColor: string;
  animation: string;
  effect: EffectType;
};

const VARIANTS: ReadonlyArray<SpinnerVariant> = [
  {
    icon: SportsBarIcon,
    defaultColor: "#DAA520",
    animation: "booze-wobble 0.8s ease-in-out infinite",
    effect: "pop",
  },
  {
    icon: LocalBarIcon,
    defaultColor: "#8B5E83",
    animation: "booze-spin 1.2s linear infinite",
    effect: "sparkles",
  },
  {
    icon: LiquorOutlinedIcon,
    defaultColor: "#6B6B6B",
    animation: "booze-shake 0.4s ease-in-out infinite",
    effect: "droplet",
  },
  {
    icon: WineBarIcon,
    defaultColor: "#722F37",
    animation: "booze-pulse 1s ease-in-out infinite",
    effect: "aroma",
  },
];

const RandomBoozeSpinner: FC<RandomBoozeSpinnerProps> = ({
  size = 32,
  color,
}) => {
  const [variant] = useState(
    () => VARIANTS[Math.floor(Math.random() * VARIANTS.length)],
  );

  const IconComponent = variant.icon;
  const iconColor = color ?? variant.defaultColor;

  const pops = [
    { top: "10%", left: "20%", scale: 1, delay: "0s" },
    { top: "0%", right: "15%", scale: 0.7, delay: "0.3s" },
    { top: "20%", right: "5%", scale: 0.5, delay: "0.6s" },
    { top: "-5%", left: "45%", scale: 0.6, delay: "0.9s" },
  ];

  const aromas = [
    { top: "5%", left: "20%", delay: "0s", duration: 1.6, scale: 1 },
    { top: "10%", left: "55%", delay: "0.5s", duration: 1.4, scale: 0.8 },
    { top: "0%", left: "38%", delay: "1.0s", duration: 1.8, scale: 0.9 },
  ];

  const droplets = [
    { top: "15%", right: "5%", duration: 1.4, delay: "0s" },
    { top: "25%", right: "0%", duration: 1.6, delay: "0.5s" },
    { top: "10%", right: "12%", duration: 1.8, delay: "1.0s" },
  ];

  const sparkles = [
    { top: "-10%", right: "-10%", scale: 1, delay: "0s" },
    { top: "-6%", left: "-12%", scale: 0.7, delay: "0.4s" },
    { bottom: "-8%", right: "-14%", scale: 0.55, delay: "0.8s" },
  ];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        position: "relative",
      }}
    >
      <style>
        {`
@keyframes booze-wobble {
  0%, 100% { transform: rotate(-12deg); }
  50% { transform: rotate(12deg); }
}
@keyframes booze-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes booze-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
@keyframes booze-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
@keyframes booze-sparkle {
  0%, 100% { opacity: 0; transform: scale(0.3) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(30deg); }
}
@keyframes booze-pop {
  0% { opacity: 0; transform: scale(0); }
  40% { opacity: 0.8; transform: scale(1); }
  60% { opacity: 0.8; transform: scale(1.1); }
  80% { opacity: 0.3; transform: scale(1.8); }
  100% { opacity: 0; transform: scale(2); }
}
@keyframes booze-droplet {
  0%, 60% { opacity: 0; transform: translate(0, 0) scale(0); }
  70% { opacity: 1; transform: translate(8px, -6px) scale(1); }
  100% { opacity: 0; transform: translate(14px, 8px) scale(0.6); }
}
@keyframes booze-aroma {
  0% { opacity: 0; transform: translateY(0) scale(0.8); }
  30% { opacity: 0.5; }
  100% { opacity: 0; transform: translateY(-14px) scale(0.3); }
}
        `}
      </style>
      <div style={{ display: "inline-flex", animation: variant.animation }}>
        <IconComponent style={{ fontSize: size * 0.75, color: iconColor }} />
      </div>
      {variant.effect === "sparkles" &&
        sparkles.map((s) => {
          const starSize = size * 0.25 * s.scale;
          return (
            <svg
              key={s.delay}
              width={starSize}
              height={starSize}
              viewBox="0 0 24 24"
              style={{
                position: "absolute",
                animation: "booze-sparkle 1.4s ease-in-out infinite",
                animationDelay: s.delay,
                top: s.top,
                right: s.right,
                bottom: s.bottom,
                left: s.left,
              }}
            >
              <path
                d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
                fill={iconColor}
              />
            </svg>
          );
        })}
      {variant.effect === "pop" &&
        pops.map((p) => (
          <div
            key={p.delay}
            style={{
              position: "absolute",
              width: size * p.scale * 0.08,
              height: size * p.scale * 0.08,
              borderRadius: "50%",
              border: `1.5px solid ${iconColor}`,
              top: p.top,
              left: p.left,
              right: p.right,
              animation: "booze-pop 1s ease-out infinite",
              animationDelay: p.delay,
            }}
          />
        ))}
      {variant.effect === "droplet" &&
        droplets.map((d) => (
          <div
            key={d.delay}
            style={{
              position: "absolute",
              width: size * 0.08,
              height: size * 0.1,
              borderRadius: "50% 50% 50% 0",
              backgroundColor: iconColor,
              top: d.top,
              right: d.right,
              animation: `booze-droplet ${d.duration}s ease-in-out infinite`,
              animationDelay: d.delay,
            }}
          />
        ))}
      {variant.effect === "aroma" &&
        aromas.map((a) => (
          <div
            key={a.delay}
            style={{
              position: "absolute",
              width: size * 0.15 * a.scale,
              height: size * 0.15 * a.scale,
              borderRadius: "50%",
              backgroundColor: iconColor,
              opacity: 0,
              top: a.top,
              left: a.left,
              animation: `booze-aroma ${a.duration}s ease-out infinite`,
              animationDelay: a.delay,
            }}
          />
        ))}
    </div>
  );
};

export default RandomBoozeSpinner;

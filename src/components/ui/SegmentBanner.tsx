import React from "react";
import { SquarePen } from "lucide-react";

interface SegmentBannerProps {
  label: string;
  value?: string | number | null;
  phisique?: { grade?: string | null };
  points?: number;
  position?: React.CSSProperties;
  readOnly?: boolean;
  onEdit?: () => void;
}

function convertKgToLbs(kg: number | undefined): number | undefined {
  if (typeof kg !== 'number') return undefined;
  return Math.round(kg * 2.20462);
}

export function SegmentBanner({ label, value, phisique, points, position, readOnly, onEdit }: SegmentBannerProps) {
  // If value is a string like '98kg', convert to lbs
  let displayValue = value;
  if (typeof value === 'string' && value.endsWith('kg')) {
    const num = parseFloat(value.replace('kg', ''));
    if (!isNaN(num)) {
      displayValue = `${convertKgToLbs(num)}lbs`;
    }
  }
  return (
    <div
      style={{ position: "absolute", zIndex: 20, ...position }}
      className="bg-[#232326] border border-[#3D3D40] rounded-2xl text-white shadow-lg p-0 w-[80vw] max-w-[260px] sm:w-[260px]"
    >
      <div
        className="flex items-center justify-between px-3 sm:px-[13px] pt-5"
      >
        <div>
          <div className="font-poppins font-semibold text-[clamp(1rem,3vw,1.1rem)]">{label}</div>
          {value !== undefined && (
            <div className="text-[#A0A0A0] font-poppins text-[clamp(0.75rem,2vw,0.9rem)] mt-0.5">{displayValue}</div>
          )}
          {phisique && (
            <div className="text-[#A0A0A0] font-poppins text-[clamp(0.75rem,2vw,0.9rem)] mt-0.5">
              Physique: {phisique.grade ?? "--"}
            </div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          {points !== undefined && (
            <>
              <div className="font-poppins font-semibold text-[clamp(1rem,3vw,1.1rem)]">{points}</div>
              <div className="font-poppins text-[clamp(0.75rem,2vw,0.9rem)] text-white">points</div>
            </>
          )}
        </div>
      </div>
      <div className="mb-5" />
      {!readOnly && (
        <button
          className="flex items-center gap-2 px-3 sm:px-[14px] py-5 w-full text-[clamp(0.9rem,2vw,1rem)] poppins-medium text-[#777779] rounded-b-2xl hover:bg-[#3D3D40] transition-colors border-none outline-none cursor-pointer justify-start"
          onClick={onEdit}
        >
          <SquarePen size={16} color="#777779" />
          <span>Edit</span>
        </button>
      )}
    </div>
  );
} 
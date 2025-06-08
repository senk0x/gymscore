"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProfileIcon } from '@/components/ui/ProfileIcon';
import { SegmentBanner } from '@/components/ui/SegmentBanner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

interface ShareClientPageProps {
  userName: string;
  gymscore: number | null;
  benchData: any;
  squatsData: any;
  curlsData: any;
  pullData: any;
  frequencyData: any;
  chestPhisiqueData: any;
  legsPhisiqueData: any;
  armsPhisiqueData: any;
  backPhisiqueData: any;
}

function ScoreRing({ onHover }: { onHover: (index: number | null) => void }) {
  // Ring settings
  const segments = 5;
  const radius = 180;
  const stroke = 16;
  const center = 200;
  const circumference = 2 * Math.PI * radius;
  const gapAngle = 8; // degrees between segments
  const segmentAngle = (360 - segments * gapAngle) / segments;
  const gapLength = (circumference / 360) * gapAngle;
  const segmentLength = (circumference / 360) * segmentAngle;
  const colors = ["#4F46B1", "#B14648", "#B18F46", "#8846B1", "#46B152"];

  return (
    <svg width={400} height={400} viewBox="0 0 400 400">
      {[...Array(segments)].map((_, i) => {
        const offset = i * (segmentLength + gapLength);
        return (
          <circle
            key={i}
            r={radius}
            cx={center}
            cy={center}
            fill="none"
            stroke={colors[i]}
            strokeWidth={stroke}
            strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
            strokeDashoffset={-offset}
            style={{ transition: "stroke 0.2s", cursor: "pointer" }}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
          />
        );
      })}
    </svg>
  );
}

// ProfileBanner copied from Home Page
function ProfileBanner({ name, email, onClose, onLogout }: { name: string; email: string; onClose: () => void; onLogout: () => void }) {
  return (
    <div
      className="absolute right-0 top-[calc(100%+4px)] z-50 profile-banner transition-all duration-500 ease-out animate-profile-banner"
      style={{ minWidth: 252 }}
    >
      <div
        className="relative rounded-2xl border"
        style={{ background: "#27272A", borderColor: "#3D3D40" }}
      >
        <div className="flex flex-col px-[14px] pt-[21px] pb-[21px]">
          <span className="text-[15px] poppins-medium text-[#FFFFFF] leading-tight">{name}</span>
          <span className="text-[12px] poppins-regular text-[#777779] mt-[4px]">{email}</span>
        </div>
        <hr className="border-t border-[#3D3D40]" style={{ borderWidth: "1px", marginLeft: 0, marginRight: 0 }} />
        <button
          className="flex items-center gap-2 px-[14px] py-[21px] w-full text-[15px] poppins-medium text-[#777779] rounded-b-2xl hover:bg-[#3D3D40] transition-colors"
          onClick={onLogout}
        >
          <LogOut size={16} color="#777779" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}

export default function ShareClientPage(props: ShareClientPageProps) {
  const {
    userName,
    gymscore,
    benchData,
    squatsData,
    curlsData,
    pullData,
    frequencyData,
    chestPhisiqueData,
    legsPhisiqueData,
    armsPhisiqueData,
    backPhisiqueData,
  } = props;
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="relative min-h-screen text-white font-sans flex flex-col overflow-hidden" style={{ background: "#1E1E1E" }}>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" aria-label="Go to home">
            <Image
              src="/logo.png"
              alt="gymscore logo"
              width={120}
              height={32}
              draggable={false}
              style={{ userSelect: 'none', pointerEvents: 'auto' }}
            />
          </Link>
        </div>
        {/* Profile Icon and Banner */}
        <div className="relative">
          {user ? (
            <>
              <ProfileIcon onClick={() => setShowProfile((v) => !v)} />
              {showProfile && (
                <ProfileBanner
                  name={user.user_metadata?.full_name || user.email || ''}
                  email={user.email || ''}
                  onClose={() => setShowProfile(false)}
                  onLogout={async () => {
                    await router.push('/?auth=1');
                  }}
                />
              )}
            </>
          ) : (
            <button
              className="rounded-full bg-[#27272A] border border-[#27272A] shadow-sm hover:bg-[#232326] px-6 py-2 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:scale-105 text-[13px] poppins-medium text-[#67676A]"
              onClick={() => router.push('/?auth=1')}
              type="button"
            >
              Log In
            </button>
          )}
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {/* Score Circle */}
        <div className="relative flex flex-col items-center justify-center w-[90vw] max-w-[400px] h-[90vw] max-h-[400px] sm:w-[400px] sm:h-[400px]">
          <ScoreRing onHover={setHoveredSegment} />
          {/* Score Value */}
          <div className="absolute top-1/2 left-1/2 flex flex-col items-center" style={{ transform: "translate(-50%, -50%)" }}>
            <span className="text-[clamp(1rem,4vw,2rem)] poppins-medium text-[#67676A] mb-6">💪 {userName}&apos;s score:</span>
            <span className="text-[clamp(2.5rem,16vw,8rem)] poppins-medium leading-none">{gymscore !== null ? Math.round(gymscore) : 0}</span>
          </div>
          {/* Segment banners - only show on hover */}
          {hoveredSegment === 0 && (
            <SegmentBanner
              label="🔵 Legs"
              value={squatsData ? `Squats: ${squatsData.weight}${squatsData.unit}` : '--'}
              phisique={legsPhisiqueData ? { grade: legsPhisiqueData.grade } : undefined}
              points={(squatsData?.points || 0) + (legsPhisiqueData?.points || 0)}
              position={{ left: 400 - 40, top: 400 - 80 }}
              readOnly
            />
          )}
          {hoveredSegment === 4 && (
            <SegmentBanner
              label="🟢 Arms"
              value={curlsData ? `Biceps curl: ${curlsData.weight}${curlsData.unit}` : '--'}
              phisique={armsPhisiqueData ? { grade: armsPhisiqueData.grade } : undefined}
              points={(curlsData?.points || 0) + (armsPhisiqueData?.points || 0)}
              position={{ left: 400 - 40, top: -60 }}
              readOnly
            />
          )}
          {hoveredSegment === 2 && (
            <SegmentBanner
              label="🟠 Frequency"
              value={frequencyData ? `${frequencyData.days_per_week}/week` : '--'}
              points={frequencyData?.points || 0}
              position={{ left: -275, top: 200 - 60 }}
              readOnly
            />
          )}
          {hoveredSegment === 3 && (
            <SegmentBanner
              label="🟣 Back"
              value={pullData ? `Wide Grip Pull: ${pullData.weight}${pullData.unit}` : '--'}
              phisique={backPhisiqueData ? { grade: backPhisiqueData.grade } : undefined}
              points={(pullData?.points || 0) + (backPhisiqueData?.points || 0)}
              position={{ left: -175, top: -100 }}
              readOnly
            />
          )}
          {hoveredSegment === 1 && (
            <SegmentBanner
              label="🔴 Chest"
              value={benchData ? `Bench Press: ${benchData.weight}${benchData.unit}` : '--'}
              phisique={chestPhisiqueData ? { grade: chestPhisiqueData.grade } : undefined}
              points={(benchData?.points || 0) + (chestPhisiqueData?.points || 0)}
              position={{ left: -175, top: 400 - 40 }}
              readOnly
            />
          )}
        </div>
        {/* Your Score Button */}
        <div className="flex flex-col items-center mt-10">
          <button
            className="rounded-full bg-[#27272A] border border-[#27272A] shadow-sm hover:bg-[#232326] px-8 py-2 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:scale-105 text-[13px] poppins-medium text-[#67676A]"
            onClick={() => {
              if (user) {
                router.push('/');
              } else {
                router.push('/?auth=1');
              }
            }}
            type="button"
          >
            🫵 Your Score
          </button>
        </div>
      </main>
    </div>
  );
} 
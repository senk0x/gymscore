"use client";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { Component as SharePopover } from "@/components/ui/demo";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { supabase } from '@/lib/supabaseClient';
import { EditForm } from '@/components/EditForm';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext';
import { ProfileIcon } from '@/components/ui/ProfileIcon';
import { SquarePen } from 'lucide-react';

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

function FrequencyBanner({ frequency, onEdit }: { frequency: unknown, onEdit: () => void }) {
  const left = -275;
  const top = 200 - 60;
  const totalPoints = frequency ? frequency.points : 0;
  return (
    <div style={{ position: 'absolute', left, top, width: 260, background: '#232326', border: '1.5px solid #3D3D40', borderRadius: 20, color: '#fff', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', padding: 0, zIndex: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 13, paddingRight: 13, paddingTop: 21 }}>
          <div>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15 }}>🟠 Frequency</div>
          <div style={{ color: '#A0A0A0', fontFamily: 'Poppins', fontSize: 12, marginTop: 2 }}>{frequency ? `${frequency.days_per_week}/week` : '--'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15 }}>{totalPoints}</div>
          <div style={{ fontFamily: 'Poppins', fontSize: 12, color: '#fff' }}>points</div>
        </div>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #3D3D40', margin: '21px 0 0 0' }} />
      <button
        className="flex items-center gap-2 px-[14px] py-[21px] w-full text-[15px] poppins-medium text-[#777779] rounded-b-2xl hover:bg-[#3D3D40] transition-colors"
        style={{ border: 'none', outline: 'none', cursor: 'pointer', borderTopLeftRadius: 0, borderTopRightRadius: 0, justifyContent: 'flex-start' }}
        onClick={onEdit}
      >
        <SquarePen size={16} color="#777779" />
        <span>Edit</span>
      </button>
    </div>
  );
}

function LegsBanner({ squats, legsPhisique, onEdit }: { squats: unknown, legsPhisique: unknown, onEdit: () => void }) {
  // Blue segment banner: bottom right of the circle
  const left = 400 - 40;
  const top = 400 - 80;
  const totalPoints = (squats?.points || 0) + (legsPhisique?.points || 0);

  return (
    <div style={{
      position: 'absolute',
      left,
      top,
      transform: 'translate(0%, 0%)',
      width: 260,
      background: '#232326',
      border: '1.5px solid #3D3D40',
      borderRadius: 20,
      color: '#fff',
      boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
      padding: 0,
      zIndex: 20
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 13, paddingRight: 13, paddingTop: 21 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15 }}>🔵 Legs</div>
            <div style={{ color: '#A0A0A0', fontFamily: 'Poppins', fontSize: 12, marginTop: 2 }}>
              Squats: {squats ? `${squats.weight}${squats.unit}` : '--'}
            </div>
            <div style={{ color: '#A0A0A0', fontFamily: 'Poppins', fontSize: 12, marginTop: 2 }}>
              Phisique: {legsPhisique ? legsPhisique.grade : '--'}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15 }}>
            {totalPoints}
          </div>
          <div style={{ fontFamily: 'Poppins', fontSize: 12, color: '#fff' }}>points</div>
        </div>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #3D3D40', margin: '21px 0 0 0' }} />
      <button
        className="flex items-center gap-2 px-[14px] py-[21px] w-full text-[15px] poppins-medium text-[#777779] rounded-b-2xl hover:bg-[#3D3D40] transition-colors"
        style={{ border: 'none', outline: 'none', cursor: 'pointer', borderTopLeftRadius: 0, borderTopRightRadius: 0, justifyContent: 'flex-start' }}
        onClick={onEdit}
      >
        <SquarePen size={16} color="#777779" />
        <span>Edit</span>
      </button>
    </div>
  );
}

function ArmsBanner({ curls, armsPhisique, onEdit }: { curls: unknown, armsPhisique: unknown, onEdit: () => void }) {
  const left = 400 - 40;
  const top = -60;
  const totalPoints = (curls?.points || 0) + (armsPhisique?.points || 0);
  return (
    <div style={{ position: 'absolute', left, top, width: 260, background: '#232326', border: '1.5px solid #3D3D40', borderRadius: 20, color: '#fff', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', padding: 0, zIndex: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 13, paddingRight: 13, paddingTop: 21 }}>
        <div>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15 }}>🟢 Arms</div>
          <div style={{ color: '#A0A0A0', fontFamily: 'Poppins', fontSize: 12, marginTop: 2 }}>Biceps curl: {curls ? `${curls.weight}${curls.unit}` : '--'}</div>
          <div style={{ color: '#A0A0A0', fontFamily: 'Poppins', fontSize: 12, marginTop: 2 }}>{armsPhisique ? `${armsPhisique.grade} phisique score` : '--'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15 }}>{totalPoints}</div>
          <div style={{ fontFamily: 'Poppins', fontSize: 12, color: '#fff' }}>points</div>
        </div>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #3D3D40', margin: '21px 0 0 0' }} />
      <button
        className="flex items-center gap-2 px-[14px] py-[21px] w-full text-[15px] poppins-medium text-[#777779] rounded-b-2xl hover:bg-[#3D3D40] transition-colors"
        style={{ border: 'none', outline: 'none', cursor: 'pointer', borderTopLeftRadius: 0, borderTopRightRadius: 0, justifyContent: 'flex-start' }}
        onClick={onEdit}
      >
        <SquarePen size={16} color="#777779" />
        <span>Edit</span>
      </button>
    </div>
  );
}

function ChestBanner({ bench, chestPhisique, onEdit }: { bench: unknown, chestPhisique: unknown, onEdit: () => void }) {
  const left = -175;
  const top = 400 - 40;
  const totalPoints = (bench?.points || 0) + (chestPhisique?.points || 0);
  return (
    <div style={{ position: 'absolute', left, top, width: 260, background: '#232326', border: '1.5px solid #3D3D40', borderRadius: 20, color: '#fff', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', padding: 0, zIndex: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 13, paddingRight: 13, paddingTop: 21 }}>
        <div>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15 }}>🔴 Chest</div>
          <div style={{ color: '#A0A0A0', fontFamily: 'Poppins', fontSize: 12, marginTop: 2 }}>Bench Press: {bench ? `${bench.weight}${bench.unit}` : '--'}</div>
          <div style={{ color: '#A0A0A0', fontFamily: 'Poppins', fontSize: 12, marginTop: 2 }}>{chestPhisique ? `${chestPhisique.grade} phisique score` : '--'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15 }}>{totalPoints}</div>
          <div style={{ fontFamily: 'Poppins', fontSize: 12, color: '#fff' }}>points</div>
        </div>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #3D3D40', margin: '21px 0 0 0' }} />
      <button
        className="flex items-center gap-2 px-[14px] py-[21px] w-full text-[15px] poppins-medium text-[#777779] rounded-b-2xl hover:bg-[#3D3D40] transition-colors"
        style={{ border: 'none', outline: 'none', cursor: 'pointer', borderTopLeftRadius: 0, borderTopRightRadius: 0, justifyContent: 'flex-start' }}
        onClick={onEdit}
      >
        <SquarePen size={16} color="#777779" />
        <span>Edit</span>
      </button>
    </div>
  );
}

function BackBanner({ pull, backPhisique, onEdit }: { pull: unknown, backPhisique: unknown, onEdit: () => void }) {
  const left = -175;
  const top = -100;
  const totalPoints = (pull?.points || 0) + (backPhisique?.points || 0);
  return (
    <div style={{ position: 'absolute', left, top, width: 260, background: '#232326', border: '1.5px solid #3D3D40', borderRadius: 20, color: '#fff', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', padding: 0, zIndex: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 13, paddingRight: 13, paddingTop: 21 }}>
        <div>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15 }}>🟣 Back</div>
          <div style={{ color: '#A0A0A0', fontFamily: 'Poppins', fontSize: 12, marginTop: 2 }}>Wide Grip Pull: {pull ? `${pull.weight}${pull.unit}` : '--'}</div>
          <div style={{ color: '#A0A0A0', fontFamily: 'Poppins', fontSize: 12, marginTop: 2 }}>{backPhisique ? `${backPhisique.grade} phisique score` : '--'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15 }}>{totalPoints}</div>
          <div style={{ fontFamily: 'Poppins', fontSize: 12, color: '#fff' }}>points</div>
        </div>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #3D3D40', margin: '21px 0 0 0' }} />
      <button
        className="flex items-center gap-2 px-[14px] py-[21px] w-full text-[15px] poppins-medium text-[#777779] rounded-b-2xl hover:bg-[#3D3D40] transition-colors"
        style={{ border: 'none', outline: 'none', cursor: 'pointer', borderTopLeftRadius: 0, borderTopRightRadius: 0, justifyContent: 'flex-start' }}
        onClick={onEdit}
      >
        <SquarePen size={16} color="#777779" />
        <span>Edit</span>
      </button>
    </div>
  );
}

function ProfileBanner({ name, email, onLogout }: { name: string; email: string; onLogout: () => void }) {
  return (
    <div
      className="absolute right-0 top-[calc(100%+4px)] z-50 profile-banner transition-all duration-500 ease-out animate-profile-banner"
      style={{ minWidth: 252 }}
    >
      <div
        className="relative rounded-2xl border"
        style={{
          background: "#27272A",
          borderColor: "#3D3D40"
        }}
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
          <SquarePen size={16} color="#777779" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [showProfile, setShowProfile] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [gymscore, setGymscore] = useState<number | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const [squatsData, setSquatsData] = useState<Record<string, unknown> | null>(null);
  const [legsPhisiqueData, setLegsPhisiqueData] = useState<Record<string, unknown> | null>(null);
  const [curlsData, setCurlsData] = useState<Record<string, unknown> | null>(null);
  const [armsPhisiqueData, setArmsPhisiqueData] = useState<Record<string, unknown> | null>(null);
  const [benchData, setBenchData] = useState<Record<string, unknown> | null>(null);
  const [chestPhisiqueData, setChestPhisiqueData] = useState<Record<string, unknown> | null>(null);
  const [pullData, setPullData] = useState<Record<string, unknown> | null>(null);
  const [backPhisiqueData, setBackPhisiqueData] = useState<Record<string, unknown> | null>(null);
  const [frequencyData, setFrequencyData] = useState<Record<string, unknown> | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSegment, setEditSegment] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string | number>>({});
  const [authModalOpen, setAuthModalOpen] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { user, isLoading, setUser } = useAuth();

  // Add click outside handler
  const handleClickOutside = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Check if the click is outside the profile banner and profile icon
    if (!target.closest('.profile-banner') && !target.closest('.profile-icon')) {
      setShowProfile(false);
    }
  };

  // Banner hover handlers
  const handleSegmentHover = (index: number | null) => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    if (index !== null) {
      setHoveredSegment(index);
      setBannerVisible(true);
    } else {
      hideTimeout.current = setTimeout(() => setBannerVisible(false), 200);
    }
  };
  const handleBannerMouseEnter = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setBannerVisible(true);
  };
  const handleBannerMouseLeave = () => {
    hideTimeout.current = setTimeout(() => setBannerVisible(false), 200);
  };

  // Reusable function to fetch latest data
  const fetchLatestData = useCallback(async () => {
    if (!user) return;
    // Squats/Legs
    const { data: squatsRows } = await supabase.from('exercises').select('*').eq('user_id', user.id).eq('exercise', 'Squats').order('created_at', { ascending: false }).limit(1);
    setSquatsData(squatsRows && squatsRows[0]);
    const { data: legsRows } = await supabase.from('phisique').select('*').eq('user_id', user.id).eq('muscle_group', 'Legs').order('created_at', { ascending: false }).limit(1);
    setLegsPhisiqueData(legsRows && legsRows[0]);
    // Biceps Curls/Arms
    const { data: curlsRows } = await supabase.from('exercises').select('*').eq('user_id', user.id).eq('exercise', 'Biceps Curls').order('created_at', { ascending: false }).limit(1);
    setCurlsData(curlsRows && curlsRows[0]);
    const { data: armsRows } = await supabase.from('phisique').select('*').eq('user_id', user.id).eq('muscle_group', 'Arms').order('created_at', { ascending: false }).limit(1);
    setArmsPhisiqueData(armsRows && armsRows[0]);
    // Bench Press/Chest
    const { data: benchRows } = await supabase.from('exercises').select('*').eq('user_id', user.id).eq('exercise', 'Bench Press').order('created_at', { ascending: false }).limit(1);
    setBenchData(benchRows && benchRows[0]);
    const { data: chestRows } = await supabase.from('phisique').select('*').eq('user_id', user.id).eq('muscle_group', 'Chest').order('created_at', { ascending: false }).limit(1);
    setChestPhisiqueData(chestRows && chestRows[0]);
    // Wide Grip Pull/Back
    const { data: pullRows } = await supabase.from('exercises').select('*').eq('user_id', user.id).eq('exercise', 'Wide Grip Pull').order('created_at', { ascending: false }).limit(1);
    setPullData(pullRows && pullRows[0]);
    const { data: backRows } = await supabase.from('phisique').select('*').eq('user_id', user.id).eq('muscle_group', 'Back').order('created_at', { ascending: false }).limit(1);
    setBackPhisiqueData(backRows && backRows[0]);
    // Frequency
    const { data: freqRows } = await supabase.from('frequency').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1);
    setFrequencyData(freqRows && freqRows[0]);
    // Gymscore
    const { data: scoreRows } = await supabase.from('score').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1);
    setGymscore(scoreRows && scoreRows[0] ? scoreRows[0].score : null);
  }, [user]);

  // Check for existing session on mount
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setAuthModalOpen(false);
      } else {
        setAuthModalOpen(true);
      }
    };
    getSession();
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuthModalOpen(false);
      } else {
        setAuthModalOpen(true);
      }
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  // Centralized onboarding check for all auth methods (including Google)
  useEffect(() => {
    async function checkOnboarding() {
      if (user) {
        const { data: scoreRows } = await supabase.from('score').select('*').eq('user_id', user.id).limit(1);
        setShowOnboarding(!scoreRows || scoreRows.length === 0);
      } else {
        setShowOnboarding(false);
      }
    }
    checkOnboarding();
  }, [user]);

  async function handleAuth(email: string, password: string, name: string, mode: 'login' | 'register') {
    if (mode === 'register') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });
      if (error) {
        alert(error.message);
        return;
      }
      if (data.user) {
        setUser({ ...data.user, user_metadata: { ...data.user.user_metadata, full_name: name } });
        setAuthModalOpen(false);
        // onboarding will be handled by effect
      }
    } else if (mode === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert(error.message);
        return;
      }
      if (data.user) {
        setUser(data.user);
        setAuthModalOpen(false);
        // onboarding will be handled by effect
      }
    }
  }

  useEffect(() => {
    if (user && !showOnboarding) {
      fetchLatestData();
    }
  }, [user, showOnboarding, fetchLatestData]);

  async function handleEditSubmit(inputValues: Record<string, string | number>, unit: 'kg' | 'lbs') {
    if (!user) return;
    const now = new Date().toISOString();
    const fieldToExercise: Record<'Bench Press' | 'Squats' | 'Biceps Curls' | 'Wide Grip Pull', string> = {
      'Bench Press': 'Bench Press',
      'Squats': 'Squats',
      'Biceps Curls': 'Biceps Curls',
      'Wide Grip Pull': 'Wide Grip Pull',
    };
    for (const field of ['Bench Press', 'Squats', 'Biceps Curls', 'Wide Grip Pull'] as const) {
      const val = inputValues[field];
      if (val !== undefined && val !== null && val !== '') {
        const weight = parseFloat(val as string);
        const points = weight * 0.5;
        await supabase.from('exercises').update({
          weight,
          unit,
          points,
          last_update: now,
        }).eq('user_id', user.id).eq('exercise', fieldToExercise[field]);
      }
    }
    if (inputValues['Frequency'] !== undefined && inputValues['Frequency'] !== null && inputValues['Frequency'] !== '') {
      const freq = parseFloat(inputValues['Frequency'] as string);
      await supabase.from('frequency').update({
        days_per_week: freq,
        points: freq * 15,
        last_update: now,
      }).eq('user_id', user.id).order('created_at', { ascending: false }).limit(1);
    }
    const { data: benchRows } = await supabase.from('exercises').select('*').eq('user_id', user.id).eq('exercise', 'Bench Press').order('created_at', { ascending: false }).limit(1);
    const { data: squatsRows } = await supabase.from('exercises').select('*').eq('user_id', user.id).eq('exercise', 'Squats').order('created_at', { ascending: false }).limit(1);
    const { data: curlsRows } = await supabase.from('exercises').select('*').eq('user_id', user.id).eq('exercise', 'Biceps Curls').order('created_at', { ascending: false }).limit(1);
    const { data: pullRows } = await supabase.from('exercises').select('*').eq('user_id', user.id).eq('exercise', 'Wide Grip Pull').order('created_at', { ascending: false }).limit(1);
    const { data: freqRows } = await supabase.from('frequency').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1);
    const bench = benchRows && benchRows[0] ? benchRows[0].weight : 0;
    const squats = squatsRows && squatsRows[0] ? squatsRows[0].weight : 0;
    const curls = curlsRows && curlsRows[0] ? curlsRows[0].weight : 0;
    const pull = pullRows && pullRows[0] ? pullRows[0].weight : 0;
    const freq = freqRows && freqRows[0] ? freqRows[0].days_per_week : 0;
    const gymscore = (bench * 0.5) + (squats * 0.5) + (curls * 0.5) + (pull * 0.5) + (freq * 15);
    await supabase.from('score').insert({ score: gymscore, last_update: now, user_id: user.id });
    setGymscore(gymscore);
    setEditModalOpen(false);
    await fetchLatestData();
  }

  // Only show main UI if user is logged in and auth modal is closed
  return (
    <div className="relative min-h-screen text-white font-sans flex flex-col overflow-hidden" style={{ background: "#1E1E1E" }} onClick={handleClickOutside}>
      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <>
          {/* Show AuthForm only if not authenticated */}
          {!user && (
            <AuthForm
              open={authModalOpen}
              onClose={() => setAuthModalOpen(false)}
              onAuth={handleAuth}
              mode={authMode}
              onModeChange={setAuthMode}
            />
          )}
          {/* Show onboarding only if authenticated and onboarding is needed */}
          {user && !authModalOpen && showOnboarding && (
            <OnboardingFlow user={user} onComplete={(score) => { setGymscore(score); setShowOnboarding(false); }} />
          )}
          {/* Show main UI only if authenticated, not onboarding, and not showing auth modal */}
          {user && !authModalOpen && !showOnboarding && (
            <>
              {/* Header */}
              <header className="flex justify-between items-center px-8 py-6 relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Go to home"
                    onClick={() => window.location.reload()}
                    style={{ padding: 0, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <Image
                      src="/logo.png"
                      alt="gymscore logo"
                      width={120}
                      height={32}
                      draggable={false}
                      onContextMenu={e => e.preventDefault()}
                      style={{ userSelect: 'none', pointerEvents: 'auto' }}
                    />
                  </button>
                </div>
                {/* User Icon */}
                <div className="relative">
                  <ProfileIcon onClick={() => setShowProfile((v) => !v)} />
                  {showProfile && (
                    <ProfileBanner
                      name={user?.user_metadata?.full_name || user?.email || ''}
                      email={user?.email || ''}
                      onLogout={async () => {
                        await supabase.auth.signOut();
                        setUser(null);
                        setAuthModalOpen(true);
                      }}
                    />
                  )}
                </div>
              </header>
              {/* Main Content */}
              <main className="flex-1 flex flex-col items-center justify-center">
                {/* Score Circle */}
                <div className="relative flex flex-col items-center justify-center w-[90vw] max-w-[400px] h-[90vw] max-h-[400px] sm:w-[400px] sm:h-[400px]">
                  <ScoreRing onHover={handleSegmentHover} />
                  {/* Score Value */}
                  <div className="absolute top-1/2 left-1/2 flex flex-col items-center" style={{ transform: "translate(-50%, -50%)" }}>
                    <span className="text-[15px] sm:text-[15px] poppins-medium text-[#67676A] mb-6">💪 Your score:</span>
                    <span className="text-[clamp(2.5rem,16vw,8rem)] poppins-medium leading-none">{gymscore !== null ? Math.round(gymscore) : 0}</span>
                  </div>
                  {bannerVisible && hoveredSegment !== null && (
                    <>
                      {hoveredSegment === 0 && (
                        <div onMouseEnter={handleBannerMouseEnter} onMouseLeave={handleBannerMouseLeave}>
                          <LegsBanner squats={squatsData} legsPhisique={legsPhisiqueData} onEdit={() => {
                            setEditSegment('Squats');
                            setEditValues({
                              'Bench Press': benchData?.weight ?? '',
                              'Squats': squatsData?.weight ?? '',
                              'Biceps Curls': curlsData?.weight ?? '',
                              'Wide Grip Pull': pullData?.weight ?? '',
                              'Frequency': frequencyData?.days_per_week ?? ''
                            });
                            setEditModalOpen(true);
                          }} />
                        </div>
                      )}
                      {hoveredSegment === 4 && (
                        <div onMouseEnter={handleBannerMouseEnter} onMouseLeave={handleBannerMouseLeave}>
                          <ArmsBanner curls={curlsData} armsPhisique={armsPhisiqueData} onEdit={() => {
                            setEditSegment('Biceps Curls');
                            setEditValues({
                              'Bench Press': benchData?.weight ?? '',
                              'Squats': squatsData?.weight ?? '',
                              'Biceps Curls': curlsData?.weight ?? '',
                              'Wide Grip Pull': pullData?.weight ?? '',
                              'Frequency': frequencyData?.days_per_week ?? ''
                            });
                            setEditModalOpen(true);
                          }} />
                        </div>
                      )}
                      {hoveredSegment === 2 && (
                        <div onMouseEnter={handleBannerMouseEnter} onMouseLeave={handleBannerMouseLeave}>
                          <FrequencyBanner frequency={frequencyData} onEdit={() => {
                            setEditSegment('Frequency');
                            setEditValues({
                              'Bench Press': benchData?.weight ?? '',
                              'Squats': squatsData?.weight ?? '',
                              'Biceps Curls': curlsData?.weight ?? '',
                              'Wide Grip Pull': pullData?.weight ?? '',
                              'Frequency': frequencyData?.days_per_week ?? ''
                            });
                            setEditModalOpen(true);
                          }} />
                        </div>
                      )}
                      {hoveredSegment === 3 && (
                        <div onMouseEnter={handleBannerMouseEnter} onMouseLeave={handleBannerMouseLeave}>
                          <BackBanner pull={pullData} backPhisique={backPhisiqueData} onEdit={() => {
                            setEditSegment('Wide Grip Pull');
                            setEditValues({
                              'Bench Press': benchData?.weight ?? '',
                              'Squats': squatsData?.weight ?? '',
                              'Biceps Curls': curlsData?.weight ?? '',
                              'Wide Grip Pull': pullData?.weight ?? '',
                              'Frequency': frequencyData?.days_per_week ?? ''
                            });
                            setEditModalOpen(true);
                          }} />
                        </div>
                      )}
                      {hoveredSegment === 1 && (
                        <div onMouseEnter={handleBannerMouseEnter} onMouseLeave={handleBannerMouseLeave}>
                          <ChestBanner bench={benchData} chestPhisique={chestPhisiqueData} onEdit={() => {
                            setEditSegment('Bench Press');
                            setEditValues({
                              'Bench Press': benchData?.weight ?? '',
                              'Squats': squatsData?.weight ?? '',
                              'Biceps Curls': curlsData?.weight ?? '',
                              'Wide Grip Pull': pullData?.weight ?? '',
                              'Frequency': frequencyData?.days_per_week ?? ''
                            });
                            setEditModalOpen(true);
                          }} />
                        </div>
                      )}
                    </>
                  )}
                </div>
                {/* Share Section */}
                <div className="flex flex-col items-center mt-10">
                  <SharePopover />
                </div>
                <EditForm open={editModalOpen} onClose={() => setEditModalOpen(false)} segment={editSegment} currentValues={editValues} onEdit={handleEditSubmit} />
              </main>
            </>
          )}
        </>
      )}
    </div>
  );
}

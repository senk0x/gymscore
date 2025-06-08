/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import ShareClientPage from './ShareClientPage';
import { supabase } from '@/lib/supabaseClient';

interface PageProps {
  params: Record<string, string | string[] | undefined>;
}

export default async function Page({ params }: PageProps) {
  const userId = Array.isArray(params.id) ? params.id[0] : params.id || '';
  // Fetch the latest gymscore for this user
  const { data: scoreRows } = await supabase
    .from('score')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);
  const gymscore = scoreRows && scoreRows[0] ? scoreRows[0].score : null;

  // Fetch user info (name/email) from public_profiles
  let userName = 'User';
  const { data: profileRows } = await supabase
    .from('public_profiles')
    .select('name, email')
    .eq('user_id', userId)
    .maybeSingle();
  if (profileRows) {
    userName = profileRows.name || profileRows.email || 'User';
  }

  // Fetch all segment data for the user
  const [benchData, squatsData, curlsData, pullData, frequencyData, chestPhisiqueData, legsPhisiqueData, armsPhisiqueData, backPhisiqueData] = await Promise.all([
    supabase.from('exercises').select('*').eq('user_id', userId).eq('exercise', 'Bench Press').order('created_at', { ascending: false }).limit(1).then(r => r.data?.[0] ?? null),
    supabase.from('exercises').select('*').eq('user_id', userId).eq('exercise', 'Squats').order('created_at', { ascending: false }).limit(1).then(r => r.data?.[0] ?? null),
    supabase.from('exercises').select('*').eq('user_id', userId).eq('exercise', 'Biceps Curls').order('created_at', { ascending: false }).limit(1).then(r => r.data?.[0] ?? null),
    supabase.from('exercises').select('*').eq('user_id', userId).eq('exercise', 'Wide Grip Pull').order('created_at', { ascending: false }).limit(1).then(r => r.data?.[0] ?? null),
    supabase.from('frequency').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).then(r => r.data?.[0] ?? null),
    supabase.from('phisique').select('*').eq('user_id', userId).eq('muscle_group', 'Chest').order('created_at', { ascending: false }).limit(1).then(r => r.data?.[0] ?? null),
    supabase.from('phisique').select('*').eq('user_id', userId).eq('muscle_group', 'Legs').order('created_at', { ascending: false }).limit(1).then(r => r.data?.[0] ?? null),
    supabase.from('phisique').select('*').eq('user_id', userId).eq('muscle_group', 'Arms').order('created_at', { ascending: false }).limit(1).then(r => r.data?.[0] ?? null),
    supabase.from('phisique').select('*').eq('user_id', userId).eq('muscle_group', 'Back').order('created_at', { ascending: false }).limit(1).then(r => r.data?.[0] ?? null),
  ]);

  return (
    <ShareClientPage
      userName={userName}
      gymscore={gymscore}
      benchData={benchData}
      squatsData={squatsData}
      curlsData={curlsData}
      pullData={pullData}
      frequencyData={frequencyData}
      chestPhisiqueData={chestPhisiqueData}
      legsPhisiqueData={legsPhisiqueData}
      armsPhisiqueData={armsPhisiqueData}
      backPhisiqueData={backPhisiqueData}
    />
  );
} 
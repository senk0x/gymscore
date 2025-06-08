import { useState } from 'react';
import { Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface OnboardingFlowProps {
  user: User | null;
  onComplete: (gymscore: number, aiMessage?: string) => void;
}

export function OnboardingFlow({ user, onComplete }: OnboardingFlowProps) {
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [formData, setFormData] = useState({
    benchPress: '',
    squats: '',
    bicepsCurls: '',
    wideGripPull: '',
    frequency: '',
    physiquePhoto: null as File | null,
  });
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [photoHover, setPhotoHover] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Max values for each unit
  const maxValue = unit === 'kg' ? 500 : 660;

  const handleInputChange = (field: string, value: string) => {
    let numValue = parseFloat(value);
    if (isNaN(numValue)) numValue = 0;
    if (field === 'frequency') {
      if (numValue < 0) numValue = 0;
      if (numValue > 14) numValue = 14;
      setFormData(prev => ({ ...prev, [field]: value === '' ? '' : numValue.toString() }));
      return;
    }
    if (numValue < 0) return;
    if (numValue > maxValue) numValue = maxValue;
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? '' : numValue.toString()
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        physiquePhoto: e.target.files![0]
      }));
    }
  };

  async function analyzePhotoWithGemini(photo: File): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          const response = await fetch('/api/analyze-photo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: base64,
              mimeType: photo.type,
            }),
          });

          const data = await response.json();
          
          if (!response.ok) {
            console.error('API Error:', data); // Debug log
            throw new Error(data.error || 'Failed to analyze photo');
          }

          console.log('API Response:', data); // Debug log
          resolve(data.result);
        } catch (err: any) {
          console.error('Error in analyzePhotoWithGemini:', err); // Debug log
          reject(err);
        }
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error); // Debug log
        reject(error);
      };
      reader.readAsDataURL(photo);
    });
  }

  function parsePhysiqueRatings(aiText: string): { chest: number, legs: number, back: number, arms: number } | null {
    // Try to extract JSON from code-fenced block if present
    const codeFenceMatch = aiText.match(/```(?:json)?\s*([\s\S]+?)\s*```/i);
    let jsonText = aiText;
    if (codeFenceMatch) {
      jsonText = codeFenceMatch[1];
    }
    // Try to parse as JSON
    try {
      const obj = JSON.parse(jsonText);
      if (
        typeof obj.chest === 'number' &&
        typeof obj.legs === 'number' &&
        typeof obj.back === 'number' &&
        typeof obj.arms === 'number'
      ) {
        // Validate range
        if (
          obj.chest >= 1 && obj.chest <= 10 &&
          obj.legs >= 1 && obj.legs <= 10 &&
          obj.back >= 1 && obj.back <= 10 &&
          obj.arms >= 1 && obj.arms <= 10
        ) {
          return obj;
        }
      }
    } catch (jsonErr) {
      // Fallback to regex below
    }
    // Fallback: Extract numbers using regex, looking for patterns like "X/10" or "X out of 10"
    const chestMatch = aiText.match(/Chest\s*(\d{1,2})\/10/i);
    const legsMatch = aiText.match(/Legs\s*(\d{1,2})\/10/i);
    const backMatch = aiText.match(/Back\s*(\d{1,2})\/10/i);
    const armsMatch = aiText.match(/Arms\s*(\d{1,2})\/10/i);

    // If we can't find at least one valid rating, return null
    if (!chestMatch && !legsMatch && !backMatch && !armsMatch) {
      return null;
    }

    // Parse each rating, defaulting to 0 if not found
    const chest = chestMatch ? parseInt(chestMatch[1], 10) : 0;
    const legs = legsMatch ? parseInt(legsMatch[1], 10) : 0;
    const back = backMatch ? parseInt(backMatch[1], 10) : 0;
    const arms = armsMatch ? parseInt(armsMatch[1], 10) : 0;

    // Validate that the numbers are within range
    if (chest > 10 || legs > 10 || back > 10 || arms > 10) {
      return null;
    }

    return { chest, legs, back, arms };
  }

  const handleCalculate = async () => {
    setAiError(null);
    setIsLoading(true);
    let bench = parseFloat(formData.benchPress) || 0;
    let squats = parseFloat(formData.squats) || 0;
    let curls = parseFloat(formData.bicepsCurls) || 0;
    let pull = parseFloat(formData.wideGripPull) || 0;
    const freq = parseFloat(formData.frequency) || 0;
    if (unit === 'lbs') {
      bench = bench * 0.453592;
      squats = squats * 0.453592;
      curls = curls * 0.453592;
      pull = pull * 0.453592;
    }
    try {
      let gymscore = 0;
      let aiText: string | undefined = undefined;
      let ratings: { chest: number, legs: number, back: number, arms: number } | null = null;
      if (formData.physiquePhoto) {
        aiText = await analyzePhotoWithGemini(formData.physiquePhoto);
        if (aiText.startsWith('ERROR')) {
          setAiError('Could not analyze physique. Please upload a clear photo of your body.');
          setIsLoading(false);
          return;
        }
        ratings = parsePhysiqueRatings(aiText);
        if (!ratings) {
          setAiError('Could not extract physique ratings. Please try another photo.');
          setIsLoading(false);
          return;
        }
        gymscore = (bench * 0.5) + (squats * 0.5) + (curls * 0.5) + (ratings.chest * 10) + (ratings.legs * 10) + (ratings.arms * 10) + (ratings.back * 10) + (freq * 15);
      } else {
        gymscore = (bench * 0.5) + (squats * 0.5) + (curls * 0.5) + (pull * 0.5) + (freq * 15);
      }

      if (!user) throw new Error('User not authenticated');
      const userId = user.id;
      const now = new Date().toISOString();
      // --- Upsert exercises ---
      const exerciseInserts = [
        { exercise: 'Bench Press', weight: bench, unit, points: bench * 0.5 },
        { exercise: 'Squats', weight: squats, unit, points: squats * 0.5 },
        { exercise: 'Biceps Curls', weight: curls, unit, points: curls * 0.5 },
        { exercise: 'Wide Grip Pull', weight: pull, unit, points: pull * 0.5 },
      ];
      for (const ex of exerciseInserts) {
        // Fetch existing row
        const { data: existing, error: fetchError } = await supabase
          .from('exercises')
          .select('id, created_at')
          .eq('user_id', userId)
          .eq('exercise', ex.exercise)
          .maybeSingle();
        if (fetchError) console.error('Supabase fetch error (exercises):', fetchError);
        const upsertPayload: any = {
          exercise: ex.exercise,
          weight: ex.weight,
          unit: ex.unit,
          points: ex.points,
          last_update: now,
          user_id: userId,
        };
        if (existing) {
          upsertPayload.id = existing.id;
          upsertPayload.created_at = existing.created_at;
        }
        const { error } = await supabase.from('exercises').upsert(upsertPayload, { onConflict: 'user_id,exercise' });
        if (error) console.error('Supabase upsert error (exercises):', error);
      }

      // --- Upsert phisique ---
      let phisiqueInserts: { muscle_group: string; grade: string; points: number }[];
      if (ratings) {
        phisiqueInserts = [
          { muscle_group: 'Chest', grade: `${ratings.chest}/10`, points: ratings.chest * 10 },
          { muscle_group: 'Legs', grade: `${ratings.legs}/10`, points: ratings.legs * 10 },
          { muscle_group: 'Back', grade: `${ratings.back}/10`, points: ratings.back * 10 },
          { muscle_group: 'Arms', grade: `${ratings.arms}/10`, points: ratings.arms * 10 },
        ];
      } else {
        phisiqueInserts = [
          { muscle_group: 'Chest', grade: '0/10', points: 0 },
          { muscle_group: 'Legs', grade: '0/10', points: 0 },
          { muscle_group: 'Back', grade: '0/10', points: 0 },
          { muscle_group: 'Arms', grade: '0/10', points: 0 },
        ];
      }
      for (const ph of phisiqueInserts) {
        const { data: existing, error: fetchError } = await supabase
          .from('phisique')
          .select('id, created_at')
          .eq('user_id', userId)
          .eq('muscle_group', ph.muscle_group)
          .maybeSingle();
        if (fetchError) console.error('Supabase fetch error (phisique):', fetchError);
        const upsertPayload: any = {
          muscle_group: ph.muscle_group,
          grade: ph.grade,
          points: ph.points,
          last_update: now,
          user_id: userId,
        };
        if (existing) {
          upsertPayload.id = existing.id;
          upsertPayload.created_at = existing.created_at;
        }
        const { error } = await supabase.from('phisique').upsert(upsertPayload, { onConflict: 'user_id,muscle_group' });
        if (error) console.error('Supabase upsert error (phisique):', error);
      }

      // --- Upsert score ---
      {
        const { data: existing, error: fetchError } = await supabase
          .from('score')
          .select('id, created_at')
          .eq('user_id', userId)
          .maybeSingle();
        if (fetchError) console.error('Supabase fetch error (score):', fetchError);
        const upsertPayload: any = {
          score: gymscore,
          last_update: now,
          user_id: userId,
        };
        if (existing) {
          upsertPayload.id = existing.id;
          upsertPayload.created_at = existing.created_at;
        }
        const { error } = await supabase.from('score').upsert(upsertPayload, { onConflict: 'user_id' });
        if (error) console.error('Supabase upsert error (score):', error);
      }

      // --- Upsert frequency ---
      {
        const { data: existing, error: fetchError } = await supabase
          .from('frequency')
          .select('id, created_at')
          .eq('user_id', userId)
          .maybeSingle();
        if (fetchError) console.error('Supabase fetch error (frequency):', fetchError);
        const upsertPayload: any = {
          days_per_week: freq,
          points: freq * 15,
          last_update: now,
          user_id: userId,
        };
        if (existing) {
          upsertPayload.id = existing.id;
          upsertPayload.created_at = existing.created_at;
        }
        const { error } = await supabase.from('frequency').upsert(upsertPayload, { onConflict: 'user_id' });
        if (error) console.error('Supabase upsert error (frequency):', error);
      }

      setIsLoading(false);
      // Insert into public_profiles if not exists
      if (user && user.id && user.email && user.user_metadata?.full_name) {
        const { data: existingProfile, error: fetchProfileError } = await supabase
          .from('public_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        if (!existingProfile) {
          const now = new Date().toISOString();
          await supabase.from('public_profiles').insert({
            created_at: now,
            name: user.user_metadata.full_name,
            email: user.email,
            user_id: user.id,
          });
        }
      }
      onComplete(gymscore, aiText);
    } catch (err: any) {
      setAiError('An error occurred while saving your data. Please try again.');
      setIsLoading(false);
      console.error('Onboarding save error:', err);
    }
  };

  const exercises = [
    { name: 'Bench Press', field: 'benchPress' },
    { name: 'Squats', field: 'squats' },
    { name: 'Biceps Curls', field: 'bicepsCurls' },
    { name: 'Wide Grip Pull', field: 'wideGripPull' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-[#1E1E1E] bg-opacity-95 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-[320px] bg-[#27272A] rounded-[20px] px-[13px] pt-[21px] pb-[21px] mx-auto my-0 flex flex-col justify-center"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          style={{ boxSizing: 'border-box' }}
        >
          <h2 className="text-[13px] poppins-medium text-white mb-4 text-center">
            Calculate Your Gym Score
          </h2>

          {/* Error Message */}
          {aiError && (
            <div className="text-red-500 text-center text-[12px] mb-2 poppins-medium">{aiError}</div>
          )}

          {/* Unit Toggle */}
          <motion.div className="flex justify-center mb-4" layout>
            <div className="bg-[#232326] rounded-lg p-0.5 inline-flex">
              <motion.button
                type="button"
                className={`px-2.5 py-1.5 rounded-md text-xs poppins-medium transition-colors ${unit === 'kg' ? 'bg-[#3D3D40] text-white' : 'text-[#777779]'}`}
                onClick={() => setUnit('kg')}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
                aria-pressed={unit === 'kg'}
              >
                kg
              </motion.button>
              <motion.button
                type="button"
                className={`px-2.5 py-1.5 rounded-md text-xs poppins-medium transition-colors ${unit === 'lbs' ? 'bg-[#3D3D40] text-white' : 'text-[#777779]'}`}
                onClick={() => setUnit('lbs')}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
                aria-pressed={unit === 'lbs'}
              >
                lbs
              </motion.button>
            </div>
          </motion.div>

          {/* Exercise Inputs */}
          <div className="space-y-3">
            {exercises.map((exercise) => (
              <div key={exercise.field} className="space-y-0.5">
                <label className="text-[13px] poppins-medium text-white mb-0.5 block">
                  {exercise.name}
                </label>
                <motion.div
                  className="relative"
                  animate={focusedInput === exercise.field ? { scale: 1.025, backgroundColor: '#232328' } : { scale: 1, backgroundColor: 'transparent' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ borderRadius: 16 }}
                >
                  <input
                    type="number"
                    min="0"
                    max={maxValue}
                    value={formData[exercise.field as keyof typeof formData] as string}
                    onChange={(e) => handleInputChange(exercise.field, e.target.value)}
                    onFocus={() => setFocusedInput(exercise.field)}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full bg-[#232326] rounded-[16px] px-3 py-1.5 text-white poppins-regular text-[11px] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:poppins-regular placeholder:text-[11px]"
                    placeholder={`Enter weight in ${unit}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777779] poppins-medium text-[13px]">
                    {unit}
                  </span>
                </motion.div>
              </div>
            ))}
            {/* Frequency Field */}
            <div className="space-y-0.5">
              <label className="text-[13px] poppins-medium text-white mb-0.5 block">
                How many times per week do you work out?
              </label>
              <motion.div
                className="relative"
                animate={focusedInput === 'frequency' ? { scale: 1.025, backgroundColor: '#232328' } : { scale: 1, backgroundColor: 'transparent' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ borderRadius: 16 }}
              >
                <input
                  type="number"
                  min="0"
                  max="14"
                  step="1"
                  value={formData.frequency}
                  onChange={(e) => handleInputChange('frequency', e.target.value)}
                  onFocus={() => setFocusedInput('frequency')}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full bg-[#232326] rounded-[16px] px-3 py-1.5 text-white poppins-regular text-[11px] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:poppins-regular placeholder:text-[11px]"
                  placeholder="e.g. 3"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777779] poppins-medium text-[13px]">
                  /week
                </span>
              </motion.div>
            </div>
            {/* Photo Upload */}
            <div className="space-y-0.5">
              <label className="text-[13px] poppins-medium text-white mb-0.5 block">
                Upload Physique Photo
              </label>
              <motion.div
                className="relative"
                whileHover={{ scale: 1.025, backgroundColor: '#232328' }}
                whileTap={{ scale: 0.97, backgroundColor: '#232328' }}
                animate={photoHover ? { backgroundColor: '#232328' } : { backgroundColor: 'transparent' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ borderRadius: 16 }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="w-full bg-[#232326] rounded-[16px] px-3 py-1.5 text-white poppins-regular text-[11px] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#3D3D40] transition-colors"
                  onMouseEnter={() => setPhotoHover(true)}
                  onMouseLeave={() => setPhotoHover(false)}
                >
                  <Upload size={16} />
                  <span className="poppins-regular text-[11px]">{formData.physiquePhoto ? 'Photo Selected' : 'Choose Photo'}</span>
                </label>
              </motion.div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="button"
            onClick={handleCalculate}
            className="w-full bg-[#3D3D40] text-white poppins-medium text-[13px] py-2 rounded-[16px] mt-6 hover:bg-[#232326] transition-colors"
            whileHover={{ scale: 1.035 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300 }}
            disabled={isLoading}
          >
            <span className="poppins-medium text-[13px]">{isLoading ? 'Calculating...' : '🧮 Calculate Score'}</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
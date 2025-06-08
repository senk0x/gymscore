import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditFormProps {
  open: boolean;
  onClose: () => void;
  segment?: string | null;
  currentValues?: Record<string, string | number>;
  onEdit?: (inputValues: Record<string, string | number>, unit: 'kg' | 'lbs') => void;
}

export function EditForm({ open, onClose, segment, currentValues = {}, onEdit }: EditFormProps) {
  // UI state only, no logic
  const [photoHover, setPhotoHover] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string | number>>({});
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');

  // Optionally, reset unit to 'kg' when modal opens
  useEffect(() => {
    if (open) setUnit('kg');
  }, [open]);

  if (!open) return null;

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
            Edit Your Gym Data
          </h2>

          {/* Example Error Message (hidden by default) */}
          {/* <div className="text-red-500 text-center text-[12px] mb-2 poppins-medium">Error message</div> */}

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
            {["Bench Press", "Squats", "Biceps Curls", "Wide Grip Pull"].map((name) => (
              <div key={name} className="space-y-0.5">
                <label className="text-[13px] poppins-medium text-white mb-0.5 block">
                  {name}
                </label>
                <motion.div
                  className="relative"
                  animate={focusedInput === name ? { scale: 1.025, backgroundColor: '#232328' } : { scale: 1, backgroundColor: 'transparent' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ borderRadius: 16 }}
                >
                  <input
                    type="number"
                    min="0"
                    className="w-full bg-[#232326] rounded-[16px] px-3 py-1.5 text-white poppins-regular text-[11px] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:poppins-regular placeholder:text-[11px]"
                    placeholder={currentValues[name] !== undefined && currentValues[name] !== null && currentValues[name] !== '' ? String(currentValues[name]) : `Enter weight in ${unit}`}
                    onChange={e => setInputValues(v => ({ ...v, [name]: e.target.value }))}
                    onFocus={() => setFocusedInput(name)}
                    onBlur={() => setFocusedInput(null)}
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
                  className="w-full bg-[#232326] rounded-[16px] px-3 py-1.5 text-white poppins-regular text-[11px] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:poppins-regular placeholder:text-[11px]"
                  placeholder={currentValues['Frequency'] !== undefined && currentValues['Frequency'] !== null && currentValues['Frequency'] !== '' ? String(currentValues['Frequency']) : 'e.g. 3'}
                  onChange={e => setInputValues(v => ({ ...v, frequency: e.target.value }))}
                  onFocus={() => setFocusedInput('frequency')}
                  onBlur={() => setFocusedInput(null)}
                />
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
                  className="hidden"
                  id="edit-photo-upload"
                />
                <label
                  htmlFor="edit-photo-upload"
                  className="w-full bg-[#232326] rounded-[16px] px-3 py-1.5 text-white poppins-regular text-[11px] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#3D3D40] transition-colors"
                  onMouseEnter={() => setPhotoHover(true)}
                  onMouseLeave={() => setPhotoHover(false)}
                >
                  <Upload size={16} />
                  <span className="poppins-regular text-[11px]">Choose Photo</span>
                </label>
              </motion.div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="button"
            onClick={() => onEdit && onEdit(inputValues, unit)}
            className="w-full bg-[#3D3D40] text-white poppins-medium text-[13px] py-2 rounded-[16px] mt-6 hover:bg-[#232326] transition-colors"
            whileHover={{ scale: 1.035 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <span className="poppins-medium text-[13px]">✏️ Edit</span>
          </motion.button>
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 bg-transparent border border-[#3D3D40] text-[#777779] poppins-medium text-[13px] py-2 rounded-[16px] hover:bg-[#232326] hover:text-white transition-colors"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 
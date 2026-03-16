'use client';

import { formatNaira } from '@/utils/taxCalculator';

interface InputSliderProps {
    label: string;
    value: number;
    min?: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    formatValue?: (value: number) => string;
    icon?: React.ReactNode;
}

export default function InputSlider({
    label,
    value,
    min = 0,
    max,
    step = 1000,
    onChange,
    formatValue = formatNaira,
    icon,
}: InputSliderProps) {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {icon}
                    {label}
                </label>
                <div className="flex items-center">
                    <input
                        type="number"
                        value={value === 0 ? '' : value}
                        min={min}
                        max={max}
                        placeholder="0"
                        onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Number(e.target.value);
                            onChange(val);
                        }}
                        className="w-32 px-2 py-1 text-right text-lg font-semibold text-zinc-900 dark:text-white bg-transparent border-b border-transparent hover:border-zinc-200 focus:border-emerald-500 focus:outline-none transition-colors appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <span className="text-zinc-500 ml-1 text-sm font-medium">NGN</span>
                </div>
            </div>

            <div className="relative pt-2">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="
            w-full h-3 rounded-full appearance-none cursor-pointer
            bg-zinc-200 dark:bg-zinc-700
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-gradient-to-r
            [&::-webkit-slider-thumb]:from-emerald-500
            [&::-webkit-slider-thumb]:to-teal-500
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-emerald-500/30
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-6
            [&::-moz-range-thumb]:h-6
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-gradient-to-r
            [&::-moz-range-thumb]:from-emerald-500
            [&::-moz-range-thumb]:to-teal-500
            [&::-moz-range-thumb]:border-0
          "
                    style={{
                        background: `linear-gradient(to right, 
              rgb(16 185 129) 0%, 
              rgb(20 184 166) ${percentage}%, 
              rgb(228 228 231) ${percentage}%, 
              rgb(228 228 231) 100%
            )`,
                    }}
                />
            </div>

            <div className="flex justify-between text-xs text-zinc-500">
                <span>{formatValue(min)}</span>
                <span>{formatValue(max)}</span>
            </div>
        </div>
    );
}

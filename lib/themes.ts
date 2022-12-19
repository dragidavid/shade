import { generateColors } from "lib/colors";

import type { ThemeDefinition, ChoiceDefinition } from "lib/types";

export const SUPPORTED_THEMES: ThemeDefinition[] = [
  {
    id: "sky",
    label: "Sky",
    class: "from-sky-400 to-blue-500",
    generatedColors: generateColors("#38bdf8", "#3b82f6"),
  },
  {
    id: "cotton_candy",
    label: "Cotton Candy",
    class: "from-violet-300 to-purple-400",
    generatedColors: generateColors("#c4b5fd", "#c084fc"),
  },
  {
    id: "smoke",
    label: "Smoke",
    class: "from-gray-900 to-gray-800",
    generatedColors: generateColors("#22d3ee", "#a5f3fc"),
  },
  {
    id: "honey",
    label: "Honey",
    class: "from-amber-300 to-orange-500",
    generatedColors: generateColors("#fcd34d", "#f97316"),
  },
  {
    id: "jade",
    label: "Jade",
    class: "from-teal-400 to-emerald-600",
    generatedColors: generateColors("#2dd4bf", "#059669"),
  },
  {
    id: "bubblegum",
    label: "Bubblegum",
    class: "from-fuchsia-500 to-pink-600",
    generatedColors: generateColors("#d946ef", "#db2777"),
  },
  {
    id: "salem",
    label: "Salem",
    class: "from-purple-900 to-violet-700",
    generatedColors: generateColors("#581c87", "#6d28d9"),
  },
];

export const SUPPORTED_PADDING_CHOICES: ChoiceDefinition[] = [
  { id: "sm", label: "16", class: "p-4" },
  { id: "md", label: "32", class: "p-8" },
  { id: "lg", label: "64", class: "p-16" },
  { id: "xl", label: "128", class: "p-32" },
];

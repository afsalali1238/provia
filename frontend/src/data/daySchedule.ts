// Day-to-Topic mapping from GULF EXAM SCHEDULE PDF
// Each day maps to its topic name(s) for display in the roadmap

export interface DayTopic {
  day: number;
  topic: string;
  subtopic?: string;
}

export const DAY_SCHEDULE: DayTopic[] = [
  { day: 1, topic: 'Adrenergic Agonist', subtopic: 'General Pharmacology' },
  { day: 2, topic: 'Adrenergic Agonist', subtopic: 'General Pharmacology' },
  { day: 3, topic: 'Adrenergic Antagonist', subtopic: 'Antidote & Pregnancy Choices' },
  { day: 4, topic: 'Adrenergic Antagonist', subtopic: 'Antidote & Pregnancy Choices' },
  { day: 5, topic: 'Cholinergic Agonist', subtopic: 'Sources of Drug Information, Hypolipidemic Agents' },
  { day: 6, topic: 'Cholinergic Agonist', subtopic: 'Sources of Drug Information, Hypolipidemic Agents' },
  { day: 7, topic: 'Cholinergic Antagonist', subtopic: 'Inventory Control' },
  { day: 8, topic: 'Asthma & NSAIDs', subtopic: 'Cough' },
  { day: 9, topic: 'CVS Introduction', subtopic: 'Histamines & Antihistamines' },
  { day: 10, topic: 'Diuretics & CHF Intro', subtopic: 'Peptic Ulcer' },
  { day: 11, topic: 'Congestive Heart Failure', subtopic: 'Institutional Review Board' },
  { day: 12, topic: 'Angina', subtopic: 'Hypolipidemic Agents, Regulations' },
  { day: 13, topic: 'Arrhythmia', subtopic: 'Statistics 1' },
  { day: 14, topic: 'Blood Drugs', subtopic: 'Pharmacoepidemiology, Hypertension' },
  { day: 15, topic: 'Blood Drugs', subtopic: 'Emetics & Antiemetics' },
  { day: 16, topic: 'Q&A Discussion', subtopic: 'Suspension vs. Emulsion' },
  { day: 17, topic: 'Dose Calculation', subtopic: 'Percentage Type' },
  { day: 18, topic: 'Molarity & Molality', subtopic: 'Milli-equivalence, Osmolar Concentration' },
  { day: 19, topic: 'Parts Per Million', subtopic: 'Pharmacokinetics-1' },
  { day: 20, topic: 'Pharmacokinetics-2', subtopic: 'Dilution & Mixing' },
  { day: 21, topic: 'Bioavailability', subtopic: 'Infusion Rate, Drop Rate, Insulin Dose Calc' },
  { day: 22, topic: 'Q&A Discussion', subtopic: 'Androgens' },
  { day: 23, topic: 'Pituitary & Adrenal Hormones', subtopic: 'ADR Classification' },
  { day: 24, topic: 'Thyroid Hormones', subtopic: 'Immunosuppressants' },
  { day: 25, topic: 'Estrogens & OCP', subtopic: 'Medication Error' },
  { day: 26, topic: 'Study Designs & Clinical Trial', subtopic: 'Constipation & Diarrhea Drugs' },
  { day: 27, topic: 'Insulin & OHA', subtopic: 'Insulin Dosing, Pharmacogenomics' },
  { day: 28, topic: 'Insulin & OHA', subtopic: 'Insulin Dosing, Pharmacogenomics' },
  { day: 29, topic: 'Sedatives & Antidepressants', subtopic: 'Efficacy, Potency, Communication Skills' },
  { day: 30, topic: 'GA & LA', subtopic: 'Child Pugh & CHA₂DS₂VASc Score' },
  { day: 31, topic: 'Opioids', subtopic: 'Herbal Drugs, RF Value, Chromatography' },
  { day: 32, topic: 'Antipsychotics & Antimanic', subtopic: 'Pharmacoeconomics' },
  { day: 33, topic: 'Neurodegenerative Disorders', subtopic: 'Alcohol' },
  { day: 34, topic: 'Epilepsy', subtopic: 'Vitamins' },
  { day: 35, topic: 'RA, Osteoporosis & Gout', subtopic: 'Corrected Phenytoin Level' },
  { day: 36, topic: 'Microbiology Introduction', subtopic: 'Cell Wall Synthesis Inhibitors, Immunology' },
  { day: 37, topic: 'Microbiology', subtopic: 'Cell Wall Synthesis Inhibitors, Immunology' },
  { day: 38, topic: 'Protein Synthesis Inhibitors', subtopic: 'Transcription, Translation, DNA vs RNA' },
  { day: 39, topic: 'Fluoroquinolones & Anti-TB', subtopic: 'Antiprotozoal Agents' },
  { day: 40, topic: 'Antileprotic & Antifungal', subtopic: 'Sulfonamides, Bioequivalence' },
  { day: 41, topic: 'Antiviral & Anticancer', subtopic: 'Hydroxyl Group of Quinine' },
  { day: 42, topic: 'Vaccines', subtopic: 'SAR of Drugs' },
  { day: 43, topic: 'Ethics & Clinical Trial', subtopic: 'Off-Label Drug Use' },
  { day: 44, topic: 'Q&A Discussion', subtopic: 'Amino Acids' },
  { day: 45, topic: 'Final Review', subtopic: 'Comprehensive Revision' },
];

export function getTopicForDay(day: number): DayTopic {
  return DAY_SCHEDULE.find(d => d.day === day) || { day, topic: `Day ${day}` };
}

import type { PreAuthService } from "@/domain/plan-knowledge";

/** Services requiring pre-authorization: benefits overview p.10, items A–T, verbatim. */
export const PREAUTH_LIST_PAGE = 10;

export const rhusPreAuthList: PreAuthService[] = [
  { letter: "A", label: "Inpatient admissions (hospital, rehab, skilled nursing, extended care, mental health/substance use disorder)", quote: "Inpatient admissions (hospital, rehab, skilled … nursing, extended care, mental health/substance … use disorder)", benefitKeys: ["hospital_room", "icu", "skilled_nursing", "mental_health", "substance_use", "surgery"] },
  { letter: "B", label: "Transplants", quote: "Transplants", benefitKeys: ["transplants"] },
  { letter: "C", label: "Hospital stays over 48 hours", quote: "Hospital stays over 48 hours", benefitKeys: ["hospital_room"] },
  { letter: "D", label: "Dialysis", quote: "Dialysis", benefitKeys: ["dialysis"] },
  { letter: "E", label: "Chemotherapy, radiation therapy", quote: "Chemotherapy, radiation therapy", benefitKeys: ["oncology"] },
  { letter: "F", label: "Reconstructive or spinal surgery", quote: "Reconstructive or spinal surgery", benefitKeys: ["surgery"] },
  { letter: "G", label: "Hyperbaric oxygen treatments", quote: "Hyperbaric oxygen treatments", benefitKeys: ["hyperbaric_oxygen"] },
  { letter: "H", label: "Durable medical equipment (over 30-day rental or purchase) and insulin pumps", quote: "Durable medical equipment (over 30-day rental or … purchase) and insulin pumps", benefitKeys: ["dme", "diabetic_supplies"] },
  { letter: "I", label: "Substance use disorder programs (outpatient)", quote: "Substance use disorder programs (outpatient)", benefitKeys: ["substance_use"] },
  { letter: "J", label: "Outpatient surgery, procedures, or private duty nursing", quote: "Outpatient surgery, procedures, or private duty … nursing", benefitKeys: ["surgery", "day_surgery", "oral_surgery", "endoscopy_non_routine", "private_duty_nursing"] },
  { letter: "K", label: "Diagnostic testing (MRI/PET/CT)", quote: "Diagnostic testing (MRI/PET/CT)", benefitKeys: ["diagnostic_mri", "diagnostic_pet", "diagnostic_ct"] },
  { letter: "L", label: "Infusion services", quote: "Infusion services", benefitKeys: ["infusion"] },
  { letter: "M", label: "Home health care", quote: "Home health care", benefitKeys: ["home_health"] },
  { letter: "N", label: "Genetic testing (e.g., BRACA, BART)", quote: "Genetic testing (e.g., BRACA, BART)", benefitKeys: ["genetic_testing"] },
  { letter: "O", label: "Air/water ambulance", quote: "Air/water ambulance", benefitKeys: ["ambulance_emergency"] },
  { letter: "P", label: "Hospice care", quote: "Hospice care", benefitKeys: ["hospice"] },
  { letter: "Q", label: "Prosthetics", quote: "Prosthetics", benefitKeys: ["prosthetics"] },
  { letter: "R", label: "Injection therapy for pain programs", quote: "Injection therapy for pain programs", benefitKeys: ["injections"] },
  { letter: "S", label: "Treatment/surgery for morbid obesity", quote: "Treatment/surgery for morbid obesity", benefitKeys: [] },
  { letter: "T", label: "Gender dysphoria surgical treatment", quote: "Gender dysphoria surgical treatment", benefitKeys: [] },
];

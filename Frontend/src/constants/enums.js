export const SOMALILAND_REGIONS = [
  "Hargeisa",
  "Burao",
  "Berbera",
  "Borama",
  "Erigavo",
  "Las Anod",
  "Other",
];

// Display label pairing each city with its administrative region, e.g. "Hargeisa, Maroodi-Jeex".
// Filtering/storage stays keyed by city (SOMALILAND_REGIONS) since that's the granularity
// job seekers actually search by; this is presentation-only.
export const REGION_LABELS = {
  Hargeisa: "Hargeisa, Maroodi-Jeex",
  Burao: "Burao, Togdheer",
  Berbera: "Berbera, Sahil",
  Borama: "Borama, Awdal",
  Erigavo: "Erigavo, Sanaag",
  "Las Anod": "Las Anod, Sool",
  Other: "Other",
};

export const VOCATIONAL_CATEGORIES = [
  "Electrician",
  "Plumber",
  "Tailor",
  "IT Technician",
  "Carpenter",
  "Mechanic",
  "Mason",
  "Welder",
  "Driver",
  "Other",
];

export const EMPLOYMENT_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "apprenticeship",
];

export const PROFICIENCY_LEVELS = ["beginner", "intermediate", "expert"];

export const AVAILABILITY_OPTIONS = ["available", "employed", "not_looking"];

export const APPLICATION_STAGES = [
  "pending",
  "reviewed",
  "shortlisted",
  "interview_scheduled",
  "hired",
];

export const PAYMENT_METHODS = ["Zaad", "eDahab"];


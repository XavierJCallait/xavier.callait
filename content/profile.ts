export const PROFILE_TAGLINES = [
  "Software Engineer. ",
  "Full Stack Developer. ",
  "Customer driven. ",
] as const;

export type ProfileTagline = (typeof PROFILE_TAGLINES)[number];

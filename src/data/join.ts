export interface Step {
  num: string;
  title: string;
  body: string;
}

export const requirements: string[] = [
  "100+ hours in Squad",
  "Working microphone — communication is mandatory",
  "Age 18 or older",
  "EU based (or able to play EU servers with low ping)",
  "Willingness to learn, adapt, and put the team first",
];

export const steps: Step[] = [
  {
    num: "01",
    title: "APPLY ON DISCORD",
    body: "Join our Discord server and open a recruitment ticket to start your application.",
  },
  {
    num: "02",
    title: "INTERVIEW",
    body: "A brief voice interview with clan leadership. We want to know how you think and play — not your stats.",
  },
  {
    num: "03",
    title: "TRIAL PERIOD",
    body: "Approved applicants join as Recruit for a trial period playing alongside the unit.",
  },
  {
    num: "04",
    title: "FULL MEMBER",
    body: "Pass the trial and you're in. Welcome to RATS.",
  },
];

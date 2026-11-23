export type Analysis = { colors: string; typography: string; style: string; composition: string; elements: string; summary: string };
export type Profile = { id: string; name: string; colors: string; notes: string; analysis?: Analysis; analysisStale?: boolean; logoData?: string; referenceFolder?: string };
export type Entry = { id: string; date: string; description: string; segment: string; format: string; profileId?: string; profileName?: string };

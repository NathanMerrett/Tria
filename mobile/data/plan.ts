export type Workout = {
  id: string;
  weekId: string; // FK
  name: string;
  description?: string;
  type: 'Swim' | 'Bike' | 'Run' | 'Brick'; // <-- added Brick
  durationMinutes?: number; // for Brick: total time
  distanceKm?: number;      // for Brick: usually undefined; details in description
  completed?: boolean;
  date: string;
};


export type Week = {
  id: string;
  planId: string; // FK
  number: number; // display-only, can change; not identity
  startDate: string; // ISO
  endDate: string;   // ISO
};

export type Plan = {
  id: string;
  userId: string; // owner
  name: string;
  discipline: 'Triathlon';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  startsOn: string; // ISO
  endsOn: string;   // ISO
};

// --- Plan ---
export const plan: Plan = {
  id: 'plan_tri_sprint_2025',
  userId: 'user_123',
  name: 'Sprint Tri — 12 Weeks',
  discipline: 'Triathlon',
  level: 'Intermediate',
  startsOn: '2025-09-01',
  endsOn: '2025-11-23',
};

export const weeks: Week[] = [
  { id: 'week_001', planId: plan.id, number: 1, startDate: '2025-09-01', endDate: '2025-09-07' },
  { id: 'week_002', planId: plan.id, number: 2, startDate: '2025-09-08', endDate: '2025-09-14' },
  { id: 'week_003', planId: plan.id, number: 3, startDate: '2025-09-15', endDate: '2025-09-21' },
  { id: 'week_004', planId: plan.id, number: 4, startDate: '2025-09-22', endDate: '2025-09-28' },
  { id: 'week_005', planId: plan.id, number: 5, startDate: '2025-09-29', endDate: '2025-10-05' },
  { id: 'week_006', planId: plan.id, number: 6, startDate: '2025-10-06', endDate: '2025-10-12' },
];

export const workouts: Workout[] = [
  // Week 1 — Base (Mon/Wed/Thu/Sat)
  { id: 'w001', weekId: 'week_001', date: '2025-09-01', name: 'Swim — Technique & Drills', type: 'Swim', durationMinutes: 40, distanceKm: 1.6, description: 'CSS test + drills: 8×50m drill, 6×100m easy; focus on body position.', completed: true},
  { id: 'w002', weekId: 'week_001', date: '2025-09-03', name: 'Bike — Endurance Z2', type: 'Bike', durationMinutes: 75, distanceKm: 30, description: 'Steady Zone 2. Cadence 85–95rpm.', completed: true },
  { id: 'w003', weekId: 'week_001', date: '2025-09-04', name: 'Run — Easy Base', type: 'Run', durationMinutes: 45, distanceKm: 8, description: 'Conversational pace. 6×20s strides at end.', completed: true },
  { id: 'w004', weekId: 'week_001', date: '2025-09-06', name: 'Brick — Intro', type: 'Brick', durationMinutes: 55, distanceKm: 8, description: 'Bike 45min Z2 → Run 10min easy. Quick transition; focus on cadence off-bike.', completed: true },

  // Week 2 — Base
  { id: 'w005', weekId: 'week_002', date: '2025-09-08', name: 'Swim — Open Water Skills', type: 'Swim', durationMinutes: 45, distanceKm: 1.8, description: 'Sighting every 6–8 strokes; 8×100m @ CSS+5s, 20s rest.', completed: true },
  { id: 'w006', weekId: 'week_002', date: '2025-09-10', name: 'Bike — Sweet Spot', type: 'Bike', durationMinutes: 75, distanceKm: 35, description: '3×10min @ ~88–92% FTP (SS), 5min easy between.', completed: true },
  { id: 'w007', weekId: 'week_002', date: '2025-09-11', name: 'Run — Tempo Intro', type: 'Run', durationMinutes: 50, distanceKm: 9, description: '15min easy + 2×10min tempo (10k pace), 3min jog between + cool-down.' },
  { id: 'w008', weekId: 'week_002', date: '2025-09-13', name: 'Brick — Cadence Focus', type: 'Brick', durationMinutes: 75, distanceKm: 8, description: 'Bike 60min Z2 with 4×3min high cadence → Run 15min easy.' },

  // Week 3 — Base+
  { id: 'w009', weekId: 'week_003', date: '2025-09-15', name: 'Swim — Endurance', type: 'Swim', durationMinutes: 50, distanceKm: 2.0, description: '3×400m steady, 200m pull, 8×50m fast/easy alternation.' },
  { id: 'w010', weekId: 'week_003', date: '2025-09-17', name: 'Bike — Endurance Long', type: 'Bike', durationMinutes: 90, distanceKm: 40, description: 'Z2 with 2×8min low-cadence climbs @ Z3.' },
  { id: 'w011', weekId: 'week_003', date: '2025-09-18', name: 'Run — Progression', type: 'Run', durationMinutes: 55, distanceKm: 10, description: 'Start easy, finish last 15min at HM pace.' },
  { id: 'w012', weekId: 'week_003', date: '2025-09-20', name: 'Brick — Tempo Off-Bike', type: 'Brick', durationMinutes: 80, distanceKm: 8, description: 'Bike 60min incl. 2×8min Z3 → Run 20min steady (between easy & tempo).' },

  // Week 4 — Recovery (↓ volume)
  { id: 'w013', weekId: 'week_004', date: '2025-09-22', name: 'Swim — Easy Mix', type: 'Swim', durationMinutes: 40, distanceKm: 1.5, description: 'Drills + pull buoy; relaxed aerobic.' },
  { id: 'w014', weekId: 'week_004', date: '2025-09-24', name: 'Bike — Recovery Spin', type: 'Bike', durationMinutes: 60, distanceKm: 25, description: 'Keep it light; high cadence. Optional coffee stop ☕.' },
  { id: 'w015', weekId: 'week_004', date: '2025-09-25', name: 'Run — Easy', type: 'Run', durationMinutes: 40, distanceKm: 7, description: 'Soft surfaces if possible; 4×20s strides.' },
  { id: 'w016', weekId: 'week_004', date: '2025-09-27', name: 'Brick — Short', type: 'Brick', durationMinutes: 55, description: 'Bike 45min easy → Run 10min shuffle; keep HR low.' },

  // Week 5 — Build
  { id: 'w017', weekId: 'week_005', date: '2025-09-29', name: 'Swim — Threshold Set', type: 'Swim', durationMinutes: 50, distanceKm: 2.0, description: '12×100m @ CSS with 15s rest; pull/paddles optional.' },
  { id: 'w018', weekId: 'week_005', date: '2025-10-01', name: 'Bike — Threshold Blocks', type: 'Bike', durationMinutes: 80, distanceKm: 38, description: '3×8min @ 95–100% FTP, 5min easy between.' },
  { id: 'w019', weekId: 'week_005', date: '2025-10-02', name: 'Run — Tempo Intervals', type: 'Run', durationMinutes: 60, distanceKm: 10.5, description: '15min easy + 3×8min tempo (10k pace), 3min jog + cool-down.' },
  { id: 'w020', weekId: 'week_005', date: '2025-10-04', name: 'Brick — Steady→Tempo', type: 'Brick', durationMinutes: 95, description: 'Bike 75min Z2–Z3 → Run 20min steady (close to tempo).' },

  // Week 6 — Build
  { id: 'w021', weekId: 'week_006', date: '2025-10-06', name: 'Swim — Paddles/Pull', type: 'Swim', durationMinutes: 55, distanceKm: 2.1, description: '5×200m steady + 8×50m fast; focus on catch.' },
  { id: 'w022', weekId: 'week_006', date: '2025-10-08', name: 'Bike — Endurance + Surges', type: 'Bike', durationMinutes: 90, distanceKm: 45, description: 'Z2 with 6×2min Z4 surges, 3min easy between.' },
  { id: 'w023', weekId: 'week_006', date: '2025-10-09', name: 'Run — Aerobic Long', type: 'Run', durationMinutes: 65, distanceKm: 12, description: 'Keep it easy; last 10min steady.' },
  { id: 'w024', weekId: 'week_006', date: '2025-10-11', name: 'Brick — Build Run', type: 'Brick', durationMinutes: 85, description: 'Bike 60min Z2 → Run 25min building to tempo in last 8min.' },
];

// Helpers as if you had an API — all ID-based
export const getUserActivePlan = (userId: string) => (userId === plan.userId ? plan : undefined);
export const getWeeksByPlan = (planId: string) => weeks.filter(w => w.planId === planId);
export const getWeekById = (weekId: string) => weeks.find(w => w.id === weekId);
export const getWorkoutsByWeek = (weekId: string) => workouts.filter(w => w.weekId === weekId);
export const getAdjacentWeekIds = (weekId: string) => {
  const sorted = weeks.filter(w => w.planId === plan.id).sort((a,b) => a.number - b.number);
  const idx = sorted.findIndex(w => w.id === weekId);
  return {
    prev: idx > 0 ? sorted[idx - 1].id : undefined,
    next: idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1].id : undefined,
  };
};
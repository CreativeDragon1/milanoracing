export const goalStatuses = ['Not assessed', 'Planned', 'In progress', 'Achieved', 'Needs attention'] as const;
export const taskStatuses = ['To do', 'In progress', 'Done'] as const;
export const priorities = ['Low', 'Medium', 'High'] as const;
export const raciCodes = ['', 'R', 'A', 'C', 'I'] as const;
export const categories = ['Environmental', 'Social', 'Economic'] as const;
export type BaseRow = { id: string; revision: number; updated_at: string };
export type Task = BaseRow & { title: string; owner: string; due_date: string | null; status: typeof taskStatuses[number]; priority: typeof priorities[number]; notes: string };
export type Goal = BaseRow & { title: string; category: typeof categories[number]; status: typeof goalStatuses[number]; evidence: string; position: number };
export type Raci = BaseRow & { activity: string; sustainability: string; principal: string; digital: string; position: number };
export type Impact = BaseRow & { activity: string; aspect: string; co2_tonnes: number | null; consequence: number | null; probability: number | null; evidence: string; position: number };
export type Tables = { admin_tasks: Task; admin_goals: Goal; admin_raci: Raci; admin_impacts: Impact };
export type Table = keyof Tables;
export type Workspace = { [K in Table]: Tables[K][] };
export const emptyWorkspace = (): Workspace => ({ admin_tasks: [], admin_goals: [], admin_raci: [], admin_impacts: [] });
export function riskScore(row: Impact) { return row.consequence === null || row.probability === null ? null : row.consequence * row.probability; }
export function riskBand(score: number | null) { return score === null ? 'Not assessed' : score >= 50 ? 'High' : score >= 20 ? 'Medium' : 'Low'; }
export function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
export function overdue(task: Task) { return task.status !== 'Done' && !!task.due_date && task.due_date < today(); }

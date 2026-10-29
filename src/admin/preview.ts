import { categories, type Workspace } from './types';
// Only dynamically imported in Vite development; no real team information.
export function previewWorkspace(): Workspace {
  const base = () => ({ id: crypto.randomUUID(), revision: 1, updated_at: new Date().toISOString() });
  const goals = [
    ['Minimise material waste', 'Encourage component reuse', 'Responsible material sourcing', 'Environmental conservation'],
    ['Team development and wellbeing', 'Promote STEM education', 'Build stakeholder relationships', 'Community engagement'],
    ['Conserve finite resources', 'Support local businesses', 'Maintain financial sustainability', 'Responsible merchandise production'],
  ];
  const activities = ['International return flights', 'Train travel', 'Bus travel', 'Accommodation', 'Food', 'Electricity used at school', 'Material consumption', 'Resource waste', 'Car transport', 'Bearings transport', '3D printing transport', 'Wheel transport', 'Foam block transport', 'Uniform transport', 'Canister discharge during testing'];
  return {
    admin_tasks: [],
    admin_goals: goals.flatMap((group, i) => group.map((title, j) => ({ ...base(), title, category: categories[i], status: 'Not assessed' as const, evidence: '', position: i*4+j }))),
    admin_raci: ['Sustainable partner acquisition','Strategy','Energy & resource efficiency','Carbon credits','Social sustainability','Economic sustainability','Reporting'].map((activity, position) => ({ ...base(), activity, position, sustainability: '', principal: '', digital: '' })),
    admin_impacts: activities.map((activity, position) => ({ ...base(), activity, position, aspect: position === 7 ? 'Waste production' : position === 14 ? 'Direct CO₂ emissions' : position === 3 || position === 5 ? 'Resource use (energy / electricity)' : position === 4 ? 'Resource use (agriculture)' : position === 6 ? 'Resource use (manufacturing)' : 'Resource use (transport fuel)', co2_tonnes: null, consequence: null, probability: null, evidence: '' })),
  };
}

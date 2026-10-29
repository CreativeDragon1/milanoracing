begin;
create schema if not exists private;
revoke all on schema private from public;

-- The six addresses are inserted separately; never store the real allowlist in Git.
create table private.admin_members (
  email text primary key check (email = lower(trim(email))),
  created_at timestamptz not null default now()
);
revoke all on private.admin_members from public, anon, authenticated;
alter table private.admin_members enable row level security;

create function public.is_milano_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from auth.users u join private.admin_members m on m.email = lower(u.email)
    where u.id = auth.uid() and u.email_confirmed_at is not null
  );
$$;
revoke all on function public.is_milano_admin() from public;
grant execute on function public.is_milano_admin() to authenticated;

create table public.admin_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 200),
  owner text not null default '' check (length(owner) <= 100),
  due_date date,
  status text not null default 'To do' check (status in ('To do','In progress','Done')),
  priority text not null default 'Medium' check (priority in ('Low','Medium','High')),
  notes text not null default '' check (length(notes) <= 5000),
  revision integer not null default 1,
  updated_at timestamptz not null default now()
);
create table public.admin_goals (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 200),
  category text not null check (category in ('Environmental','Social','Economic')),
  status text not null default 'Not assessed' check (status in ('Not assessed','Planned','In progress','Achieved','Needs attention')),
  evidence text not null default '' check (length(evidence) <= 5000),
  position integer not null default 0,
  revision integer not null default 1,
  updated_at timestamptz not null default now(),
  constraint achieved_requires_evidence check (status <> 'Achieved' or length(trim(evidence)) > 0)
);
create table public.admin_raci (
  id uuid primary key default gen_random_uuid(),
  activity text not null check (length(trim(activity)) between 1 and 200),
  sustainability text not null default '' check (sustainability in ('','R','A','C','I')),
  principal text not null default '' check (principal in ('','R','A','C','I')),
  digital text not null default '' check (digital in ('','R','A','C','I')),
  position integer not null default 0,
  revision integer not null default 1,
  updated_at timestamptz not null default now()
);
create table public.admin_impacts (
  id uuid primary key default gen_random_uuid(),
  activity text not null check (length(trim(activity)) between 1 and 200),
  aspect text not null default '' check (length(aspect) <= 300),
  co2_tonnes numeric check (co2_tonnes >= 0 and co2_tonnes < 1000000000),
  consequence integer check (consequence between 1 and 10),
  probability integer check (probability between 1 and 10),
  evidence text not null default '' check (length(evidence) <= 5000),
  position integer not null default 0,
  revision integer not null default 1,
  updated_at timestamptz not null default now()
);

create function private.admin_stamp() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  if tg_op = 'UPDATE' then new.revision := old.revision + 1;
  else new.revision := 1; end if;
  return new;
end;
$$;
do $$
declare t text;
begin
  foreach t in array array['admin_tasks','admin_goals','admin_raci','admin_impacts'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from public, anon, authenticated', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('create policy approved_members_only on public.%I for all to authenticated using ((select public.is_milano_admin())) with check ((select public.is_milano_admin()))', t);
    execute format('create trigger admin_stamp before insert or update on public.%I for each row execute function private.admin_stamp()', t);
  end loop;
end $$;

insert into public.admin_goals (title,category,position) values
('Minimise material waste','Environmental',0),
('Encourage component reuse','Environmental',1),
('Responsible material sourcing','Environmental',2),
('Environmental conservation','Environmental',3),
('Team development and wellbeing','Social',4),
('Promote STEM education','Social',5),
('Build stakeholder relationships','Social',6),
('Community engagement','Social',7),
('Conserve finite resources','Economic',8),
('Support local businesses','Economic',9),
('Maintain financial sustainability','Economic',10),
('Responsible merchandise production','Economic',11);
insert into public.admin_raci (activity,position) values
('Sustainable partner acquisition',0),('Strategy',1),('Energy & resource efficiency',2),
('Carbon credits',3),('Social sustainability',4),('Economic sustainability',5),('Reporting',6);
insert into public.admin_impacts (activity,aspect,position) values
('International return flights','Resource use (transport fuel)',0),
('Train travel','Resource use (transport fuel)',1),
('Bus travel','Resource use (transport fuel)',2),
('Accommodation','Resource use (energy / electricity)',3),
('Food','Resource use (agriculture)',4),
('Electricity used at school','Resource use (energy / electricity)',5),
('Material consumption','Resource use (manufacturing)',6),
('Resource waste','Waste production',7),
('Car transport','Resource use (transport fuel)',8),
('Bearings transport','Resource use (transport fuel)',9),
('3D printing transport','Resource use (transport fuel)',10),
('Wheel transport','Resource use (transport fuel)',11),
('Foam block transport','Resource use (transport fuel)',12),
('Uniform transport','Resource use (transport fuel)',13),
('Canister discharge during testing','Direct CO₂ emissions',14);
commit;

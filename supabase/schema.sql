-- Esquema de la base de datos del gestor de cobranza.
-- Ejecutar completo en el SQL Editor de Supabase (una sola vez).
--
-- IMPORTANTE: las uniones literales de src/types/index.ts y estos enums son
-- espejo uno del otro. Cualquier cambio se hace en AMBOS lados.
-- Para agregar valores a un enum existente: ALTER TYPE public.<enum> ADD VALUE '<valor>';

-- === ENUMS ===
create type public.case_status as enum
  ('Active','InLawsuit','PaymentAgreement','Paid','Closed','Archived');

create type public.debtor_id_type as enum ('C.C.','NIT','Pasaporte');

create type public.guarantee_type as enum ('Hipotecaria','Prendaria','Fianza','Personal');

create type public.activity_type as enum
  ('Demanda Radicada','Auto Admisorio','Auto Inadmisorio','Notificación Realizada',
   'Respuesta Demanda','Audiencia Agendada','Audiencia Realizada','Sentencia Emitida',
   'Recurso Presentado','Medida Cautelar Decretada','Embargo Realizado',
   'Remate Realizado','Pago Recibido','Caso Archivado');

-- === TABLAS ===
create table public.cases (
  id uuid primary key default gen_random_uuid(),
  debtor_name text not null,
  debtor_id_type public.debtor_id_type not null,
  debtor_id_number text not null,
  debtor_address text not null default '',
  debtor_phones text not null default '',
  debtor_emails text not null default '',
  creditor_name text not null,
  obligation_number text not null,
  initial_amount numeric(15,2) not null check (initial_amount >= 0),
  guarantee_type public.guarantee_type[] not null default '{}',
  responsible_lawyer text not null,
  original_due_date date not null,
  start_date_of_delinquency date not null,
  initial_comments text not null default '',
  status public.case_status not null default 'Active',
  last_activity_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  type public.activity_type not null,
  date date not null,
  description text not null default '',
  next_step text not null default '',
  next_step_deadline date,
  related_document text, -- path dentro del bucket case-documents
  created_at timestamptz not null default now()
);

create index activities_case_id_idx on public.activities(case_id);
create index cases_status_idx on public.cases(status);

-- === TRIGGER: last_activity_date automático al registrar actuación ===
create or replace function public.touch_case_last_activity()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.cases set last_activity_date = now() where id = new.case_id;
  return new;
end $$;

create trigger activities_touch_case
  after insert on public.activities
  for each row execute function public.touch_case_last_activity();

-- === RLS: solo usuarios autenticados (sin políticas para anon => anon no ve nada) ===
alter table public.cases enable row level security;
alter table public.activities enable row level security;

create policy "cases_authenticated_all" on public.cases
  for all to authenticated using (true) with check (true);

create policy "activities_authenticated_all" on public.activities
  for all to authenticated using (true) with check (true);

-- === STORAGE: bucket privado para documentos de casos y actuaciones ===
insert into storage.buckets (id, name, public) values ('case-documents','case-documents', false);

create policy "docs_read_auth" on storage.objects
  for select to authenticated using (bucket_id = 'case-documents');
create policy "docs_insert_auth" on storage.objects
  for insert to authenticated with check (bucket_id = 'case-documents');
create policy "docs_delete_auth" on storage.objects
  for delete to authenticated using (bucket_id = 'case-documents');

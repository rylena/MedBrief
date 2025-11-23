drop table if exists summaries;

create table summaries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  original_text text,
  summary text,
  key_terms jsonb,
  audio_url text
);

alter table summaries enable row level security;

create policy "Users can insert their own summaries" on summaries
  for insert with check (auth.uid() = user_id);

create policy "Users can view their own summaries" on summaries
  for select using (auth.uid() = user_id);

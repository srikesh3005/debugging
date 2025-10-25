-- Supabase Database Schema for Quiz App

-- Create profiles table
create table public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    email text not null,
    full_name text,
    role text not null default 'user' check (role in ('user', 'admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create quiz_attempts table
create table public.quiz_attempts (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    score integer not null,
    total_questions integer not null,
    percentage integer not null,
    time_taken integer not null, -- in seconds
    completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id) -- Ensure each user can only have one attempt
);

-- Create quiz_answers table
create table public.quiz_answers (
    id uuid default gen_random_uuid() primary key,
    attempt_id uuid references public.quiz_attempts(id) on delete cascade not null,
    question_id integer not null,
    selected_answer text not null check (selected_answer in ('A', 'B', 'C', 'D')),
    correct_answer text not null check (correct_answer in ('A', 'B', 'C', 'D')),
    is_correct boolean not null
);

-- Create anti-cheat logs table
create table public.anti_cheat_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    attempt_id uuid references public.quiz_attempts(id) on delete cascade,
    event_type text not null check (event_type in ('tab_switch', 'fullscreen_exit', 'copy_attempt', 'paste_attempt', 'right_click', 'suspicious_key', 'text_selection')),
    event_details text,
    timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security Policies

-- Profiles policies
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
    for select using (true);

create policy "Users can insert their own profile." on profiles
    for insert with check (auth.uid() = id);

create policy "Users can update their own profile." on profiles
    for update using (auth.uid() = id);

-- Quiz attempts policies
alter table public.quiz_attempts enable row level security;

create policy "Users can view their own quiz attempts." on quiz_attempts
    for select using (auth.uid() = user_id);

create policy "Users can insert their own quiz attempts." on quiz_attempts
    for insert with check (auth.uid() = user_id);

-- Admins can view all quiz attempts
create policy "Admins can view all quiz attempts." on quiz_attempts
    for select using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- Quiz answers policies
alter table public.quiz_answers enable row level security;

create policy "Users can view their own quiz answers." on quiz_answers
    for select using (
        exists (
            select 1 from public.quiz_attempts
            where id = quiz_answers.attempt_id and user_id = auth.uid()
        )
    );

create policy "Users can insert their own quiz answers." on quiz_answers
    for insert with check (
        exists (
            select 1 from public.quiz_attempts
            where id = quiz_answers.attempt_id and user_id = auth.uid()
        )
    );

-- Admins can view all quiz answers
create policy "Admins can view all quiz answers." on quiz_answers
    for select using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- Anti-cheat logs policies
alter table public.anti_cheat_logs enable row level security;

create policy "Users can insert their own anti-cheat logs." on anti_cheat_logs
    for insert with check (auth.uid() = user_id);

-- Admins can view all anti-cheat logs
create policy "Admins can view all anti-cheat logs." on anti_cheat_logs
    for select using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- Create indexes for better performance
create index quiz_attempts_user_id_idx on quiz_attempts(user_id);
create index quiz_attempts_completed_at_idx on quiz_attempts(completed_at);
create index quiz_answers_attempt_id_idx on quiz_answers(attempt_id);
create index anti_cheat_logs_user_id_idx on anti_cheat_logs(user_id);
create index anti_cheat_logs_attempt_id_idx on anti_cheat_logs(attempt_id);
create index anti_cheat_logs_timestamp_idx on anti_cheat_logs(timestamp);

-- Create a function to handle new user signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to automatically create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a view for admin dashboard
create view public.quiz_results_view as
select 
    qa.id,
    qa.completed_at,
    qa.score,
    qa.total_questions,
    qa.percentage,
    qa.time_taken,
    p.full_name,
    p.email,
    count(qans.id) as total_answers
from public.quiz_attempts qa
join public.profiles p on qa.user_id = p.id
left join public.quiz_answers qans on qa.id = qans.attempt_id
group by qa.id, qa.completed_at, qa.score, qa.total_questions, qa.percentage, qa.time_taken, p.full_name, p.email
order by qa.completed_at desc;
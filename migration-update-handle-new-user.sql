-- Update the handle_new_user function to include phone_number
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, phone_number, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone_number', 'user');
  return new;
end;
$$ language plpgsql security definer;

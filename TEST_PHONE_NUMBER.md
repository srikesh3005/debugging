# Phone Number Storage Test

## Issue
Phone number appears empty in Supabase profiles table.

## Storage Locations
1. **Auth User Metadata**: `auth.users.raw_user_meta_data->>'phone_number'`
2. **Profiles Table**: `public.profiles.phone_number`

## Check List

### Step 1: Check if phone number is in auth.users metadata
Run this SQL in Supabase SQL Editor:
```sql
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'phone_number' as phone_number,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;
```

### Step 2: Check if phone number is in profiles table
```sql
SELECT 
  id, 
  email, 
  full_name, 
  phone_number,
  created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 10;
```

### Step 3: Update the trigger function
Run this migration:
```sql
-- Update the handle_new_user function to include phone_number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone_number, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'phone_number', 
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Step 4: For existing users, manually update profiles table
If you already have users without phone numbers in the profiles table:
```sql
UPDATE public.profiles p
SET phone_number = (
  SELECT raw_user_meta_data->>'phone_number' 
  FROM auth.users u 
  WHERE u.id = p.id
)
WHERE phone_number IS NULL;
```

## Frontend Code Verification
The SignupPage.tsx correctly:
1. Collects phone number with numeric validation
2. Passes it to signUp(email, password, fullName, phoneNumber)
3. AuthContext stores it in user metadata as 'phone_number'

## Troubleshooting

If phone number is still empty after signup:
1. Make sure the migration has been run
2. Check browser console for any errors during signup
3. Try signing up a new test user
4. Verify the phone number field isn't empty when submitting the form

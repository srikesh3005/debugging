ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS is_test boolean DEFAULT false;

DROP INDEX IF EXISTS quiz_attempts_user_id_key;

CREATE UNIQUE INDEX quiz_attempts_user_id_key ON public.quiz_attempts(user_id) WHERE is_test = false;

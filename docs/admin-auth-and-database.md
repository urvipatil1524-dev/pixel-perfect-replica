# Admin access and Supabase setup

## 1. Add local environment keys

Copy `.env.example` to `.env` and replace the placeholders with your Clerk and Supabase project values. Keep `CLERK_SECRET_KEY` and `SUPABASE_SECRET_KEY` on the server only. Never add them to a `VITE_` variable or commit `.env`.

## 2. Configure Clerk

1. Create or select a Clerk application and add its publishable key and secret key to `.env`.
2. Create the admin user through Clerk sign-in.
3. In Clerk Dashboard → Users, open that user and set **Public metadata** to:

   ```json
   { "role": "admin" }
   ```

Only users with this server-controlled public metadata role can open `/admin` or call its data functions. Do not set the role in user-editable metadata.

## 3. Configure Supabase

1. Add the project URL and **secret** key to `.env`. The secret key is used only inside server functions.
2. Run `supabase/migrations/20261010000000_create_requests.sql` in the Supabase SQL Editor (or apply it with the Supabase CLI).
3. Restart the dev server after changing environment variables.

Request submissions and tracking lookups use server functions. Admin list and update operations check the Clerk admin role on every call. The `requests` table has RLS enabled and denies direct access to browser `anon` and `authenticated` roles.

## Route behavior

The Admin item is not shown in the site navigation. `/admin` is the only admin route; signed-out visitors are sent to `/sign-in`, and signed-in non-admins see an access-denied message.

begin;
-- Configure this as Authentication > Auth Hooks > Before User Created.
-- Only Supabase Auth can call it; the website cannot enumerate the allowlist.
create function public.before_milano_user_created(event jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from private.admin_members where email = lower(trim(event->'user'->>'email'))) then
    return '{}'::jsonb;
  end if;
  return jsonb_build_object('error', jsonb_build_object('http_code',403,'message','This account is not approved for the team workspace.'));
end;
$$;
revoke all on function public.before_milano_user_created(jsonb) from public, anon, authenticated;
grant execute on function public.before_milano_user_created(jsonb) to supabase_auth_admin;
commit;

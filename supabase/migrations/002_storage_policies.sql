-- Storage RLS: public read (so the live site can serve uploaded photos/
-- audio), writes restricted to authenticated backoffice users.
drop policy if exists "public can read photos bucket" on storage.objects;
create policy "public can read photos bucket" on storage.objects for select
  using (bucket_id = 'photos');
drop policy if exists "authenticated can write photos bucket" on storage.objects;
create policy "authenticated can write photos bucket" on storage.objects for insert
  with check (bucket_id = 'photos' and auth.role() = 'authenticated');
drop policy if exists "authenticated can update photos bucket" on storage.objects;
create policy "authenticated can update photos bucket" on storage.objects for update
  using (bucket_id = 'photos' and auth.role() = 'authenticated');
drop policy if exists "authenticated can delete photos bucket" on storage.objects;
create policy "authenticated can delete photos bucket" on storage.objects for delete
  using (bucket_id = 'photos' and auth.role() = 'authenticated');

drop policy if exists "public can read music bucket" on storage.objects;
create policy "public can read music bucket" on storage.objects for select
  using (bucket_id = 'music');
drop policy if exists "authenticated can write music bucket" on storage.objects;
create policy "authenticated can write music bucket" on storage.objects for insert
  with check (bucket_id = 'music' and auth.role() = 'authenticated');
drop policy if exists "authenticated can update music bucket" on storage.objects;
create policy "authenticated can update music bucket" on storage.objects for update
  using (bucket_id = 'music' and auth.role() = 'authenticated');
drop policy if exists "authenticated can delete music bucket" on storage.objects;
create policy "authenticated can delete music bucket" on storage.objects for delete
  using (bucket_id = 'music' and auth.role() = 'authenticated');

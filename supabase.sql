-- Rode no Supabase: SQL Editor > New query. Troque SEU_EMAIL_AQUI pelo e-mail do seu login.
create table if not exists public.site_content (
  key text primary key, value text not null, updated_at timestamptz default now());
alter table public.site_content enable row level security;
create policy "leitura publica" on public.site_content for select using (true);
create policy "so o admin escreve" on public.site_content for all to authenticated
  using ((auth.jwt() ->> 'email') = 'instabotsklp@gmail.com') with check ((auth.jwt() ->> 'email') = 'instabotsklp@gmail.com');

insert into storage.buckets (id, name, public) values ('site-images','site-images',true) on conflict do nothing;
create policy "imagens publicas" on storage.objects for select using (bucket_id = 'site-images');
create policy "so o admin envia imagens" on storage.objects for all to authenticated
  using (bucket_id='site-images' and (auth.jwt() ->> 'email') = 'SEU_EMAIL_AQUI')
  with check (bucket_id='site-images' and (auth.jwt() ->> 'email') = 'SEU_EMAIL_AQUI');

-- Bir kullanıcıyı yönetici yapar.
-- 1) Supabase > Authentication > Users > "Add user" ile e-posta + şifre oluştur
--    ("Auto Confirm User" işaretli olsun).
-- 2) Aşağıdaki e-postayı değiştirip SQL Editor'de çalıştır.

insert into public.admins (user_id)
select id from auth.users where email = 'ornek@eposta.com'
on conflict (user_id) do nothing;

-- Yöneticiliği kaldırmak için:
-- delete from public.admins
-- where user_id = (select id from auth.users where email = 'ornek@eposta.com');

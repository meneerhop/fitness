# /login submap setup

Plaats de hele map **/login** in de root van je site (of in `docs/login` voor GitHub Pages).

## Redirects in Supabase
Authentication → **URL Configuration**:
- **Site URL:** `https://www.moffel.fit`
- **Redirect URLs:** `https://www.moffel.fit/login/auth/callback.html` (en evt. je lokale test-URL)

## Vervang je keys
Open `login/js/supabaseClient.js` en zet daar jouw `SUPABASE_URL` en `SUPABASE_ANON_KEY`.

## Paden
- Alle bestanden verwijzen **relatief** binnen /login/
- Logout en auth callback sturen naar `/login/`

## Gebruik
- Ga naar `https://www.moffel.fit/login/` om in te loggen.
- `profile.html` toont/opslaat je profiel en “laatst berekende caloriebehoefte”.
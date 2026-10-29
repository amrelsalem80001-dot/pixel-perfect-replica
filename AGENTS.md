<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Load public platform data through a publishable-client server function and shared Query cache; use owner-scoped browser Cloud queries for personal data to keep SSR public and secrets server-only.
- Keep XP in a separately protected member_xp table; profiles may update identity fields only, so editing a profile cannot elevate rank or community permissions.
- Store profile images in private owner folders and resolve signed URLs on account reads because the workspace disallows public buckets.
- Share tier rendering through member-badge and rank calculations through tiers so identity displays follow one rule set.

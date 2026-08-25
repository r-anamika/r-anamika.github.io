# Anamika Rajput

Personal portfolio for Anamika Rajput, Quality Analyst at Continuum Global Pvt. Ltd. (CGXI), joining Google Operations Center on 26 September 2026.

## Live now — share this URL

**https://r-anamika.github.io/ranamikagithub.io/**

GitHub Pages is enabled (`main` / root) and the build is green. Page, CSS, JS, images, and the résumé PDF all return 200.

## Why not `ranamika.github.io`?

`https://ranamika.github.io` can only exist for the GitHub **username** `ranamika`. That username already belongs to a different account ([github.com/ranamika](https://github.com/ranamika)). This portfolio lives on **r-anamika**, so the shortest possible hostname here is:

`https://r-anamika.github.io`

## To get the short URL (owner / admin only)

Kunal is a collaborator with push access but no admin rights, so he cannot rename the repo. Logged in as **r-anamika**:

1. Open [github.com/r-anamika/ranamikagithub.io/settings](https://github.com/r-anamika/ranamikagithub.io/settings)
2. Under **Repository name**, rename to exactly `r-anamika.github.io` → **Rename**

That is the only step. Pages is already on and follows the rename automatically. Within a minute or two the site answers at:

**https://r-anamika.github.io**

After the rename, drop the `/ranamikagithub.io` segment from the three absolute URLs in `index.html` (`canonical`, `og:url`, `og:image`) so link previews keep working. Nothing else in the site uses absolute paths.

## Local

Source lives at `D:\Cursor wale hai hum\projects\r-anamika.github.io`.

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

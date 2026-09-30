# Anamika Rajput

Personal portfolio for Anamika Rajput, Tech Process Senior Associate at Google Operations Center (Gurugram) since September 2026; previously Quality Analyst at Continuum Global Pvt. Ltd. (CGXI).

## Live — share this URL

**https://r-anamika.github.io**

The repo is named `r-anamika.github.io`, which makes it the GitHub **user site** for the `r-anamika` account, so it serves from the root with no path segment. Pages deploys from `main` / root.

> Note: `ranamika.github.io` (no hyphen) is not obtainable — a `*.github.io` hostname is the GitHub username, and `ranamika` belongs to a different account. `r-anamika.github.io` is the shortest URL available here.

## Local

Source lives at `D:\Cursor wale hai hum\projects\r-anamika.github.io`.

```bash
python -m http.server 8081
```

Then visit `http://localhost:8081`.

## Résumé

`assets/resume/Anamika-Rajput-Resume.pdf` is generated, not hand-edited. Change the facts in
`tools/build_resume.py` and rebuild:

```bash
pip install reportlab && python tools/build_resume.py
```

The script refuses to write a PDF whose content spills past page one, so the résumé stays a
one-pager. Keep its job titles and dates in step with `index.html` — they are the same facts.

## Notes

- `index.html` carries three absolute URLs (`canonical`, `og:url`, `og:image`) pointing at the root domain. Everything else uses relative paths.
- `.nojekyll` is present so GitHub Pages serves files verbatim.

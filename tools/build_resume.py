#!/usr/bin/env python3
"""Regenerate assets/resume/Anamika-Rajput-Resume.pdf from the facts below.

The resume used to be an exported template with no source, so every time a job
title changed it drifted out of sync with index.html. Edit RESUME here, run
`python tools/build_resume.py`, and commit the PDF.

    pip install reportlab
"""

from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas

OUT = Path(__file__).resolve().parent.parent / "assets" / "resume" / "Anamika-Rajput-Resume.pdf"

INK = HexColor("#111111")
MUTED = HexColor("#4a4a4a")
ACCENT = HexColor("#f9ab00")
ACCENT_DARK = HexColor("#c48900")
LINE = HexColor("#d9d9d9")

PAGE_W, PAGE_H = A4
MARGIN = 38
GUTTER = 22
LEFT_W = 182
RIGHT_X = MARGIN + LEFT_W + GUTTER
RIGHT_W = PAGE_W - RIGHT_X - MARGIN

RESUME = {
    "name": "Anamika Rajput",
    "role": "Tech Process Senior Associate  ·  Software Tester",
    "contact": [
        ("Email", "ranamika0704@gmail.com"),
        ("Phone", "8791406741"),
        ("Location", "Gurugram, India"),
        ("Portfolio", "r-anamika.github.io"),
        ("LinkedIn", "linkedin.com/in/anamika-rajput-350b731b4"),
        ("GitHub", "github.com/r-anamika"),
    ],
    "summary": (
        "Software email tester and Quality Analyst with hands-on experience validating marketing "
        "and transactional email campaigns across clients, devices, and platforms. Proficient in "
        "functional, regression, and accessibility testing with Gamma, Litmus, GNP, Redwood, Diff "
        "Checker, and an in-house quality analyzer, delivering pixel-perfect rendering and reliable "
        "deliverability. Skilled in responsive design review, ADA compliance, and automating email "
        "testing workflows."
    ),
    "experience": [
        {
            "title": "Tech Process Senior Associate",
            "org": "Google Operations Center · Gurugram",
            "when": "Sep 2026 — Present",
            "bullets": [],
        },
        {
            "title": "Quality Analyst",
            "org": "Continuum Global Pvt. Ltd. (CGXI) · Gurugram · Onsite Google via Continuum",
            "when": "Mar 2024 — Sep 2026",
            "bullets": [
                "Led end-to-end email campaign testing, from build verification (smoke and sanity) "
                "through final pre-send checks, so every campaign shipped stable and accurate.",
                "Ran functionality, content, and regression testing on templates, validating links, "
                "CTAs, tracking parameters, personalization fields, dynamic content logic, and "
                "legal and brand copy before launch.",
                "Used Gamma, Litmus, GNP, and an in-house analyzer to run automated and manual "
                "cross-client and cross-device passes for consistent rendering on major email "
                "clients, browsers, and devices.",
                "Validated responsive layouts against Figma and Redwood designs with designers and "
                "developers, confirming alignment, image usage, and desktop versus mobile "
                "experience.",
                "Checked every URL for redirection and analytics accuracy, covering landing pages, "
                "UTMs, click tracking, unsubscribe, and preference-center links.",
                "Conducted ADA accessibility and usability testing, improving readability, keyboard "
                "navigation, color contrast, and alt text, then retested fixes for send sign-off.",
                "Supported A/B and acceptance testing across template variants, documenting defects "
                "and obtaining stakeholder sign-off ahead of send.",
            ],
        },
    ],
    "education": [
        ("Master of Computer Application", "Aligarh College of Engineering and Technology", "2022 — 2024"),
        ("Bachelor of Computer Application", "Aligarh College of Engineering and Technology", "2018 — 2021"),
    ],
    "skills": [
        "Java", "Python", "API Testing", "Manual Testing", "Software Testing", "Selenium WebDriver",
    ],
    "tools": [
        "Gamma", "Litmus", "GNP (Google Native Platform)", "Figma", "Redwood",
        "QAT (Quality Analyzer Tool)", "Link Validator", "Diff Checker", "ADA compliance",
    ],
    "certifications": [
        ("Black & White Box Testing", "University of Minnesota", "Sep 2023"),
        ("Python Programming Fundamentals", "YBI Foundation", "Sep 2023"),
        ("Selenium WebDriver with Java", "Udemy — basics to advanced frameworks", "Nov 2023"),
    ],
    "languages": ["English", "Hindi"],
    "interests": ["Singing", "Reading"],
}


def wrap(text, font, size, width):
    """Greedy word wrap, returning a list of lines that each fit `width`."""
    lines, line = [], ""
    for word in text.split():
        probe = f"{line} {word}".strip()
        if stringWidth(probe, font, size) <= width:
            line = probe
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


class Column:
    """A text cursor that flows downward and remembers how far it got."""

    def __init__(self, pdf, x, width, top):
        self.pdf, self.x, self.width, self.y = pdf, x, width, top

    def para(self, text, font="Helvetica", size=9.3, leading=12.6, color=MUTED, indent=0):
        self.pdf.setFont(font, size)
        self.pdf.setFillColor(color)
        for line in wrap(text, font, size, self.width - indent):
            self.pdf.drawString(self.x + indent, self.y, line)
            self.y -= leading
        return self

    def heading(self, text):
        self.y -= 6
        self.pdf.setFont("Helvetica-Bold", 9.0)
        self.pdf.setFillColor(INK)
        self.pdf.drawString(self.x, self.y, text.upper())
        self.pdf.setStrokeColor(ACCENT)
        self.pdf.setLineWidth(1.6)
        self.pdf.line(self.x, self.y - 4.5, self.x + self.width, self.y - 4.5)
        self.y -= 17.5
        return self

    def bullet(self, text):
        self.pdf.setFillColor(ACCENT_DARK)
        self.pdf.setFont("Helvetica-Bold", 9.3)
        self.pdf.drawString(self.x, self.y, "•")
        self.para(text, indent=10)
        self.y -= 1.5
        return self

    def gap(self, amount):
        self.y -= amount
        return self


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(OUT), pagesize=A4)
    pdf.setTitle("Anamika Rajput — Resume")
    pdf.setAuthor(RESUME["name"])
    pdf.setSubject("Tech Process Senior Associate, Google Operations Center")

    # Masthead
    top = PAGE_H - MARGIN
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 28)
    pdf.drawString(MARGIN, top - 21, RESUME["name"].upper())
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 10.6)
    pdf.drawString(MARGIN, top - 37, RESUME["role"])
    pdf.setStrokeColor(ACCENT)
    pdf.setLineWidth(3)
    pdf.line(MARGIN, top - 47, PAGE_W - MARGIN, top - 47)

    body_top = top - 66
    left = Column(pdf, MARGIN, LEFT_W, body_top)
    right = Column(pdf, RIGHT_X, RIGHT_W, body_top)

    # Left column
    left.heading("Contact")
    for label, value in RESUME["contact"]:
        left.pdf.setFont("Helvetica-Bold", 7.2)
        left.pdf.setFillColor(INK)
        left.pdf.drawString(left.x, left.y, label.upper())
        left.y -= 9.4
        left.para(value, size=8.6, leading=10.4)
        left.gap(4.5)

    left.heading("Skills")
    for skill in RESUME["skills"]:
        left.para(skill, size=9.0, leading=12.2)

    left.heading("Tools")
    for tool in RESUME["tools"]:
        left.para(tool, size=9.0, leading=12.2)

    left.heading("Certifications")
    for title, issuer, when in RESUME["certifications"]:
        left.para(title, font="Helvetica-Bold", size=8.9, leading=11, color=INK)
        left.para(f"{issuer} · {when}", size=8.3, leading=10.2)
        left.gap(6)

    left.heading("Languages")
    left.para(", ".join(RESUME["languages"]), size=9.0, leading=12.2)
    left.heading("Interests")
    left.para(", ".join(RESUME["interests"]), size=9.0, leading=12.2)

    # Right column
    right.heading("Summary")
    right.para(RESUME["summary"], size=9.3, leading=12.6)

    right.heading("Experience")
    for job in RESUME["experience"]:
        right.pdf.setFont("Helvetica-Bold", 7.5)
        right.pdf.setFillColor(ACCENT_DARK)
        right.pdf.drawString(right.x, right.y, job["when"].upper())
        right.y -= 12
        right.para(job["title"], font="Helvetica-Bold", size=11.4, leading=13.8, color=INK)
        right.para(job["org"], size=8.9, leading=11.4)
        right.gap(5)
        for line in job["bullets"]:
            right.bullet(line)
        right.gap(9)

    right.heading("Education")
    for degree, school, when in RESUME["education"]:
        right.pdf.setFont("Helvetica-Bold", 7.5)
        right.pdf.setFillColor(ACCENT_DARK)
        right.pdf.drawString(right.x, right.y, when.upper())
        right.y -= 11.5
        right.para(degree, font="Helvetica-Bold", size=10.2, leading=12.6, color=INK)
        right.para(school, size=8.9, leading=11.4)
        right.gap(7)

    # A resume that silently spills onto page two is the bug this script replaced.
    overflow = [name for name, col in (("left", left), ("right", right)) if col.y < MARGIN]
    if overflow:
        raise SystemExit(
            f"Content overflows page 1 in the {' and '.join(overflow)} column "
            f"(left={left.y:.0f}, right={right.y:.0f}, floor={MARGIN}). Trim copy or sizes."
        )

    pdf.setFillColor(LINE)
    pdf.setFont("Helvetica", 6.4)
    pdf.drawRightString(PAGE_W - MARGIN, MARGIN - 12, "r-anamika.github.io")
    pdf.showPage()
    pdf.save()
    print(f"wrote {OUT} (left column ends at y={left.y:.0f}, right at y={right.y:.0f})")


if __name__ == "__main__":
    build()

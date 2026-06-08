# Education Library

Deposit book resources here to build educational course materials. The app reads from this directory to generate training websites, course pages, and learning modules.

## Directory Structure

```
library/education/
├── books/         # Raw book resources (PDFs, EPUBs, markdown, text)
├── courses/       # Course definitions and curriculum outlines (JSON)
└── templates/     # Reusable page templates for training websites
```

## How to Use

### 1. Add Books (`books/`)

Drop book files here — PDFs, EPUB files, markdown notes, or extracted text. Each book should go in its own subfolder named after the book:

```
books/
  javascript-the-good-parts/
    book.pdf
    notes.md
    exercises.md
  clean-code/
    book.epub
    summary.md
```

### 2. Define Courses (`courses/`)

Create a JSON file for each course. The app uses this to generate structured training websites:

```json
{
  "title": "Course Title",
  "description": "What students will learn",
  "level": "beginner | intermediate | advanced",
  "duration": "8 hours",
  "modules": [
    {
      "title": "Module 1: Introduction",
      "lessons": [
        { "title": "Lesson 1.1", "source": "books/my-book/ch1.md", "type": "reading" },
        { "title": "Lesson 1.2", "source": "books/my-book/exercises.md", "type": "practice" }
      ]
    }
  ],
  "resources": [
    { "title": "Reference Book", "file": "books/my-book/book.pdf" }
  ]
}
```

### 3. Use Templates (`templates/`)

Drop HTML/JS template files that define how course pages look. The education widgets in the app (courseHero, videoLesson, moduleOverview, etc.) will use these templates to render training websites.

## Widgets Available

The Education library panel in the app provides these blocks:

| Widget | Use |
|--------|-----|
| `courseHero` | Course landing page with video, instructor, CTA |
| `videoLesson` | Individual video lesson with objectives |
| `moduleOverview` | Module summary with lesson list |
| `curriculum` | Full curriculum / syllabus display |
| `instructor` | Instructor bio and credentials |
| `testimonial` | Student testimonials and reviews |
| `pricing` | Course pricing and enrollment |
| `lessonNav` | Sidebar navigation for course lessons |
| `progress` | Student progress tracker |
| `quiz` | Embedded quiz / assessment |
| `certificate` | Completion certificate preview |

### Four-Tier Architecture Blocks

Each AI-generated module produces four micro-learning blocks (15 min total):

| Tier | Widget | Use |
|------|--------|-----|
| Hook | `hookMetric` | "So What" metric + premise (2 min) |
| Anchor | `conceptAnchor` | Core concept + analogy + in-practice callout (5 min) |
| Arena | `scenarioSandbox` | Branching scenario with impact twist (5 min) |
| Proof | `microCredential` | Quiz + skill token earned (3 min) |

## Two-Step Transformation Pipeline

Course generation follows a legally-defensible two-step pipeline:

1. **Extraction**: AI extracts raw facts, methodologies, and metrics into a structured knowledge graph. Original text is deleted from context.
2. **Re-Synthesis**: A separate AI writes entirely original lessons from the knowledge graph only. Hard constraints enforce no verbatim copying, no structural mimicry, and 100% synthetic case studies.

## BYOB (Bring Your Own Book) Model

Private vaults for enterprise/SME accounts. Users upload proprietary materials — liability rests with them per Terms of Service. Public academy content uses only public domain, Creative Commons, or licensed materials.

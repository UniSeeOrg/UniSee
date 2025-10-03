# UniSee: For students, by students

## 1) What is UniSee?
UniSee is a web app for unbiased, student-verified reviews of colleges, covering the full experience: academics/programs, career support & internships, workload, inclusivity, social life, food, housing, athletics, and the college town overall. Students submit structured reviews; prospective students browse and filter by school, state, major/program (optional), and context tags (in-state, out-of-state, commuter, first-gen, transfer, international, athlete, etc.).

## 2) Why this is useful
Most sites surface glossy, school-wide marketing or unstructured comments. UniSee focuses on authentic signal straight from students with:
- Verification (light v1 via .edu email) to reduce spam/bias.
- Structured, aspect-specific inputs so comparisons are fair and comprehensive.
- Transparent context filters so students see insights from people like them.

## 3) Core features
- Browse & search: by school, state, major/program (optional), tags (in-state, out-of-state, commuter, first-gen, transfer, international, athlete).
- Verification: .edu email link (badge "edu-verified").
- Responsive GUI with clean filtering and sorting.

## 4) Architecture (languages, frameworks, hosting)
**Frontend (GUI):** Next.js 14 (React) + TypeScript + Tailwind CSS
*Rationale: fast component dev, file-based routing, great DX, type safety.*

**Backend services / datastore:** Supabase PostgreSQL (managed)
- Auth (email / magic links; .edu gating)
- PostgREST (auto-generated REST API)
- RPC via SQL functions for custom logic
- Row Level Security (RLS) policies
- Storage (optional logos/assets)
- Realtime (optional live updates)

**Version control:** GitHub (feature branches + PRs; no direct pushes to main)
**Hosting:** Vercel (frontend) + Supabase (DB/Auth/Storage)

## More about our tech stack

### What is NextJS?
NextJS is a framework wrapped around React. Comes with a preconfigured, file based web router. Preconfigured packages for API declaration. Fairly modular database integration. ORM with Prisma. Modern ecosystem (Tailwind CSS, ESLint, etc.) Pure TypeScript (compiles to JavaScript, no language integration needed between layers of the stack)

### Why React?
React is the industry solution for rapid frontend development. Robust component library. Large, mature developer ecosystem. **Reactive** components. _kinda the whole point_ Blend between pure HTML and JavaScript. Plays very nicely with TS/JS backend.

Example:
```javascript
function MyButton({ title }: { title: string }) {
  return (<button>{title}</button>);
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a button" />
    </div>
  );
}
```

### Why TypeScript?
Idiomatic design. Explicit types (JavaScript's biggest weakness: no type system). Closely resembles the syntax of Python with annotated types. Readability. Maintainability.

Example:
```typescript
var greetings: string = "hello";
console.log(greetings);

let a: number = 1;
let b: number = a + 2;

function isEqual(a: number, b: number): boolean { 
  return a == b 
};

let response = isEqual(a,b); // type "any" is inferred, let the compiler do heavy lifting when ambiguous.
```

## Learn More
- [NextJS Installation](https://nextjs.org/docs/app/getting-started/installation) _requires node package manager, i.e., npm cli tool._
- [Learn React](https://react.dev/learn)
- [TypeScript in React](https://react.dev/learn/typescript)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Prisma ORM](https://www.prisma.io/docs) for database integration
- [TailwindCSS](https://tailwindcss.com/) for minimal, modern CSS

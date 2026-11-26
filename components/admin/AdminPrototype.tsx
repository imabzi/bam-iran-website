"use client";

import Link from "next/link";
import { useId, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { architects } from "@/data/architects";
import { events, type PublicationStatus } from "@/data/events";
import { projects } from "@/data/projects";
import { BrandLogo } from "../BrandLogo";

/*
  ADMIN UI PROTOTYPE — NOT A CMS.

  Forms for the future Event Manager, Architect Manager and Media Library. Field
  names match the types in data/events.ts and data/architects.ts, and the panel
  on the right shows the record each form would produce. Nothing is saved,
  uploaded or published: there is no backend, storage or authentication. This
  screen is English-only by design (it is an internal tool) and is never served
  by a normal production build. See CMS_INTEGRATION_NOTES.md.
*/

type Tab = "events" | "architects" | "media";
const languages = [
  { id: "fa", label: "Persian", dir: "rtl" },
  { id: "en", label: "English", dir: "ltr" },
  { id: "ar", label: "Arabic", dir: "rtl" },
] as const;
type Trilingual = Record<(typeof languages)[number]["id"], string>;
const emptyText = (): Trilingual => ({ fa: "", en: "", ar: "" });
const statuses: PublicationStatus[] = ["draft", "scheduled", "published", "archived"];

function Field({ label, hint, children }: { label: string; hint?: string; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div className="admin-field">
      <label htmlFor={id}>{label}</label>
      {children(id)}
      {hint && <p className="admin-hint">{hint}</p>}
    </div>
  );
}

function TrilingualField({ label, value, onChange, multiline = false }: { label: string; value: Trilingual; onChange: (value: Trilingual) => void; multiline?: boolean }) {
  return (
    <fieldset className="admin-fieldset">
      <legend>{label}</legend>
      <div className="admin-trilingual">
        {languages.map((language) => (
          <Field key={language.id} label={language.label}>
            {(id) =>
              multiline ? (
                <textarea id={id} dir={language.dir} lang={language.id} rows={4} value={value[language.id]} onChange={(event) => onChange({ ...value, [language.id]: event.target.value })} />
              ) : (
                <input id={id} dir={language.dir} lang={language.id} value={value[language.id]} onChange={(event) => onChange({ ...value, [language.id]: event.target.value })} />
              )
            }
          </Field>
        ))}
      </div>
    </fieldset>
  );
}

function compact(value: Trilingual) {
  return Object.fromEntries(Object.entries(value).filter(([, text]) => text.trim()));
}

function multiSelectValues(event: ChangeEvent<HTMLSelectElement>) {
  return Array.from(event.target.selectedOptions).map((option) => option.value);
}

function EventManager() {
  const [title, setTitle] = useState(emptyText);
  const [description, setDescription] = useState(emptyText);
  const [location, setLocation] = useState(emptyText);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [projectCodes, setProjectCodes] = useState<string[]>([]);
  const [architectIds, setArchitectIds] = useState<string[]>([]);
  const [publication, setPublication] = useState<PublicationStatus>("draft");
  const [publishAt, setPublishAt] = useState("");

  const record = useMemo(
    () => ({
      title: compact(title),
      description: Object.keys(compact(description)).length ? [compact(description)] : undefined,
      startsAt: startsAt ? `${startsAt}:00+03:30` : undefined,
      endsAt: endsAt ? `${endsAt}:00+03:30` : undefined,
      location: Object.keys(compact(location)).length ? { name: compact(location), googleMapsUrl: mapsUrl || undefined } : undefined,
      cover: "(chosen from the Media Library)",
      gallery: [],
      videos: [],
      speakers: [],
      architectIds,
      projectCodes,
      registrationUrl: registrationUrl || undefined,
      publication,
      publishAt: publication === "scheduled" && publishAt ? `${publishAt}:00+03:30` : undefined,
    }),
    [title, description, startsAt, endsAt, location, mapsUrl, architectIds, projectCodes, registrationUrl, publication, publishAt]
  );

  return (
    <EditorLayout record={record} list={events.map((event) => ({ id: event.id, label: event.title.en ?? event.slug, note: event.demo ? "Sample (dev only)" : event.publication }))} listTitle="Events">
      <TrilingualField label="Title" value={title} onChange={setTitle} />
      <TrilingualField label="Description" value={description} onChange={setDescription} multiline />
      <div className="admin-row">
        <Field label="Starts">{(id) => <input id={id} type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} />}</Field>
        <Field label="Ends">{(id) => <input id={id} type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} />}</Field>
      </div>
      <TrilingualField label="Location" value={location} onChange={setLocation} />
      <Field label="Google Maps link" hint="Paste the approved link exactly as supplied.">
        {(id) => <input id={id} type="url" dir="ltr" value={mapsUrl} onChange={(event) => setMapsUrl(event.target.value)} />}
      </Field>
      <Field label="Registration link" hint="Only for a real, working registration page. Leave empty otherwise: no button is shown.">
        {(id) => <input id={id} type="url" dir="ltr" value={registrationUrl} onChange={(event) => setRegistrationUrl(event.target.value)} />}
      </Field>
      <div className="admin-row">
        <Field label="Related projects">
          {(id) => (
            <select id={id} multiple size={6} value={projectCodes} onChange={(event) => setProjectCodes(multiSelectValues(event))}>
              {projects.map((project) => <option key={project.code} value={project.code}>{project.title.en ?? project.title.fa}</option>)}
            </select>
          )}
        </Field>
        <Field label="Related architects">
          {(id) => (
            <select id={id} multiple size={6} value={architectIds} onChange={(event) => setArchitectIds(multiSelectValues(event))}>
              {architects.map((architect) => <option key={architect.id} value={architect.id}>{architect.name.en}</option>)}
            </select>
          )}
        </Field>
      </div>
      <PublicationFields status={publication} onStatus={setPublication} publishAt={publishAt} onPublishAt={setPublishAt} />
      <MediaSlots />
    </EditorLayout>
  );
}

function ArchitectManager() {
  const [name, setName] = useState(emptyText);
  const [biography, setBiography] = useState(emptyText);
  const [kind, setKind] = useState<"person" | "practice">("person");
  const [projectCodes, setProjectCodes] = useState<string[]>([]);
  const [role, setRole] = useState("lead-architect");
  const [source, setSource] = useState("");
  const [publication, setPublication] = useState<PublicationStatus>("draft");
  const [publishAt, setPublishAt] = useState("");

  const record = useMemo(
    () => ({
      architect: {
        id: name.en.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "(from the English name)",
        kind,
        name: compact(name),
        bioLong: Object.keys(compact(biography)).length ? compact(biography) : undefined,
        portrait: "(chosen from the Media Library)",
        publication,
      },
      credits: projectCodes.map((projectCode) => ({ projectCode, role, source: source || "(required)" })),
    }),
    [name, kind, biography, publication, projectCodes, role, source]
  );

  return (
    <EditorLayout record={record} list={architects.map((architect) => ({ id: architect.id, label: architect.name.en ?? architect.id, note: architect.kind }))} listTitle="Architects">
      <TrilingualField label="Name" value={name} onChange={setName} />
      <Field label="Type">
        {(id) => (
          <select id={id} value={kind} onChange={(event) => setKind(event.target.value as "person" | "practice")}>
            <option value="person">Person</option>
            <option value="practice">Practice</option>
          </select>
        )}
      </Field>
      <TrilingualField label="Biography (verified, approved text only)" value={biography} onChange={setBiography} multiline />
      <div className="admin-row">
        <Field label="Credited BAM projects">
          {(id) => (
            <select id={id} multiple size={6} value={projectCodes} onChange={(event) => setProjectCodes(multiSelectValues(event))}>
              {projects.map((project) => <option key={project.code} value={project.code}>{project.title.en ?? project.title.fa}</option>)}
            </select>
          )}
        </Field>
        <Field label="Role on those projects">
          {(id) => (
            <select id={id} value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="lead-architect">Lead Architect</option>
              <option value="interior-architect">Interior Architect</option>
              <option value="design-consultant">Design Consultant</option>
              <option value="landscape-architect">Landscape Architect</option>
            </select>
          )}
        </Field>
      </div>
      <Field label="Source of the credit" hint="Every credit needs a recorded source. Unverified credits are not published.">
        {(id) => <input id={id} value={source} onChange={(event) => setSource(event.target.value)} />}
      </Field>
      <PublicationFields status={publication} onStatus={setPublication} publishAt={publishAt} onPublishAt={setPublishAt} />
      <MediaSlots portrait />
    </EditorLayout>
  );
}

function PublicationFields({ status, onStatus, publishAt, onPublishAt }: { status: PublicationStatus; onStatus: (status: PublicationStatus) => void; publishAt: string; onPublishAt: (value: string) => void }) {
  return (
    <fieldset className="admin-fieldset">
      <legend>Publication</legend>
      <div className="admin-row">
        <Field label="Status">
          {(id) => (
            <select id={id} value={status} onChange={(event) => onStatus(event.target.value as PublicationStatus)}>
              {statuses.map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}
            </select>
          )}
        </Field>
        {status === "scheduled" && (
          <Field label="Publish at">{(id) => <input id={id} type="datetime-local" value={publishAt} onChange={(event) => onPublishAt(event.target.value)} />}</Field>
        )}
      </div>
    </fieldset>
  );
}

function MediaSlots({ portrait = false }: { portrait?: boolean }) {
  return (
    <fieldset className="admin-fieldset">
      <legend>Media</legend>
      <p className="admin-hint">
        {portrait ? "Portrait (3:4)" : "Cover image, photo gallery and videos"} are chosen from the Media Library once a storage backend exists. Each image needs alt text in every published language.
      </p>
    </fieldset>
  );
}

function MediaLibrary() {
  const [files, setFiles] = useState<Array<{ name: string; url: string; alt: string }>>([]);
  const [cover, setCover] = useState(0);

  function onFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    setFiles((current) => [...current, ...selected.map((file) => ({ name: file.name, url: URL.createObjectURL(file), alt: "" }))]);
    event.target.value = "";
  }

  function move(index: number, step: number) {
    setFiles((current) => {
      const next = [...current];
      const target = index + step;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div className="admin-media">
      <p className="admin-callout">
        Local preview only. Selected files stay in this browser tab and are never uploaded. Production needs object storage, image processing and an
        authenticated upload endpoint.
      </p>
      <Field label="Add images">{(id) => <input id={id} type="file" accept="image/*" multiple onChange={onFiles} />}</Field>
      {files.length > 0 && (
        <ol className="admin-media-grid">
          {files.map((file, index) => (
            <li key={file.url} className={index === cover ? "is-cover" : undefined}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={file.url} alt={file.alt || file.name} />
              <Field label={`Alt text — ${file.name}`}>
                {(id) => <input id={id} value={file.alt} onChange={(event) => setFiles((current) => current.map((item, i) => (i === index ? { ...item, alt: event.target.value } : item)))} />}
              </Field>
              <div className="admin-media-actions">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0}>Earlier</button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === files.length - 1}>Later</button>
                <button type="button" onClick={() => setCover(index)} aria-pressed={index === cover}>{index === cover ? "Cover" : "Set as cover"}</button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function EditorLayout({ children, record, list, listTitle }: { children: ReactNode; record: unknown; list: Array<{ id: string; label: string; note?: string }>; listTitle: string }) {
  return (
    <div className="admin-editor">
      <aside className="admin-list" aria-label={`Existing ${listTitle.toLowerCase()}`}>
        <h2>{listTitle}</h2>
        {list.length === 0 ? (
          <p className="admin-hint">None yet.</p>
        ) : (
          <ul>
            {list.map((item) => (
              <li key={item.id}>
                <span>{item.label}</span>
                {item.note && <small>{item.note}</small>}
              </li>
            ))}
          </ul>
        )}
      </aside>
      <form className="admin-form" onSubmit={(event) => event.preventDefault()}>
        {children}
      </form>
      <section className="admin-preview" aria-label="Record preview">
        <h2>Record preview</h2>
        <p className="admin-hint">The data this form would store. Not saved.</p>
        <pre>{JSON.stringify(record, null, 2)}</pre>
      </section>
    </div>
  );
}

export function AdminPrototype() {
  const [tab, setTab] = useState<Tab>("events");
  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "events", label: "Event Manager" },
    { id: "architects", label: "Architect Manager" },
    { id: "media", label: "Media Library" },
  ];

  return (
    <div className="admin" lang="en" dir="ltr">
      <header className="admin-header">
        <Link href="/" className="admin-brand" aria-label="Back to the website">
          <BrandLogo />
          <span>Content admin</span>
        </Link>
        <span className="admin-badge">Prototype — not connected, nothing is saved</span>
      </header>
      <nav className="admin-tabs" aria-label="Content type">
        {tabs.map((item) => (
          <button key={item.id} type="button" className={item.id === tab ? "active" : undefined} aria-pressed={item.id === tab} onClick={() => setTab(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>
      <main className="admin-main">
        {tab === "events" && <EventManager />}
        {tab === "architects" && <ArchitectManager />}
        {tab === "media" && <MediaLibrary />}
      </main>
    </div>
  );
}

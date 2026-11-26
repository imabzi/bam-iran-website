"use client";

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import { projectTitle, type Project } from "@/data/projects";
import { formatNumber, type Language } from "@/lib/i18n";
import { projectKicker, statusLabel } from "@/lib/projectDisplay";
import { projectPlaces, type AreaPlace, type ExactPlace } from "@/lib/projectPlaces";
import { useLanguage } from "@/lib/usePreferences";

// OpenStreetMap's standard tiles: no API key or account. The tiles are
// toned to the site palette in CSS (greyscale, and darkened in the dark theme).
const tileUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
}

function popupHtml(place: ExactPlace | AreaPlace, language: Language, note: string) {
  const dir = language === "en" ? "ltr" : "rtl";
  const items = place.projects
    .map((project) => {
      const meta = [projectKicker(project, language)?.text, statusLabel(project, language)].filter(Boolean).join(" · ");
      return `<li><a href="/projects/${encodeURIComponent(project.slug)}" data-map-link>${escapeHtml(projectTitle(project, language))}</a><span>${escapeHtml(meta)}</span></li>`;
    })
    .join("");
  return `<div class="map-popup" dir="${dir}"><p class="map-popup-place">${escapeHtml(place.label)}${note ? ` <span>${escapeHtml(note)}</span>` : ""}</p><ul>${items}</ul></div>`;
}

/**
 * The archive's map view: the same filtered projects as the grid. Leaflet is
 * loaded only when this view opens. Exact pins only for verified coordinates;
 * other projects sit on an approximate city or province marker. The list
 * under the map carries the same content for keyboard, screen-reader and
 * small-screen use.
 */
export function ProjectMapView({ projects }: { projects: Project[] }) {
  const { language, t } = useLanguage();
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<LayerGroup | null>(null);
  const [ready, setReady] = useState(false);
  const places = useMemo(() => projectPlaces(projects, language), [projects, language]);

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !container.current || map.current) return;
      const instance = L.map(container.current, { center: [32.4, 53.7], zoom: 5, scrollWheelZoom: false, attributionControl: true, zoomControl: true });
      L.tileLayer(tileUrl, { attribution, maxZoom: 18, className: "map-tiles" }).addTo(instance);
      markers.current = L.layerGroup().addTo(instance);
      map.current = instance;
      setReady(true);
    });
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      markers.current = null;
    };
  }, []);

  // Links inside popups navigate within the app.
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[data-map-link]");
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      router.push(link.getAttribute("href") ?? "/projects");
    };
    element.addEventListener("click", onClick);
    return () => element.removeEventListener("click", onClick);
  }, [router]);

  // Draw the markers for the current filter.
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    import("leaflet").then((L) => {
      const instance = map.current;
      const group = markers.current;
      if (cancelled || !instance || !group) return;
      group.clearLayers();
      const bounds: Array<[number, number]> = [];

      for (const area of places.areas) {
        const count = area.projects.length;
        const size = Math.round(Math.min(64, 30 + Math.sqrt(count) * 7));
        const icon = L.divIcon({
          className: "map-area-icon",
          html: `<span class="map-area" style="width:${size}px;height:${size}px"><span>${formatNumber(count, language)}</span></span>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
          popupAnchor: [0, -size / 2],
        });
        L.marker([area.lat, area.lng], { icon, title: `${area.label} — ${t.mapArea}`, keyboard: true, riseOnHover: true })
          .bindPopup(popupHtml(area, language, t.mapArea), { maxWidth: 300, className: "map-popup-wrap" })
          .addTo(group);
        bounds.push([area.lat, area.lng]);
      }
      for (const place of places.exact) {
        const icon = L.divIcon({ className: "map-pin-icon", html: '<span class="map-pin"></span>', iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -12] });
        L.marker([place.lat, place.lng], { icon, title: projectTitle(place.projects[0], language), keyboard: true, riseOnHover: true, zIndexOffset: 500 })
          .bindPopup(popupHtml(place, language, ""), { maxWidth: 300, className: "map-popup-wrap" })
          .addTo(group);
        bounds.push([place.lat, place.lng]);
      }
      // Open framed on the projects in Iran and the region; a distant one
      // (Vienna) stays on the map and in the list below.
      const nearby = bounds.filter(([lat, lng]) => lat > 20 && lat < 45 && lng > 40 && lng < 65);
      const frame = nearby.length > 0 ? nearby : bounds;
      if (frame.length === 1) instance.setView(frame[0], 10);
      else if (frame.length > 1) instance.fitBounds(frame, { padding: [48, 48], maxZoom: 9 });
    });
    return () => { cancelled = true; };
  }, [places, ready, language, t]);

  const groups = [...places.exact, ...places.areas];

  return (
    <div className="project-map-view">
      <div className="map-frame">
        <div ref={container} className="map-canvas" dir="ltr" role="region" aria-label={t.mapTitle} />
        {!ready && <p className="map-loading">{t.mapLoading}</p>}
      </div>
      <div className="map-legend">
        <span className="map-legend-item"><span className="map-pin" aria-hidden="true" />{t.mapExact}</span>
        <span className="map-legend-item"><span className="map-area map-area-sample" aria-hidden="true" />{t.mapArea}</span>
      </div>
      <p className="map-note">{t.mapNote}</p>

      <section className="map-list" aria-labelledby="map-list-title">
        <h2 id="map-list-title" className="map-list-title">{t.mapListTitle}</h2>
        {groups.length === 0 && places.unplaced.length === 0 ? (
          <p className="empty-state">{t.projectsEmpty}</p>
        ) : (
          <ul className="map-list-groups">
            {groups.map((place) => (
              <li key={`${place.kind}-${place.key}`} className="map-list-group">
                <p className="map-list-place">
                  <span className={place.kind === "exact" ? "map-pin" : "map-area map-area-sample"} aria-hidden="true" />
                  {place.label}
                  <span className="map-list-kind">{place.kind === "exact" ? t.mapExact : t.mapArea}</span>
                </p>
                <ul>
                  {place.projects.map((project) => (
                    <li key={project.code}>
                      <Link href={`/projects/${project.slug}`}>{projectTitle(project, language)}</Link>
                      <span>{statusLabel(project, language)}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            {places.unplaced.length > 0 && (
              <li className="map-list-group">
                <p className="map-list-place">{t.mapUnplaced(formatNumber(places.unplaced.length, language))}</p>
                <ul>
                  {places.unplaced.map((project) => (
                    <li key={project.code}>
                      <Link href={`/projects/${project.slug}`}>{projectTitle(project, language)}</Link>
                      <span>{statusLabel(project, language)}</span>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        )}
      </section>
    </div>
  );
}

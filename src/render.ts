/**
 * Build-time HTML generation for the endpoint table and status list.
 *
 * These run in Node during `vite build`, never in the browser: the markup ends
 * up in the shipped HTML, so the surface is readable with JavaScript off and
 * crawlers see the real thing.
 */

import { endpoints, type Endpoint } from "./endpoints";

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      default: return "&#39;";
    }
  });

/** Renders `/{seed}.svg` with the `{seed}` part dimmed. */
const renderPath = (path: string): string =>
  escapeHtml(path)
    .replace(/\{(\w+)\}/g, '<span class="var">{$1}</span>');

const stateCell = (endpoint: Endpoint): string =>
  endpoint.state === "live"
    ? '<span class="state state--live" data-i18n="state.live">200</span>'
    : '<span class="state state--soon" data-i18n="state.soon">soon</span>';

const row = (endpoint: Endpoint): string => `
          <tr data-state="${endpoint.state}" id="ep-${endpoint.id}">
            <td class="method">${endpoint.method}</td>
            <td class="path">${escapeHtml(endpoint.host)}${renderPath(endpoint.path)}</td>
            <td>${escapeHtml(endpoint.contentType)}</td>
            <td>${endpoint.p50 === null ? "—" : `${endpoint.p50}ms`}</td>
            <td>${stateCell(endpoint)}</td>
          </tr>`;

export const endpointsTable = (): string => `
      <table class="endpoints">
        <thead>
          <tr>
            <th data-i18n="index.th.method">Method</th>
            <th data-i18n="index.th.path">Host / Path</th>
            <th data-i18n="index.th.type">Content-Type</th>
            <th data-i18n="index.th.p50">p50</th>
            <th data-i18n="index.th.state">State</th>
          </tr>
        </thead>
        <tbody>${endpoints.map(row).join("")}
        </tbody>
      </table>`;

/** One slot per day. Nothing is filled in until an endpoint actually answers. */
const SLOTS = 48;

const bars = (endpoint: Endpoint): string =>
  Array.from({ length: SLOTS }, () =>
    endpoint.state === "live" ? "<span></span>" : '<span data-up="pending"></span>',
  ).join("");

const statusRow = (endpoint: Endpoint): string => `
      <article class="uptime" id="status-${endpoint.id}">
        <div class="uptime__head">
          <h3>${escapeHtml(endpoint.host)}</h3>
          ${
            endpoint.state === "live"
              ? '<span class="tag" data-i18n="state.live">200</span>'
              : '<span class="tag tag--soon" data-i18n="state.soon">soon</span>'
          }
        </div>
        <div class="bars" role="img" aria-label="${
          endpoint.state === "live" ? "Uptime, last 48 days" : "No uptime data yet"
        }">${bars(endpoint)}</div>
        <div class="bars-legend">
          <span data-i18n="status.legend.days">48 days ago</span>
          ${
            endpoint.state === "live"
              ? "<span></span>"
              : '<span data-i18n="status.nodata">no data</span>'
          }
          <span data-i18n="status.legend.today">today</span>
        </div>
      </article>`;

export const statusCards = (): string => `
    <div class="uptimes">${endpoints.map(statusRow).join("")}
    </div>`;

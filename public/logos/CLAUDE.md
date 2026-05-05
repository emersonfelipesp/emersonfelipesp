# public/logos/

## Purpose
Brand logo SVG assets used by `components/home/ProjectsArchitecture.tsx` to
label the upstream-software nodes (NetBox, Proxmox) in the homepage projects
diagram. Sourced verbatim from the upstream open-source projects and used
nominatively to identify the products being depicted.

## Files

- `netbox-bright-teal.svg` — NetBox wordmark for **dark** backgrounds. Colors
  `#00f2d4` (cls-1) + `#fff` (cls-2). Copied unmodified from
  `netbox-community/netbox` (`netbox/project-static/img/logo_netbox_bright_teal.svg`).
- `netbox-dark-teal.svg` — NetBox wordmark for **light** backgrounds. Colors
  `#00857d` (cls-1) + `#001423` (cls-2). Copied unmodified from
  `netbox-community/netbox` (`netbox/project-static/img/logo_netbox_dark_teal.svg`).

The Proxmox logo is **not** stored here as a static SVG — it's inlined as a
React component at `components/home/ProxmoxLogo.tsx` so its monochrome
wordmark portion can adopt the surrounding text color via `currentColor`.
The upstream Proxmox brand kit only ships a single colorway (black "PROX"
+ orange "MOX" + orange brand mark), and the black "PROX" wordmark is
illegible on dark backgrounds without the `currentColor` swap.

## Key Conventions

- The two NetBox SVGs are **upstream brand assets**. Do not edit their colors
  or paths. To switch which one is shown, the `BrandLogo` helper in
  `ProjectsArchitecture.tsx` pairs them with Tailwind's `block dark:hidden`
  / `hidden dark:block` utilities.
- Do not duplicate the Proxmox SVG into this folder as `proxmox.svg`.
  `<img>` elements do not inherit `currentColor`, so a static SVG copy
  would either show a black "PROX" on dark backgrounds (illegible) or
  require maintaining two color variants by hand.

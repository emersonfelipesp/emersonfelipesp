# public/netbox-proxbox/screenshots/

## Purpose

PNG screenshots of the netbox-proxbox plugin UI. The showcase page renders them
through `ScreenshotGallery` using content/i18n screenshot groups.

## Contents

Views covered include dashboard, clusters, nodes, virtual machines, containers,
storage, snapshots, backups, replications, task history, endpoint lists, and
detail/settings screens.

## Key Conventions

- All files are PNG format.
- Filenames use kebab-case and should describe the plugin view.
- When adding, removing, or renaming screenshots, update the screenshot data in `content/netbox-proxbox.ts` and pt-br localized data in `lib/i18n/projects.ts`.
- Broken image paths render as empty images, so verify the gallery after changes.

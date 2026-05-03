# public/netbox-proxbox/screenshots/

## Purpose
PNG screenshots of the `netbox-proxbox` plugin UI. These are rendered in the `ScreenshotGallery` component on the `/netbox-proxbox` project page. The filename list in `content/netbox-proxbox.ts` must stay in sync with the files present here.

## Contents (25 screenshots)

Plugin views covered: dashboard, clusters, nodes, virtual-machines, containers, storage, snapshots, backups, replications, task-history, netbox-endpoints, proxmox-endpoints, and various detail/settings screens.

## Key Conventions

- All files are PNG format.
- Filenames use kebab-case and map directly to the plugin view they depict.
- To add a new screenshot: drop the PNG here and add its filename to the screenshots array in `content/netbox-proxbox.ts`.
- To remove a screenshot: delete the file AND remove it from the content array — broken image paths will render as empty `<img>` elements.

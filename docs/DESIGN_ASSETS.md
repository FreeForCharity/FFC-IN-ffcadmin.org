# Design Assets & Provenance

This document records the sources of design assets used in `ffcadmin.org` to ensure maintainability and traceability.

## Hero Section
- **Target Design**: `ffcworkingsite1.org`
- **Source Repository**: [FreeForCharity/FFC-IN-Single_Page_Template_HTML](https://github.com/FreeForCharity/FFC-IN-Single_Page_Template_HTML)
- **Asset Path in Source**: `html-site/images/figma-hero-img.webp`
- **Local Path**: `public/figma-hero-img.webp`
- **Retrieval Date**: 2026-01-04

### Retrieval Process
1.  **Identify Repository**: The domain `ffcworkingsite1.org` corresponds to the GitHub Pages site for the `FFC-IN-Single_Page_Template_HTML` repo.
2.  **Locate Asset**: By examining `html-site/index.html` in the source repo, the hero image was identified as `<img src="images/figma-hero-img.webp" ...>`.
3.  **Download**: The raw file was downloaded via:
    ```bash
    curl.exe -o public/figma-hero-img.webp https://raw.githubusercontent.com/FreeForCharity/FFC-IN-Single_Page_Template_HTML/main/html-site/images/figma-hero-img.webp
    ```

## Navigation
- **Logo**: The navigation bar uses `public/hero-logo.png`.
- **Design Reference**: The white background and blue active link styles match the `ffcworkingsite1.org` design.

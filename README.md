# WorldAnvil Ebook Downloader

Downloads WorldAnvil Wikis as Ebooks with images and ordering.

## Code Structure
This code is separated into an alpha and beta section

### Alpha - Web Scraping
This section traverses the site, identifies all images and subpages,
and sends all the data to the backend according to an order, originally
depth first.

### Beta - Backend Replay

Zip Replay. This backend accepts images and pages, storing
each in a zip file. It is then possible to pass the data stored in the
zip file to another backend (beta or gamma) while skipping the web-scrape process in
the future. This transformation should be idempotent - passing the output of 
the beta zip file replay into the beta backend should produce the same result.

### Gamma - Epub Processing
This 

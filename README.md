# WorldAnvil Ebook Downloader

Downloads WorldAnvil Wikis as Ebooks with images and ordering.

## Installation.
First, install [tampermonkey](https://www.tampermonkey.net/). Then open
`tampermonkeyScript.user.js` in this repository, and click on the `raw` button. 
This should open a prompt to install the userscript.

Upon visiting the root page of any WorldAnvil wiki, you should now see a `download` button
next to the existing login button on the top navigation bar.

## Code Structure
This code is separated into an alpha and beta section

### Alpha - Web Scraping
This section traverses the site, identifies all images and subpages,
and sends all the data to the backend in
depth first order.

### Beta - Backend Replay

The beta backend packages all scraped pages and images into a single `json` file. 
This file is downloaded and allows for local analysis or processing, rather than
repeatedly scraping web data. There is a `betaReader` script which can read
this json data and send it to a backend, following the same scrape order as 
Alpha.

### Gamma - Epub Processing

The Gamma backend sends each webpage through a series of filters. Images and pages
are renamed and links are updated. There are a few variants of the Gamma backend - 
There is a node-compatible local version which outputs the processed html into a 
directory. Additionally, `GammaEpub` stores all files into a zip file following 
the epub specification.

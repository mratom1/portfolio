# ATOM Portfolio

Static portfolio for ATOM, featuring nine documented apps and five retained earlier project concepts.

Live portfolio: [mratom.asia](https://mratom.asia/).

## Apps

- Relaxation
- ReGet
- My POS (Sales Administrator)
- Universal Downloader
- Off Chat
- LumaShelf
- ATOM Forensic Pro
- ATOM Universal Builder
- AI SRT Editor

App descriptions are based on the local project documentation and implementation. Visuals use actual interface/demo screenshots or app identity assets; screenshots have not been invented. Earlier concepts remain identified separately from these documented apps. Private application source and repository links are not published here.

LumaShelf is a Flutter adaptation derived from [jadis0x/UdemySaver](https://github.com/jadis0x/UdemySaver).

## Run locally

From this directory, run:

```sh
python -m http.server 4173
```

Open [localhost:4173](http://localhost:4173).

The site uses plain HTML, CSS and JavaScript. No npm installation or build dependencies are required to serve it.

## Update the portfolio

1. Edit project content in `projects.json` and add any approved visuals to `assets/projects/`.
2. Run the dependency-free generator with Node.js:

   ```sh
   node scripts/build.mjs
   ```

3. Review the generated `index.html` locally, then commit the changes.

`site.template.html` provides the page structure. The generator inserts static project cards into `index.html`; `styles.css` handles presentation and `app.js` handles interactions. Edit the template when changing generated page structure.

## GitHub Pages

Deploy from the `main` branch and `/ (root)` folder in the repository's **Settings → Pages**. Commit the generated `index.html` with the site assets. This deployment uses GitHub Pages branch publishing and does not require a workflow file.

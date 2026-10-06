# Arjun Rai — Portfolio

The live portfolio at [arjunrai.xyz](https://arjunrai.xyz) is a static site in [`simple/`](simple/). Its home page links to the Moss Robotics and Freshcuts project pages, plus a few deliberately simpler variants.

## Local preview

```bash
python3 -m http.server 3000 --bind 127.0.0.1 --directory simple
```

Open <http://127.0.0.1:3000/>.

## Deployment

Firebase Hosting serves `simple/` directly. Only the HTML pages and media used by the live site belong in that directory.

```bash
firebase deploy --only hosting --project website-6b32c
```

The older React implementation remains in `src/` as an archive; it is not part of the deployed site.

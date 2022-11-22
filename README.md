# Foxhole Map Annotate

Annotate and draw on the foxhole map and share with your group.

## Ideas

* implement deactivated hexes
* increase button sizes (by [RDRT] A Devil Chicken)
* gear opens popup with a toolbar of all tools, under it it shows the icons you then can click (by [RDRT] A Devil Chicken) - https://cdn.discordapp.com/attachments/1044680476822093976/1044717627894931476/image.png
* one facility button for all, switch on the edit if public/private (by [RDRT] A Devil Chicken)
* victory townhalls?
* Consolidate enemy stuff into a menu called "enemy structures" (by Spannbeton)
* [Measure](https://viglino.github.io/ol-ext/examples/popup/map.tooltip.measure.html) (by felipipe)
* Partisan Rails? (new Role, Green Rail)
* Popup rework?
  * [Hover](https://viglino.github.io/ol-ext/examples/interaction/map.interaction.hover.html)
  * [Popup](http://viglino.github.io/ol-ext/examples/popup/map.popup.html)
  * [Animated Popup](http://viglino.github.io/ol-ext/examples/popup/map.popup.anim.html)
  * [Popup Feature](https://viglino.github.io/ol-ext/examples/popup/map.popup.feature.html)
* move with middle mouse if in rail laying mode (by [✚RMC✚] EllieTau (QM))
* paste text and create icons from it (FarranacCoastG11k2, (iconType), (note)) (by [SOS] Yabba)
* move help section into main page with layers you can open (by [RDRT] A Devil Chicken)

## DevTodos

* demo?
* Rework WebSockets to allow partial updates (localStorage?) 
* investigate about rate limits for discord api
* Admin Routes (new war start - reload icons/tracks - reload/edit allowed users)
* Config file watcher

## Run Dev

Copy `.env.dist` to `.env`

Create the map tiles
```
mkdir uploads
cd uploads
wget https://cdn.discordapp.com/attachments/1003485765273145424/1039646692095574046/entiremap.png
docker run --rm -v `pwd`:/tmp/files osgeo/gdal gdal2tiles.py -p raster -w openlayers --tiledriver=WEBP --webp-lossless /tmp/files/entiremap.png /tmp/files/
```

Install dependencies and run dev mode
```
npm install
npm run dev
```

Open http://localhost:3000

## Run Live

Create a Discord OAuth 2 App (https://discord.com/developers/applications) and add `https://<yourdomain.tld>/connect/discord/callback` as redirect URL.

Copy `docker-compose.yml` to your webserver with docker and a traefik instance.

If not done already, see step how to create the map.

Change Host in `docker-compse.yml`

Run `docker compose up -d`

It will create a `data/config.yml`, please change all values there and then restart the app. 

### Access control

After first start it creates a file `./data/allowedUsers.yml`. Using yml so you can add comments!

Edit file and restart server for new permissions to take place. Users probably have to logout/login again.

```yaml
users:
  12345678901234567: full # full access for this user
roles:
  12345678901234569: # Server ID
    12345678901234570: icons # All users with this role, can add/edit icons
    12345678901234571: read # All users with this role, can only view the map
```

## Adiós-blog-cli
A cli for generate an static blog dist.

### Features
Simple, Neat, Markdown First.
### Usage
On terminal:
```bash
yarn global add adios-blog-cli

adios
```
In nodejs modules (you can go to [Here]() for more details), you will need an `adios.config.json` configuration file in advance(check it in the next section):
```js
// scripts/index.js
const { build, clean, serve } = require('adios-blog-cli');
const path = require('path');

// clean
clean(path.resolve(__dirname, '..'));

// build
build(path.resolve(__dirname, '..'));

// preview under development mode
serve(path.resolve(__dirname, '..'));
```
- `build(projectDir: string): void;`: compile template files into HTML5 files.
- `clean(projectDir: string): void;`: remove bundle directory.
- `serve(projectDir: string): void;`: start a local server to preview the bundle files.
### Config
when using cli as an module, you will need a configuration named `adios.config.json` under your project.

```
- your-project-dir
-|- src
-|- adios.config.json // your config file
-|- package.json
-|- theme
-|- public
-|- assets
-|- ... // other files
```
a full config file may be like this:
```json
{
    "siteinfo": {
        "name": "Adiós Blog",
        "maintainer": "wiskewu",
        "description": "Adiós independent blog",
        "keywords": "Adiós, blogs",
        "homepage": "/",
        "publicPath": "/"
    },
    "settings": {
        "pageSize": 10,
        "homepage": {
            "filter": ["Notes"]
        },
        "navList": [
            {
                "title": "首页",
                "pathname": "/"
            },
            {
                "title": "分类",
                "pathname": "/categories/"
            },
            {
                "title": "标签",
                "pathname": "/tags/"
            },
            {
                "title": "关于",
                "pathname": "/about/"
            }
        ],
        "extraPages": [
            {
                "layout": "extra"
            },
            {
                "source": "brief",
                "layout": "extra",
                "outputName": "brief"
            }
        ]
    },
    "theme": {
        "name": "default",
        "path": "./theme"
    }
}
```
#### Field Explanation
- `siteinfo`: Object; your site config.
    - `siteinfo.name`: string; your site name, show up in the homepage.
    - `siteinfo.maintainer`: string; the maintainter's name, show up in the page footer.
    - `siteinfo.description`: string; your site description, for SEO.
    - `siteinfo.keywords`: string; your site keywords, for SEO.
    - `siteinfo.homepage`: string; the homepage url.
    - `siteinfo.publicPath`: string; the public path of all web routes and static resources.

- `theme`: Object; the theme template config.
    - `theme.name`: string; the direction name of theme template.
    - `theme.path`: string; the relative path to theme template directory.

- `settings`: Object; your site settings.
    - `settings.pageSize`: number; depending how many items showing in one list-page.
    - `settings.homepage.filter`: Array<string>; depending which categories of posts that will not showing up in the homepage.
    - `settings.navList`: Array<Object>; the navigation showing up on page header.
    - `settings.extraPages`: Array<Object>; specify what extra pages should be compiled as independent HTML files.


---
### Advance Usage
- custom theme:
    Just modify the theme template to customize your own style.
- extend data:
    Feel free to write your own code, and feed your own data into `.pug` files.

### Thanks List
Idea comes out from the following repos:
- [yohe](https://github.com/laoqiren/yohe)

### License
MIT.

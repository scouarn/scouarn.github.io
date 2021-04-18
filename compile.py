#bunch of articles in html files -> static html pages


PAGES = (
     #display         #name
    ("Acceuil",       'main'),
    ("Physique",      'physique'),
    ("Maths",         'maths'),
    ("Astronomie",    'astro'),
    ("Microscopie",   'micro'),
    ("Jeux",          'jeux'),
    ("TIPE Machines", 'cpu'),
    ("BD Shadoks",    'dessin'),
)

DIR = "./articles/"

def main() :

    for page in PAGES :
        display, name = page
        print(f"Making {display}")
        f = open(f"pages/{name}.html", 'w')
        f.write(make_page(page))
        f.close()





LIs = ""
for display, name in PAGES :
    LIs += f"<a href=\"/pages/{name}.html\"><li cat=\"{name}\">{display}</li></a>\n"

MENU = f"""

    <aside id="menu">
    <link rel="stylesheet" href="/style/menu.css" />
    <div class="box">
    <h1>Navigation</h1>
    <ul>

{LIs}

    </ul>
    </div>
    </aside>
"""



from os import listdir
from os.path import isfile, isdir, join

def make_feed(name) :

    files = [f for f in listdir(DIR+name) if isfile(join(DIR+name, f))]
    files.sort()

    articles = ""

    for fname in files :
        text = open(DIR + name + '/' + fname, 'r').read()
        articles += f"<article class='box'>{text}</article>"

    feed = f"""
    <section id="article_feed">
        {articles}
    </section>
    """

    return feed



def make_page(page) :

    display, name = page

    return f"""
<!DOCTYPE html>

<html prefix="og: https://ogp.me/ns#">

    <head>
      <meta charset="utf-8">
      <link rel="stylesheet" href="/style/style.css" />
      <link rel="stylesheet" href="/style/feed.css" />
      <link rel="icon" href="/img/icon.jpg" />
      <title>{display}</title>

      <meta http-equiv="Content-Security-Policy" content="
        default-src 'self';
        img-src 'self' *;
        media-src 'self' *;
        object-src 'self' *;
        script-src 'self' 'unsafe-inline';
        style-src 'self' 'unsafe-inline';
        frame-src 'self' *;
        "
      >

      <meta property="og:title" content="Scouarn">
      <meta property="og:image" content="/img/thumbnail.jpg">
      <meta property="og:description" content="Code et bidouille.">

    </head>

    <body>

        <header>
          <link rel="stylesheet" href="/style/banner.css" />
          <a href="/">
            <div id="banner">
                <img src="/img/console.png" alt="banner"/>
                <img src="/img/banner.png" alt="banner"/>
                <img src="/img/scouarn_sg.png" alt="banner"/>
            </div>
          </a>
        </header>

    <section id="main_content">

    {MENU}

    {make_feed(name)}

    </section>

  </body>




</html>
"""



if __name__ == "__main__" :
    main()

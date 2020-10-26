<!DOCTYPE html>

<html>

  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="/style/style.css" />
    <link rel="stylesheet" href="/style/feed.css" />
    <link rel="icon" href="/img/icon.jpg" />
    <title>Mon site</title>

    <script src="/libs/feed.js"></script>
    <script src="/libs/menu.js"></script>
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' *; media-src 'self' ;">

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

      <aside id="menu">
        <link rel="stylesheet" href="/style/menu.css" />
        <div class="box">
          <h1>Navigation</h1>
          <ul>
            <li>Accueil</li>
            <li>Maths</li>
            <li>Physique</li>
            <li>Astronomie</li>
            <li>Microscopie</li>
            <li>Jeux</li>
            <li>Musique</li>
            <li>Dessin</li>
          </ul>
        </div>
      </aside>

      <section id="article_feed">
        <?php include "/articles/main/art_0.html" ?>
      </section>


    </section>




  </body>

  <script>initMenu();initFeed();</script>


</html>

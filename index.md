---
layout: default
title: Home
description: "CodEnity — Bridging the Gap Between Code and Craft"
---

<section class="hero">
  <div>
    <h1>CodEnity: Bridging the Gap Between Code and Craft</h1>
    <p>Watch tutorials, install apps and browser extensions, and explore developer resources curated for creators and learners.</p>
    <div class="cta-group">
      <a class="btn btn-cta" href="{{ '/youtube/' | relative_url }}">Watch on YouTube</a>
      <a class="btn" href="{{ '/#apps' | relative_url }}">Install Apps & Extensions</a>
    </div>
  </div>
  <div>
    <div class="card">
      <h3>Featured Playlist</h3>
      <iframe width="100%" height="240" src="https://www.youtube.com/embed?listType=playlist&list=PLwy3nuo0MMdVzBE8FsYUe51JhVRCZfMTG" title="CodEnity playlist" frameborder="0" allowfullscreen></iframe>
    </div>
  </div>
</section>

<section id="apps">
  <h2>Apps & Extensions</h2>
  <div class="cards">
    {% for p in site.data.platforms %}
      <div class="card">
        <h4>{{ p.name }}</h4>
        <p>{{ p.description }}</p>
        <p><a href="{{ p.url }}" target="_blank" rel="noopener">Visit</a></p>
      </div>
    {% endfor %}
  </div>
</section>

<section>
  <h2>Featured Videos</h2>
  <div class="cards">
    {% for v in site.data.featured_videos %}
      <article class="card">
        <h4><a href="{{ '/videos/' | append: v.slug | relative_url }}">{{ v.title }}</a></h4>
        <p>{{ v.description }}</p>
        <iframe width="100%" height="160" src="https://www.youtube.com/embed/{{ v.video_id }}" title="{{ v.title }}" frameborder="0" allowfullscreen></iframe>
      </article>
    {% endfor %}
  </div>
</section>

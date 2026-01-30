---
layout: default
title: YouTube
description: "CodEnity YouTube playlists and featured videos"
permalink: /youtube/
---

## YouTube

Embedded playlist (your playlist is embedded below):

<div class="card">
  <iframe width="100%" height="360" src="https://www.youtube.com/embed?listType=playlist&list=PLwy3nuo0MMdVzBE8FsYUe51JhVRCZfMTG" title="CodEnity playlist" frameborder="0" allowfullscreen></iframe>
</div>

<section>
  <h2>Featured videos</h2>
  <div class="cards">
    {% for v in site.data.featured_videos %}
      <article class="card">
        <h3><a href="{{ '/videos/' | append: v.slug | relative_url }}">{{ v.title }}</a></h3>
        <p>{{ v.description }}</p>
        <iframe width="100%" height="200" src="https://www.youtube.com/embed/{{ v.video_id }}" title="{{ v.title }}" frameborder="0" allowfullscreen></iframe>
      </article>
    {% endfor %}
  </div>
</section>

---
layout: default
title: Apps & Extensions
description: "Install CodEnity apps and browser extensions"
permalink: /apps/
---

## Apps & Extensions

Below are quick links to the stores. Each item will have install badges, screenshots, and short manuals.

<div class="cards">
  {% for app in site.data.apps %}
    <article class="card">
      <h3>
        {% if app.url %}
          <a href="{{ app.url | relative_url }}">{{ app.name }}</a>
        {% else %}
          <a href="{{ '/apps/' | append: app.slug | relative_url }}">{{ app.name }}</a>
        {% endif %}
      </h3>
      <p>{{ app.short }}</p>
      <p>Version {{ app.version }}</p>
      <p>
        {% for p in app.platforms %}
          {% include store-badge.html url=p.url platform=p.name %}
        {% endfor %}
      </p>
    </article>
  {% endfor %}
</div>

<section>
  <h2>All platforms</h2>
  <p>Quick access to each store is available on each app page.</p>
</section>

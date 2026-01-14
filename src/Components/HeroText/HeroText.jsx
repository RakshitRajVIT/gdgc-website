import React from 'react'
import './HeroText.css'

export default function HeroText() {
  return (
    <section className="hero" aria-label="Site hero">
      <div className="hero__inner">
        <h1 className="hero__heading">
          <span className="hero__we">we are</span>{' '}
          <span className="hero__gdgc">gdgc</span>
        </h1>
        <p className="hero__sub">VIT BHOPAL</p>
      </div>

      {/* Bottom-left location (small, unobtrusive) */}
      <div className="hero__location" aria-hidden="true">
        <div className="hero__location-name">VIT Bhopal, India</div>
        <div className="hero__location-coords">17.3616° N, 78.4747° E</div>
      </div>
    </section>
  )
}

/**
 * TechBlips Interactive Tech Radar
 * Custom D3.js visualization — no framework dependencies
 */
(function () {
  'use strict';

  const CONFIG = {
    rings: [
      { name: 'Adopt', color: '#6c5ce7', radius: 0.25 },
      { name: 'Trial', color: '#0ea5e9', radius: 0.5 },
      { name: 'Assess', color: '#f59e0b', radius: 0.75 },
      { name: 'Hold', color: '#94a3b8', radius: 1.0 }
    ],
    quadrants: [
      { name: 'AI & ML', angle: { start: -Math.PI / 2, end: 0 }, color: '#6c5ce7' },
      { name: 'Cloud & Infrastructure', angle: { start: 0, end: Math.PI / 2 }, color: '#0ea5e9' },
      { name: 'Developer Tools', angle: { start: Math.PI / 2, end: Math.PI }, color: '#f59e0b' },
      { name: 'Platforms & APIs', angle: { start: Math.PI, end: 3 * Math.PI / 2 }, color: '#10b981' }
    ],
    padding: 40,
    blipRadius: 7,
    labelFont: '12px Inter, system-ui, sans-serif',
    titleFont: '600 13px Inter, system-ui, sans-serif',
    seed: 42
  };

  // Seeded random for consistent blip placement
  function seededRandom(seed) {
    let s = seed;
    return function () {
      s = (s * 16807 + 0) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  class TechRadar {
    constructor(containerId, dataUrl) {
      this.containerId = containerId;
      this.dataUrl = dataUrl;
      this.data = null;
      this.svg = null;
      this.tooltip = null;
      this.activeQuadrant = null;
      this.size = 0;
      this.center = 0;
      this.maxRadius = 0;
      this.random = seededRandom(CONFIG.seed);
    }

    async init() {
      this.data = await this.loadData();
      if (!this.data) return;
      this.createTooltip();
      this.render();
      this.bindResize();
    }

    async loadData() {
      try {
        const resp = await fetch(this.dataUrl);
        return await resp.json();
      } catch (e) {
        console.error('Failed to load radar data:', e);
        return null;
      }
    }

    calculateDimensions() {
      const container = document.getElementById(this.containerId);
      const rect = container.getBoundingClientRect();
      this.size = Math.min(rect.width, 800);
      this.center = this.size / 2;
      this.maxRadius = this.center - CONFIG.padding;
    }

    createTooltip() {
      if (this.tooltip) return;
      this.tooltip = document.createElement('div');
      this.tooltip.className = 'radar-tooltip';
      this.tooltip.setAttribute('role', 'tooltip');
      document.body.appendChild(this.tooltip);
    }

    render() {
      const container = document.getElementById(this.containerId);
      container.innerHTML = '';
      this.calculateDimensions();

      this.svg = d3.select(`#${this.containerId}`)
        .append('svg')
        .attr('viewBox', `0 0 ${this.size} ${this.size}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('class', 'radar-svg')
        .attr('role', 'img')
        .attr('aria-label', 'TechBlips Technology Radar');

      const defs = this.svg.append('defs');
      this.createGradients(defs);

      const mainGroup = this.svg.append('g')
        .attr('transform', `translate(${this.center}, ${this.center})`);

      this.drawRings(mainGroup);
      this.drawAxes(mainGroup);
      this.drawQuadrantLabels(mainGroup);
      this.drawRingLabels(mainGroup);
      this.drawBlips(mainGroup);
      this.drawLegend();
    }

    createGradients(defs) {
      CONFIG.quadrants.forEach((q, i) => {
        const grad = defs.append('radialGradient')
          .attr('id', `quadrant-grad-${i}`)
          .attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
        grad.append('stop').attr('offset', '0%').attr('stop-color', q.color).attr('stop-opacity', 0.06);
        grad.append('stop').attr('offset', '100%').attr('stop-color', q.color).attr('stop-opacity', 0.02);
      });

      // Glow filter for blips
      const glow = defs.append('filter').attr('id', 'blip-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
      glow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
      const merge = glow.append('feMerge');
      merge.append('feMergeNode').attr('in', 'blur');
      merge.append('feMergeNode').attr('in', 'SourceGraphic');
    }

    drawRings(group) {
      const rings = CONFIG.rings.slice().reverse();

      rings.forEach((ring, i) => {
        const actualIndex = CONFIG.rings.length - 1 - i;
        const radius = this.maxRadius * ring.radius;

        // Ring fill (very subtle)
        group.append('circle')
          .attr('cx', 0).attr('cy', 0)
          .attr('r', radius)
          .attr('fill', 'none')
          .attr('stroke', 'var(--radar-ring-stroke, rgba(100,100,120,0.15))')
          .attr('stroke-width', 1)
          .attr('class', `ring ring-${actualIndex}`);
      });

      // Quadrant fills
      CONFIG.quadrants.forEach((q, i) => {
        const outerRadius = this.maxRadius;
        const arc = d3.arc()
          .innerRadius(0)
          .outerRadius(outerRadius)
          .startAngle(q.angle.start + Math.PI / 2)
          .endAngle(q.angle.end + Math.PI / 2);

        group.append('path')
          .attr('d', arc)
          .attr('fill', `url(#quadrant-grad-${i})`)
          .attr('class', `quadrant-bg quadrant-bg-${i}`)
          .attr('cursor', 'pointer')
          .on('click', () => this.toggleQuadrant(i))
          .on('mouseenter', () => this.highlightQuadrant(i))
          .on('mouseleave', () => this.unhighlightQuadrant());
      });
    }

    drawAxes(group) {
      // Cross axes
      group.append('line')
        .attr('x1', -this.maxRadius).attr('y1', 0)
        .attr('x2', this.maxRadius).attr('y2', 0)
        .attr('stroke', 'var(--radar-axis, rgba(100,100,120,0.2))')
        .attr('stroke-width', 1);

      group.append('line')
        .attr('x1', 0).attr('y1', -this.maxRadius)
        .attr('x2', 0).attr('y2', this.maxRadius)
        .attr('stroke', 'var(--radar-axis, rgba(100,100,120,0.2))')
        .attr('stroke-width', 1);
    }

    drawQuadrantLabels(group) {
      const offset = this.maxRadius * 0.52;
      const positions = [
        { x: offset, y: -offset, anchor: 'start' },     // AI & ML (top-right)
        { x: offset, y: offset, anchor: 'start' },       // Cloud (bottom-right)
        { x: -offset, y: offset, anchor: 'end' },        // Dev Tools (bottom-left)
        { x: -offset, y: -offset, anchor: 'end' }        // Platforms (top-left)
      ];

      CONFIG.quadrants.forEach((q, i) => {
        const pos = positions[i];
        group.append('text')
          .attr('x', pos.x)
          .attr('y', pos.y)
          .attr('text-anchor', pos.anchor)
          .attr('fill', q.color)
          .attr('font', CONFIG.titleFont)
          .attr('opacity', 0.85)
          .attr('class', `quadrant-label quadrant-label-${i}`)
          .text(q.name);
      });
    }

    drawRingLabels(group) {
      CONFIG.rings.forEach((ring, i) => {
        const radius = this.maxRadius * ring.radius;
        group.append('text')
          .attr('x', 6)
          .attr('y', -radius + 14)
          .attr('fill', 'var(--radar-ring-label, rgba(100,100,120,0.5))')
          .attr('font', '500 10px Inter, system-ui, sans-serif')
          .attr('text-transform', 'uppercase')
          .attr('letter-spacing', '0.5px')
          .text(ring.name);
      });
    }

    calculateBlipPosition(blip) {
      const q = CONFIG.quadrants[blip.quadrant];
      const ring = CONFIG.rings[blip.ring];
      const prevRingRadius = blip.ring > 0 ? CONFIG.rings[blip.ring - 1].radius : 0;

      // Position within the ring band
      const minR = this.maxRadius * prevRingRadius + 18;
      const maxR = this.maxRadius * ring.radius - 18;
      const r = minR + this.random() * (maxR - minR);

      // Angle within the quadrant (with some padding from axes)
      const anglePad = 0.15;
      const angleRange = (q.angle.end - q.angle.start) - 2 * anglePad;
      const angle = q.angle.start + anglePad + this.random() * angleRange;

      return {
        x: r * Math.cos(angle),
        y: r * Math.sin(angle)
      };
    }

    drawBlips(group) {
      this.random = seededRandom(CONFIG.seed); // Reset seed for consistent layout

      const blipsGroup = group.append('g').attr('class', 'blips');

      this.data.blips.forEach((blip) => {
        const pos = this.calculateBlipPosition(blip);
        const ringColor = CONFIG.rings[blip.ring].color;
        const quadrantColor = CONFIG.quadrants[blip.quadrant].color;

        const blipGroup = blipsGroup.append('g')
          .attr('class', `blip blip-q${blip.quadrant} blip-r${blip.ring}`)
          .attr('transform', `translate(${pos.x}, ${pos.y})`)
          .attr('cursor', 'pointer')
          .attr('role', 'button')
          .attr('aria-label', `${blip.name}: ${CONFIG.rings[blip.ring].name}`)
          .attr('tabindex', 0);

        // Blip shape based on movement
        if (blip.moved > 0) {
          // Triangle up — moved in
          blipGroup.append('path')
            .attr('d', d3.symbol().type(d3.symbolTriangle).size(180))
            .attr('fill', quadrantColor)
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .attr('class', 'blip-shape');
        } else if (blip.moved < 0) {
          // Triangle down — moved out
          blipGroup.append('path')
            .attr('d', d3.symbol().type(d3.symbolTriangle).size(180))
            .attr('transform', 'rotate(180)')
            .attr('fill', quadrantColor)
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .attr('class', 'blip-shape');
        } else {
          // Circle — no change
          blipGroup.append('circle')
            .attr('r', CONFIG.blipRadius)
            .attr('fill', quadrantColor)
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .attr('class', 'blip-shape');
        }

        // Blip number label
        blipGroup.append('text')
          .attr('x', 0)
          .attr('y', blip.moved !== 0 ? 1 : 1)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('fill', '#fff')
          .attr('font', '600 8px Inter, system-ui, sans-serif')
          .attr('pointer-events', 'none')
          .text(blip.id);

        // Events
        blipGroup
          .on('mouseenter', (event) => this.showTooltip(event, blip))
          .on('mouseleave', () => this.hideTooltip())
          .on('click', () => this.navigateToBlip(blip))
          .on('focus', (event) => this.showTooltip(event, blip))
          .on('blur', () => this.hideTooltip());
      });

      // Entrance animation
      blipsGroup.selectAll('.blip')
        .style('opacity', 0)
        .transition()
        .duration(600)
        .delay((d, i) => i * 30)
        .style('opacity', 1);
    }

    showTooltip(event, blip) {
      const ring = CONFIG.rings[blip.ring];
      const quadrant = CONFIG.quadrants[blip.quadrant];
      const movedText = blip.moved > 0 ? ' &#9650; Moved in' : blip.moved < 0 ? ' &#9660; Moved out' : '';

      this.tooltip.innerHTML = `
        <div class="radar-tooltip-header">
          <span class="radar-tooltip-ring" style="background:${ring.color}">${ring.name}</span>
          <span class="radar-tooltip-quadrant">${quadrant.name}</span>
        </div>
        <div class="radar-tooltip-name">${blip.name}${movedText}</div>
        <div class="radar-tooltip-desc">${blip.description}</div>
        <div class="radar-tooltip-cta">Click to read full analysis &rarr;</div>
      `;

      const svgRect = this.svg.node().getBoundingClientRect();
      const blipEl = event.currentTarget || event.target;
      const blipRect = blipEl.getBoundingClientRect();

      let left = blipRect.left + blipRect.width / 2;
      let top = blipRect.top - 10;

      // Keep tooltip in viewport
      this.tooltip.style.display = 'block';
      const tipRect = this.tooltip.getBoundingClientRect();
      if (left + tipRect.width / 2 > window.innerWidth) left = window.innerWidth - tipRect.width / 2 - 10;
      if (left - tipRect.width / 2 < 0) left = tipRect.width / 2 + 10;

      this.tooltip.style.left = `${left}px`;
      this.tooltip.style.top = `${top}px`;
      this.tooltip.classList.add('visible');

      // Highlight blip
      d3.select(blipEl).select('.blip-shape')
        .transition().duration(150)
        .attr('filter', 'url(#blip-glow)');
    }

    hideTooltip() {
      this.tooltip.classList.remove('visible');
      this.svg.selectAll('.blip-shape')
        .transition().duration(150)
        .attr('filter', null);
    }

    navigateToBlip(blip) {
      if (blip.link) {
        window.location.href = blip.link;
      }
    }

    highlightQuadrant(index) {
      this.svg.selectAll('.blip').each(function () {
        const el = d3.select(this);
        const isTarget = el.classed(`blip-q${index}`);
        el.transition().duration(200).style('opacity', isTarget ? 1 : 0.2);
      });
      this.svg.selectAll('.quadrant-label').each(function (d, i) {
        d3.select(this).transition().duration(200).attr('opacity', i === index ? 1 : 0.3);
      });
    }

    unhighlightQuadrant() {
      if (this.activeQuadrant !== null) return;
      this.svg.selectAll('.blip').transition().duration(200).style('opacity', 1);
      this.svg.selectAll('.quadrant-label').transition().duration(200).attr('opacity', 0.85);
    }

    toggleQuadrant(index) {
      if (this.activeQuadrant === index) {
        this.activeQuadrant = null;
        this.unhighlightQuadrant();
      } else {
        this.activeQuadrant = index;
        this.highlightQuadrant(index);
      }
      this.updateBlipList(this.activeQuadrant);
    }

    updateBlipList(quadrantIndex) {
      const listEl = document.getElementById('radar-blip-list');
      if (!listEl) return;

      const blips = quadrantIndex !== null
        ? this.data.blips.filter(b => b.quadrant === quadrantIndex)
        : this.data.blips;

      const grouped = {};
      CONFIG.rings.forEach((r, i) => { grouped[i] = []; });
      blips.forEach(b => grouped[b.ring].push(b));

      let html = '';
      CONFIG.rings.forEach((ring, i) => {
        if (grouped[i].length === 0) return;
        html += `<div class="radar-list-ring">
          <h3 class="radar-list-ring-title" style="color:${ring.color}">${ring.name}</h3>
          <ul class="radar-list-items">`;
        grouped[i].sort((a, b) => a.name.localeCompare(b.name)).forEach(blip => {
          const qColor = CONFIG.quadrants[blip.quadrant].color;
          const moved = blip.moved > 0 ? '<span class="moved-in">&#9650;</span>' :
                        blip.moved < 0 ? '<span class="moved-out">&#9660;</span>' : '';
          html += `<li class="radar-list-item">
            <a href="${blip.link || '#'}" class="radar-list-link">
              <span class="radar-list-id" style="background:${qColor}">${blip.id}</span>
              <span class="radar-list-name">${blip.name}</span>
              ${moved}
            </a>
          </li>`;
        });
        html += '</ul></div>';
      });

      listEl.innerHTML = html;
    }

    drawLegend() {
      const legendEl = document.getElementById('radar-legend');
      if (!legendEl) return;

      let html = '<div class="radar-legend-section"><h4>Rings</h4><ul>';
      CONFIG.rings.forEach(r => {
        html += `<li><span class="legend-dot" style="background:${r.color}"></span>${r.name} &mdash; ${r.description}</li>`;
      });
      html += '</ul></div>';

      html += '<div class="radar-legend-section"><h4>Movement</h4><ul>';
      html += '<li><span class="legend-symbol">&#9650;</span> Moved in (improved)</li>';
      html += '<li><span class="legend-symbol">&#9660;</span> Moved out (declined)</li>';
      html += '<li><span class="legend-symbol">&#9679;</span> No change</li>';
      html += '</ul></div>';

      legendEl.innerHTML = html;
    }

    bindResize() {
      let timeout;
      window.addEventListener('resize', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => this.render(), 250);
      });
    }
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('tech-radar');
    if (!container) return;

    const dataUrl = container.dataset.source || '/data/radar/2026-q2.json';
    const radar = new TechRadar('tech-radar', dataUrl);
    radar.init().then(() => {
      // Populate initial blip list
      radar.updateBlipList(null);
    });
  });
})();

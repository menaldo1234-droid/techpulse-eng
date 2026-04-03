---
title: "Multi-Layer PCB Impedance Control: Signal Integrity Guide"
date: 2026-03-14
description: "Master multi-layer PCB design for high-speed signals. Learn impedance control techniques, trace routing strategies, and signal integrity principles to eliminate timing failures and ensure reliable digital performance."
slug: "pcb-impedance-control-signal-integrity"
draft: false
schema: "Article"
author: "Henry"
categories:
  - "Technology"
tags:
  - "PCB-design"
  - "impedance-control"
  - "signal-integrity"
  - "high-speed-digital"
keywords:
  - "multi-layer PCB impedance control"
  - "high-speed PCB design"
  - "signal integrity PCB routing"
related_radar: []
---

# Designing Multi-Layer [PCBs](https://www.amazon.com/s?k=pcb+prototyping+board&tag=techblips-20) for High-Speed Digital Signals: Impedance Control and Signal Integrity Fundamentals

Your signal arrives at the receiving end 40 picoseconds late, but the clock expects it 35 picoseconds from now. The timing margin evaporates. Your high-speed digital board—carefully routed, meticulously fabricated—begins dropping packets at random intervals. The failure appears intermittent under lab conditions but becomes systematic in production, and debugging reveals the culprit: reflections bouncing back from impedance mismatches buried three layers deep in the stackup.

This scenario plays out regularly in designs pushing 5 Gbps and beyond. The fundamental problem is that **impedance discontinuities create signal reflections that degrade edge quality, introduce jitter, and corrupt data**. Traditional PCB design treats traces as simple copper paths. At high frequencies, they become transmission lines with characteristic impedance determined by trace width, dielectric thickness, and material properties. When a signal encounters an impedance mismatch—say, a 50-ohm trace suddenly narrowing to 45 ohms—part of the energy reflects backward, interfering with the forward-traveling wave and distorting the received signal.

Multi-layer PCBs compound this challenge. Routing high-speed signals across multiple layers, through vias, and past reference plane transitions introduces dozens of potential impedance discontinuities that are invisible on a schematic but lethal to signal integrity.

The solution requires deliberate design: **controlled impedance routing, careful stackup architecture, and electromagnetic simulation before layout**. This article explores how to build that foundation, starting with the physics that makes impedance control non-negotiable, then moving into practical stackup decisions and measurement techniques that separate working designs from marginal ones.

## Introduction

Your production system is dropping packets at 3 AM. The application logs show timeouts and retransmitted frames, but the network stack reports no errors. Your team spends two weeks chasing software—checking buffer implementations, reviewing timing logic, adding instrumentation—only to discover the real culprit: a PCB trace routed too close to a power plane, creating impedance discontinuities that corrupt high-speed signals before they reach the receiver.

This scenario repeats across teams that treat PCB design as someone else's problem. **Signal integrity failures don't announce themselves as hardware issues.** They manifest as bit errors, intermittent lockups, or subtle timing violations that developers mistake for race conditions or firmware bugs. The gap between "our PCB vendor handles that" and "I can reason about why this design choice matters" is where expensive debugging sessions live.

Most engineers operate in one of two extremes. Either they over-specify designs—adding unnecessary layers, expensive materials, and tight tolerances that slow iteration without improving reliability—or they under-specify, discovering too late that their stackup cannot support the signal speeds they need.

This article closes that gap. We examine the physics governing how signals propagate through multi-layer boards, develop practical methods for controlling impedance, and build a framework for validating designs before fabrication. You will learn to read a stackup specification with confidence, recognize the early warning signs of integrity problems, and communicate effectively with manufacturing teams using precise technical language.

**Prerequisites:** familiarity with transmission line fundamentals (how voltage and current propagate), understanding of digital timing concepts like setup and hold times, and comfort reading electrical schematics.

## Section 1: Why Impedance Control Isn't Optional at High Frequencies

### The Moment Your Trace Stops Being a Wire

At 50 MHz and below, you can treat a PCB trace as a simple conductor—voltage travels down it, current flows through it, and Ohm's law governs the relationship. But cross that threshold, and the physics changes fundamentally. Your trace becomes a **transmission line**, a distributed network of inductance and capacitance that propagates signals at roughly two-thirds the speed of light. The characteristic impedance of that line—determined by trace width, dielectric height, and the dielectric constant of your substrate—now controls how signals behave far more than simple resistance does.

This shift matters because modern digital logic does not operate in isolation. A 2-nanosecond rise time (standard for contemporary processors) contains frequency content extending to approximately 350 MHz. At 10 GHz clock speeds, a single bit period lasts just 100 picoseconds—a distance of roughly 1.3 inches along a trace. Within that span, every impedance discontinuity becomes a liability.

### Reflections: The Silent Signal Killer

When a signal encounters an impedance mismatch—a discontinuity between trace impedance and load impedance—part of the energy reflects backward toward the source. This is not a minor loss. The reflected signal interferes with the incident signal, creating overshoot that can exceed supply rails, undershoot that dips below ground, and ringing that extends the settling time. Any of these corrupts data or violates timing margins.

Without impedance control, boards typically experience 15–40% signal degradation over trace length. That forces a choice: accept lower clock speeds, constrain trace routing to short distances, or pay for expensive redesigns.

### Debunking the Misconception

Many engineers believe impedance matching applies only to RF and analog circuits. **This is incorrect.** Any digital signal with a rise time under 1 nanosecond traveling more than 3 inches demands impedance control. The physics is identical—only the frequency range shifts.

## Section 2: Calculating and Controlling Characteristic Impedance

### The Foundation: Characteristic Impedance and the Transmission Line Equation

Every trace on a high-speed PCB is a transmission line, not a simple wire. The moment signal transitions exceed a few hundred picoseconds, the distributed inductance and capacitance along that trace dominate behavior far more than resistance does. The characteristic impedance **Z₀** describes how a trace resists and conducts electromagnetic energy propagating along its length:

**Z₀ = √(L/C)**

where L is inductance per unit length and C is capacitance per unit length. For a microstrip trace—the most common geometry, where a signal layer sits above a ground plane—this simplifies to:

**Z₀ ≈ 87 × log₁₀(5.98 × H / W) / √(εᵣ)**

Here, H is the dielectric thickness separating trace from ground, W is trace width, and εᵣ is the substrate's relative permittivity. This equation reveals the core tension in PCB design: **narrower traces increase impedance; thicker dielectrics increase impedance; materials with higher dielectric constants (like filled epoxy at εᵣ ≈ 4.5) decrease impedance.**

### Standard Impedance Targets and Tolerance Bands

Industry conventions exist for good reason. Single-ended digital signals target **50 ohms**—the standard for logic families and general-purpose interfaces. Differential pairs, used in high-speed serial protocols (PCIe, LVDS, Ethernet), target **100 ohms differential**, which translates to roughly 50 ohms per individual trace. Video and RF applications often require **75 ohms**.

Deviations beyond ±5% from the target introduce measurable reflections. A 50-ohm trace that drifts to 52.5 ohms creates only minor ringing; push it to 55 ohms and you see visible overshoot in eye diagrams. At ±10%, signal integrity degrades sharply—jitter increases, setup-hold margins erode, and bit-error rates climb.

### The Geometry-Impedance Trade-Off

Here is where manufacturing reality collides with electrical requirements. On a typical **4-layer board with 0.5 mm dielectric height**, achieving 50 ohms demands a trace width of approximately **0.15 mm** (6 mils). Move to an **8-layer stackup with 0.1 mm dielectric spacing** between layers, and the same impedance requires **0.08 mm traces**—a 47% reduction. Finer traces mean tighter process windows, higher defect rates, and manufacturing costs that climb 20–30%.

This constraint forces a design choice early: do you accept thicker dielectrics (reducing layer density, increasing board thickness) or invest in tighter manufacturing tolerances? Most production designs split the difference—using 0.10–0.15 mm traces on inner layers where routing density is highest, and slightly wider traces on outer layers where space permits.

### Stackup Design for 3+ GHz Operation

A proven 8-layer stackup for 3 GHz and beyond uses alternating signal and ground planes:

| Layer | Type | Purpose |
|-------|------|---------|
| L1 | Signal | High-speed differential pairs |
| L2 | Ground | Reference for L1 |
| L3 | Signal | Secondary signal layer |
| L4 | Power | VDD distribution |
| L5 | Power | VSS (ground) distribution |
| L6 | Signal | Secondary signal layer |
| L7 | Ground | Reference for L6 and L8 |
| L8 | Signal | General-purpose signals |

Dielectric spacing between L1–L2 is typically 0.10 mm (tight coupling for low impedance), while L3–L4 spacing might be 0.15 mm to accommodate thicker power distribution. This variation is intentional: it allows you to hit 50 ohms on critical signal layers while maintaining adequate capacitance in the power distribution network.

### Automated Impedance Calculation

Rather than hand-calculating trace widths for each stackup variant, use a script to generate a design report. Here is a [Python](https://www.amazon.com/s?k=python+programming+book&tag=techblips-20) tool that accepts stackup parameters and outputs required trace widths:

```python
import math

def calculate_microstrip_impedance(trace_width_mm, dielectric_height_mm, 
                                   relative_permittivity):
    """
    Calculate microstrip characteristic impedance using the standard approximation.
    Returns impedance in ohms.
    """
    ratio = (5.98 * dielectric_height_mm) / trace_width_mm
    log_term = math.log10(ratio)
    z0 = 87 * log_term / math.sqrt(relative_permittivity)
    return z0

def find_trace_width_for_target(target_impedance, dielectric_height_mm, 
                                relative_permittivity, initial_guess_mm=0.2):
    """
    Binary search to find trace width that yields target impedance.
    Returns trace width in mm.
    """
    low, high = 0.01, 1.0
    tolerance = 0.1  # ±0.1 ohm tolerance
    
    while (high - low) > 0.001:
        mid = (low + high) / 2
        z0 = calculate_microstrip_impedance(mid, dielectric_height_mm, 
                                            relative_permittivity)
        if z0 < target_impedance - tolerance:
            high = mid  # Impedance too low, need narrower trace
        else:
            low = mid   # Impedance too high, need wider trace
    
    return (low + high) / 2

# Example: 8-layer stackup, 3 GHz design
stackup = [
    {"layer": "L1", "dielectric_height": 0.10, "permittivity": 4.2},
    {"layer": "L3", "dielectric_height": 0.15, "permittivity": 4.2},
    {"layer": "L6", "dielectric_height": 0.15, "permittivity": 4.2},
    {"layer": "L8", "dielectric_height": 0.10, "permittivity": 4.2},
]

targets = {"single_ended": 50, "differential": 100, "video": 75}

print("PCB Impedance Design Report\n" + "="*50)
for layer_info in stackup:
    print(f"\n{layer_info['layer']} (H={layer_info['dielectric_height']} mm, "
          f"εᵣ={layer_info['permittivity']})")
    for signal_type, target in targets.items():
        width = find_trace_width_for_target(target, layer_info['dielectric_height'], 
                                            layer_info['permittivity'])
        actual_z0 = calculate_microstrip_impedance(width, 
                                                   layer_info['dielectric_height'],
                                                   layer_info['permittivity'])
        print(f"  {signal_type:15} {target:3d}Ω → trace width: {width:.3f} mm "
              f"(actual: {actual_z0:.1f}Ω)")
```

Run this against your stackup parameters—dielectric heights from your fabricator, permittivity from the material datasheet—and you get a dimensioned roadmap for layout. No guessing, no iteration loops with manufacturing.

### Actionable Design Checkpoint

Before you commit a stackup to fabrication, verify three things: (1) your target trace widths are manufacturable (check your fabricator's minimum trace width and spacing rules), (2) the impedance tolerance band is ±5% or tighter, and (3) you have accounted for solder mask thickness, which adds approximately 0.05 mm of dielectric and shifts impedance by 1–2 ohms. A 0.15 mm trace that looks perfect in simulation can fail in production if solder mask thickness is not modeled.

## Section 3: Stackup Design and Layer Planning

Your stackup is not a detail to finalize after routing. It is the foundation that makes impedance control possible—or impossible. A poor stackup forces you to fight physics during layout; a good stackup makes controlled impedance straightforward.

### What a Stackup Is

A stackup is the ordered specification of every copper and dielectric layer in your board, listed top to bottom. For each layer, you define its thickness, material (FR-4, polyimide, etc.), and function (signal, ground, power, or mixed). A 6-layer stackup might look like:

- L1: Signal (35 µm copper)
- L2: Ground plane (35 µm copper)
- L3: Signal (35 µm copper)
- L4: Power plane (35 µm copper)
- L5: Signal (35 µm copper)
- L6: Ground plane (35 µm copper)

This specification controls everything downstream: trace width calculations, via placement rules, and whether your 3 GHz clock arrives at the receiver intact or degraded.

### Ground and Power Plane Placement

**Place a ground plane directly adjacent to every signal layer.** The spacing between signal and ground should be 0.1–0.2 mm. This thin dielectric creates a low-impedance return path and collapses loop inductance—the enemy of signal integrity.

Power planes require equal care. Pair each power plane with a ground plane, separated by minimal dielectric thickness (0.1 mm or less). This capacitive coupling suppresses power delivery noise and stabilizes voltage rails during high-current switching events.

### The Symmetry Principle

Multi-layer boards must be **symmetric about the centerline**. If layer 1 is signal, layer 8 must be signal. If layer 2 is ground, layer 7 must be ground. Asymmetry causes differential thermal expansion during manufacturing, warping the board and scattering impedance values across traces.

### Cost and Performance Trade-offs

Board layer count directly correlates with cost and capability:

| Layer Count | Cost/Unit (Volume) | Max Frequency | Best For |
|---|---|---|---|
| 4-layer | $2–4 | ~500 MHz | Simple digital, analog mixed-signal |
| 6-layer | $4–8 | ~2 GHz | Mid-speed digital, moderate complexity |
| 8-layer | $8–15 | 3+ GHz | High-speed digital, tight impedance specs |
| 10-layer | $15–25 | 3+ GHz | Dense designs, multiple power domains |

A 6-layer board costs roughly double a 4-layer but unlocks 4× the bandwidth by providing dedicated planes and tighter impedance control.

### Manufacturing Reality: The Critical Anti-Pattern

**Do not design a stackup in isolation.** A specification calling for 0.05 mm dielectric spacing may be electrically optimal but impossible to manufacture reliably. Tolerances compound: layer thickness, dielectric shrinkage, and via drilling all vary.

Before finalizing your stackup, contact your manufacturer and confirm:

- Minimum dielectric thickness they can reliably produce
- Layer thickness tolerances (typically ±10%)
- Via drilling accuracy (typically ±0.05 mm)
- Whether your proposed layer count fits their standard panel sizes

A stackup that ignores these constraints will either fail design rule checks at fabrication or arrive with impedance values scattered across your target range—rendering your careful trace width calculations useless.

## Section 4: Trace Routing and Return Path Management

The path current takes returning to its source often determines whether a high-speed design works reliably or fails in the field. Current does not flow back through the air; it seeks the lowest-impedance route available. On a multi-layer board, this typically means the ground plane directly beneath or nearest to the signal trace. When that path is blocked by layer transitions, power planes, or routing congestion, return current spreads across a longer loop, inductance climbs, and signal integrity collapses.

### Return Path Fundamentals

Every signal trace on a multi-layer PCB forms a loop with its return path. The loop inductance directly controls overshoot, undershoot, and electromagnetic radiation. A signal transitioning between layers without a nearby return via forces current to travel horizontally across the ground plane, extending the loop area and degrading performance. **Place a return via (or via pair) within 0.5 mm of every signal via.** For critical signals, use 2–4 return vias in parallel to further reduce inductance and distribute current.

### Routing Topology for High-Speed Integrity

Trace geometry affects impedance at every bend. **Use 45-degree angles instead of 90-degree corners**—sharp corners create localized impedance discontinuities that reflect energy. Route high-speed differential pairs on the same layer with consistent spacing (typically 0.15 mm for 100 ohm pairs); avoid sandwiching them between power planes or unrelated signal layers. **Match trace lengths within 10 mils (0.25 mm) for differential pairs** to prevent skew-induced timing errors.

Crosstalk emerges when traces run closer than 3× their height above ground. For a 0.1 mm trace height, maintain minimum 0.3 mm spacing; increasing spacing to 0.5 mm reduces coupling by approximately 60%. A practical design rule set enforces trace widths (0.15 mm for 50 ohm single-ended, 0.1 mm per trace for 100 ohm differential), minimum spacing (0.2 mm signal-to-signal, 0.5 mm for high-speed pairs), and return via placement within 0.5 mm of signal transitions. These constraints, codified in your PCB tool's design rules, prevent expensive re-spins.

## Section 5: Termination Strategies and Reflection Management

When a high-speed signal reaches an unterminated trace end, it does not simply vanish. Instead, the signal reflects backward toward the source with inverted polarity—a phenomenon that creates a ghost signal traveling in reverse. This reflected energy collides with the original signal still propagating forward, causing constructive and destructive interference that manifests as overshoot, undershoot, ringing, and ultimately bit errors or timing violations. Termination absorbs this reflected energy and prevents the collision.

### Series Termination: Speed at the Cost of Reach

Placing a resistor (typically 25–50 ohms) directly in series with the driver slows the signal's rise time slightly and dissipates reflected energy before it propagates back. The trade-off is straightforward: a 50-ohm series resistor on a 3.3V signal with 100 pF load capacitance introduces approximately 0.5 nanoseconds of additional delay. Series termination excels for point-to-point connections but fails on multi-drop buses, where multiple receivers share a single trace—the termination resistor only matches impedance for the final receiver, leaving earlier nodes exposed to reflections.

### Parallel Termination: Power for Flexibility

Pull-up or pull-down resistors connected from the signal line to supply or ground at the receiver end match trace impedance and absorb reflections effectively. A 50-ohm parallel termination on a 3.3V line consumes approximately 66 milliwatts of static power—a significant penalty in power-constrained designs. However, this approach scales across multi-drop architectures where multiple receivers coexist on the same net.

### AC Termination: Cutting Power Without Sacrificing Performance

Inserting a capacitor (typically 100 nanofarads) in series with the termination resistor blocks DC current while preserving AC reflection absorption. This reduces power consumption to roughly 5 milliwatts—a 13× improvement over DC termination. The critical constraint: the capacitor's impedance must match the trace impedance at the signal's fundamental frequency. Miscalculation here reintroduces reflections at higher harmonics.

### Practical Placement and Selection

Termination resistance should approximate trace impedance: 50 ohms for single-ended signals, 100 ohms for differential pairs. Position termination within 0.5 inches (12 millimeters) of the receiver for high-speed signals; greater distances allow reflections to develop before absorption occurs. Measure twice, terminate once—incorrect values create the very reflections you are trying to eliminate.

## Section 6: Via Transitions and Layer-to-Layer Impedance Matching

A signal that travels cleanly across a single layer can unravel the moment it transitions to another layer via a via. The culprit is rarely the via itself—it is the impedance discontinuity introduced by the transition geometry. When a via pad oversizes relative to the trace, when the reference plane changes mid-transition, or when the landing trace width differs from the source trace, the signal encounters a sudden change in characteristic impedance. High-frequency energy reflects at these boundaries, creating jitter, overshoot, and signal degradation downstream.

### Pad Sizing and Parasitic Capacitance

Via pads should match the trace width with minimal clearance—typically trace width plus 0.1 mm on each side. Oversized pads (common in designs prioritizing routing simplicity) create a capacitive load that appears as a localized impedance dip. This discontinuity can introduce 5–15 ohms of mismatch, enough to cause 10–20% signal reflections. The effect scales with frequency: a pad that seems benign at 1 GHz becomes a significant problem at 10 GHz.

### Back-Drilling and Blind Vias

For signals above 5 GHz, back-drilling—removing the unused via stub extending beyond the target layer—reduces parasitic capacitance by approximately 30–40%. Blind vias (which do not traverse the entire board) eliminate stubs entirely but add routing constraints. Back-drilling typically adds 15–20% to board cost; for high-speed designs, this investment pays for itself in first-pass yield.

### Validation with TDR

Time-domain reflectometry (TDR) reveals what layout rules hide. A well-designed trace shows a flat impedance profile; via transitions appear as voltage spikes in the TDR waveform. Measure the actual impedance profile across layer transitions before committing to fabrication—discontinuities caught in simulation save costly respins.

## Section 7: Validation: Simulation, Measurement, and Testing

### Simulation Before Fabrication

Simulation bridges the gap between design intent and physical reality. Before committing to fabrication, you need three complementary simulation layers: electromagnetic field analysis to verify impedance, behavioral transient analysis to predict signal quality, and time-domain reflectometry to expose how your board responds to fast edges.

### The Impedance Extraction Workflow

Start by exporting your PCB stackup and trace geometry from your layout tool. Import this into an electromagnetic field solver and run a 2D cross-section analysis at your target signal frequency. The solver calculates impedance from the conductor dimensions, dielectric constant, and spacing to return paths. Compare the result to your design target—**±10% tolerance is the engineering standard**. If measured impedance drifts beyond this band, adjust trace width or layer spacing and re-run. This iterative loop catches stackup mismatches before manufacturing.

### Signal Integrity Transient Analysis

Build a behavioral model combining driver characteristics (output impedance, edge rate), trace properties (impedance, insertion loss, propagation delay), and receiver loading (input capacitance, switching threshold). Run transient analysis over multiple bit periods to capture overshoot, undershoot, and timing skew. Plot the resulting voltage waveforms—this is your eye diagram, the visual signature of signal health. A clean eye shows wide vertical margins and centered horizontal timing. Degraded eyes narrow and tilt, signaling reflections, crosstalk, or excessive loss.

### Physical Validation

Measure S-parameters on a test coupon using a network analyzer to extract actual impedance from the fabricated board. Expect **5–8% agreement** with simulation if your stackup and routing matched design intent. Capture high-speed signal waveforms in the system and overlay them to form the eye diagram. A well-executed 3.2 GHz differential design on six layers delivers **200 mV vertical margin and 200 ps horizontal margin**; poor designs on identical layer counts show 50–100 mV, forcing lower speeds or redesign.

## Section 8: Troubleshooting Signal Integrity Issues

When a high-speed board fails in the field—intermittent bit errors that vanish when you cool the board, timing violations that appear only at specific clock frequencies, or crosstalk that corrupts one signal but leaves its neighbor untouched—you are observing the physical consequences of impedance, loss, and coupling. Effective troubleshooting requires mapping the symptom back to the design parameter that caused it.

### Symptom-to-Root-Cause Mapping

**Intermittent bit errors at specific clock speeds or under thermal stress** typically point to impedance mismatch or failed termination. Use a time-domain reflectometer (TDR) to measure impedance directly on the routed trace; discontinuities of ±10% or more create reflections. Verify termination resistor values against your driver and receiver specifications—a 50Ω terminator on a 65Ω trace will not adequately damp reflections. Check for hidden discontinuities: via transitions between layers, width changes, or abrupt layer shifts introduce impedance steps that TDR will reveal as sharp spikes.

**Signal overshoot or undershoot exceeding 20% of the signal swing** indicates under-damped reflections. Add series resistance at the driver (22–47Ω) to slow edge rates and dissipate reflected energy. Alternatively, increase parallel termination resistance or reduce trace impedance discontinuities. Series capacitance (100–470pF) can further slow rise times without degrading noise margins.

**Timing violations that worsen under temperature** but do not correlate with clock speed suggest dielectric loss or temperature-dependent trace resistance. Reduce trace length where possible, increase trace width to lower DC resistance, or migrate to materials with lower loss tangent at your operating frequency.

**Crosstalk-induced bit errors in adjacent signals** require spatial separation: maintain 3× trace height spacing above ground, route aggressor and victim on different layers with ground planes between them, or implement differential signaling, which inherently rejects common-mode coupling.

### Root Cause Analysis Workflow

1. **Correlate the failure mode** (bit errors, timing violations, signal corruption) with the physical design
2. **Simulate the failure** using your extracted netlist and layer stackup to reproduce the observed behavior
3. **Identify the design parameter** (trace width, spacing, termination, via placement) that drives the failure
4. **Iterate and re-validate** with updated layouts and measurements

This disciplined approach transforms vague field reports into concrete design fixes.

## Section 9: Practical Example—Designing a 3.2 GHz Serial Interface on a 6-Layer Board

Your product team has four weeks to integrate a 3.2 GHz serial interface onto a board that already carries power distribution, analog circuits, and legacy I/O. The existing stackup was designed for 1 GHz signals and general-purpose routing. Space is tight. Manufacturing windows are closing. This scenario forces a hard engineering choice: retrofit the stackup, or redesign it entirely.

### Auditing the Existing Stackup

Start by documenting the current layer arrangement and material properties. Request the stackup file from your fabricator—it should specify copper weight, dielectric thickness, and material type for each layer pair. Measure or calculate the impedance of existing traces using your design tool's field solver, targeting a representative signal path on each layer.

For a typical 6-layer board optimized for 1 GHz, you will often see:

- **Layer 1 (top):** Signal traces, 8 mil width, 5 mil clearance
- **Layer 2:** Power plane or mixed signal/ground
- **Layer 3:** Ground plane
- **Layer 4:** Mixed signal/power
- **Layer 5:** Signal traces
- **Layer 6 (bottom):** Signal and ground

This arrangement leaves little headroom for controlled-impedance differential pairs at 3.2 GHz. The dielectric spacing between signal and return is often 4–6 mils, which produces impedance values 10–20 ohms higher than your 100 ohm target. Tighter trace geometries (narrower width, reduced clearance) help, but shrinking traces below 3 mils risks manufacturing yield issues and increases via stub effects.

### Stackup Redesign Strategy

Rather than fighting the existing stackup, allocate **Layer 1 exclusively to high-speed differential pairs**. Pair it with Layer 2 as a dedicated ground return plane, separated by 2.5–3 mil dielectric. This microstrip geometry delivers stable 100 ohm differential impedance with minimal crosstalk coupling to the analog and power circuits below.

Reserve Layers 3–6 for existing functions: power distribution, ground planes, and legacy signal routing. This vertical separation acts as a natural shield, reducing electromagnetic coupling between your 3.2 GHz interface and sensitive analog stages.

Your 4-week timeline becomes feasible when you preserve the lower-layer design and minimize validation cycles on proven circuitry.

---


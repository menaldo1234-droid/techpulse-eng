---
title: "ZED X Mini + Jetson: The Setup That Actually Works"
date: 2026-04-05
draft: false
tags: ["jetson", "zed-camera", "robotics"]
description: "Spent a month getting ZED X Mini working on Jetson Orin NX. Here's the exact combination that works and everything I ruled out."
author: "Henry"
categories:
  - "Technology"
---

## Bottom Line

| | Doesn't Work | Works |
|---|---|---|
| **Board** | reComputer J4012 (15-pin CSI) | Waveshare Orin NX (22-pin CSI) |
| **JetPack** | 6.1, 6.2.0 | **6.2.1** |
| **Cable** | 22→15-pin adapter | Native 22-pin direct connection |

> Everything outside this combination failed silently. No errors. The camera just doesn't exist.

<!-- Insert working camera feed photo/video here -->
<!-- ![ZED X Mini camera feed working](/images/zed-working.jpg) -->

---

## What Doesn't Work (Save Yourself the Time)

### 1. reComputer J4012 + CSI Adapter Cable

The 22→15 adapter fits physically into a 15-pin CSI board. **But nothing shows up on the I2C bus.**

```bash
sudo i2cdetect -y -r 9
# → All empty. Camera doesn't exist.
```

The issue isn't the pin count difference — **the signal routing is fundamentally different.** No adapter fixes this.

### 2. JetPack 6.1

Community posts claim "ZED X only supports up to 6.1" — **wrong.** Flashing 6.1 kept failing entirely on my hardware.

---

## What Works (Follow This Exactly)

### Final Stack

| Component | Version |
|-----------|---------|
| JetPack | **6.2.1** (L4T 36.4.0) |
| ZED SDK | 5.2.1 |
| ZED Link | 1.4.0-L4T36.4.0 |
| Board | Native 22-pin CSI board |

### Install (3 Commands)

```bash
sudo apt install zed-link
sudo apt install zed-sdk
zed-explorer  # verify camera feed
```

### Verify It's Working

```bash
sudo i2cdetect -y -r 9
# → Addresses visible = GMSL2 deserializer connected successfully
```

When `i2cdetect` shows addresses, that's **the first sign your hardware connection succeeded.** Run `zed-explorer` next and you should see live video immediately.

<!-- Insert i2cdetect success screenshot here -->
<!-- ![i2cdetect output](/images/i2cdetect-success.png) -->

<!-- Insert zed-explorer camera feed video here -->
<!-- {{< youtube "VIDEO_ID" >}} -->

---

*Personal hardware notes from robotics research. No affiliation with Stereolabs or NVIDIA.*

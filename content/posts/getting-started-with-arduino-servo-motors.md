---
title: "Getting Started with Arduino Servo Motors: A Practical Guide"
date: 2026-03-14T08:00:00+09:00
draft: false
tags: ["Arduino", "Servo Motors", "Embedded Systems", "Robotics"]
categories: ["Technology"]
description: "Learn how to control servo motors with Arduino. This beginner-friendly guide covers wiring, code examples, and practical tips for your first robotics project."
keywords: ["arduino servo motor", "servo motor tutorial", "arduino robotics", "SG90 servo"]
author: "Henry"
ShowToc: true
TocOpen: false
---

## Introduction

Servo motors are one of the most versatile actuators in robotics and embedded systems. Whether you're building a robotic arm, a pan-tilt camera mount, or an automated door lock, understanding how to control servos with Arduino is a fundamental skill every engineer should have.

In this guide, we'll walk through everything you need to know to get your first servo motor spinning with precision.

## What You'll Need

Before we dive in, gather these components:

- **Arduino UNO** (or any compatible board)
- **SG90 Micro Servo** (the most common starter servo)
- **Jumper wires** (3 pieces: signal, power, ground)
- **USB cable** for programming

The SG90 is an excellent choice for beginners. It operates on 4.8-6V, provides roughly 1.8 kg·cm of torque, and rotates through a 180-degree range. At roughly $2-3 per unit, it's also incredibly affordable.

## Wiring Diagram

The SG90 has three wires:

| Wire Color | Connection |
|-----------|-----------|
| Brown/Black | GND |
| Red | 5V |
| Orange/Yellow | Signal (PWM pin) |

Connect the signal wire to **pin 9** on your Arduino. This pin supports PWM (Pulse Width Modulation), which is how we communicate position data to the servo.

## Basic Code: Sweep Example

Here's the classic sweep program that moves the servo back and forth:

```cpp
#include <Servo.h>

Servo myServo;

void setup() {
  myServo.attach(9);  // Signal wire on pin 9
}

void loop() {
  // Sweep from 0 to 180 degrees
  for (int angle = 0; angle <= 180; angle++) {
    myServo.write(angle);
    delay(15);  // 15ms per degree for smooth motion
  }

  // Sweep back from 180 to 0
  for (int angle = 180; angle >= 0; angle--) {
    myServo.write(angle);
    delay(15);
  }
}
```python
Upload this sketch, and your servo should sweep smoothly from one extreme to the other.

## Understanding PWM and Servo Control

Servos expect a PWM signal with a period of 20ms (50Hz). The pulse width determines the angle:

- **1ms pulse** → 0 degrees
- **1.5ms pulse** → 90 degrees (center)
- **2ms pulse** → 180 degrees

The Arduino `Servo.h` library handles this timing for you, but understanding the underlying mechanism helps when troubleshooting or working with non-standard servos.

## Controlling Multiple Servos

The Arduino UNO can control up to 12 servos simultaneously. Here's how to drive two servos independently:

```cpp
#include <Servo.h>

Servo panServo;
Servo tiltServo;

void setup() {
  panServo.attach(9);
  tiltServo.attach(10);
}

void loop() {
  panServo.write(90);   // Center position
  tiltServo.write(45);  // 45-degree tilt
  delay(1000);

  panServo.write(0);
  tiltServo.write(90);
  delay(1000);
}
```python
## Common Issues and Solutions

### Servo Jittering

If your servo vibrates or jitters at rest, try these fixes:

1. **Add a capacitor**: Place a 100µF electrolytic capacitor across the servo's power and ground lines
2. **Use external power**: The Arduino's 5V regulator can only supply about 500mA. Multiple servos need a dedicated 5V supply
3. **Detach when idle**: Call `myServo.detach()` when the servo doesn't need to hold position

### Servo Not Reaching Full Range

Some servos don't respond to the standard 1-2ms pulse range. Use `attach()` with custom microsecond values:

```cpp
myServo.attach(9, 500, 2500);  // Extended range
```python
## Practical Project: Simple Robotic Gripper

Let's build something useful. A two-servo gripper uses one servo for the grip and another for wrist rotation:

```cpp
#include <Servo.h>

Servo gripServo;
Servo wristServo;

const int GRIP_OPEN = 10;
const int GRIP_CLOSED = 80;

void setup() {
  gripServo.attach(9);
  wristServo.attach(10);
  Serial.begin(9600);
  gripServo.write(GRIP_OPEN);
  wristServo.write(90);
}

void loop() {
  if (Serial.available()) {
    char cmd = Serial.read();
    switch (cmd) {
      case 'o': gripServo.write(GRIP_OPEN); break;
      case 'c': gripServo.write(GRIP_CLOSED); break;
      case 'l': wristServo.write(0); break;
      case 'r': wristServo.write(180); break;
      case 'n': wristServo.write(90); break;
    }
  }
}
```

Send single characters through the Serial Monitor: `o` to open, `c` to close, `l`/`r` to rotate, `n` to center.

## What's Next

Once you're comfortable with basic servo control, explore these topics:

- **PID control** for smooth, precise positioning
- **Inverse kinematics** for multi-joint robotic arms
- **ROS integration** for advanced robotics projects
- **Continuous rotation servos** for wheeled robots

## Conclusion

Servo motors bridge the gap between digital signals and physical motion. With just three wires and a few lines of code, you can add precise angular control to any project. Start with the sweep example, experiment with the gripper project, and you'll quickly develop the intuition needed for more complex robotics applications.

The key takeaway: always use external power for multiple servos, understand your servo's actual pulse range, and don't hesitate to detach servos when they don't need to hold position. These habits will save you hours of debugging.

---
title: "Supabase"
date: 2026-04-01
type: "radar-blip"
draft: false
ring: "Adopt"
quadrant: "Platforms & APIs"
moved: 0
description: "Open-source Firebase alternative with Postgres, auth, realtime, and edge functions."
---

## What is it?

Supabase provides a complete backend platform built on PostgreSQL. It includes authentication, real-time subscriptions, edge functions, storage, and a REST/GraphQL API — all auto-generated from your database schema. Being open-source, you can self-host or use their managed service.

## Why does it matter?

Supabase eliminates the "backend boilerplate tax" that slows down every new project. Instead of spending two weeks building auth, CRUD APIs, and file upload — you get a production-ready backend from a database schema in minutes. The PostgreSQL foundation means you're never locked into a proprietary query language.

## Trade-offs

**Strengths:**
- PostgreSQL under the hood (full SQL, extensions, pg_vector for AI)
- Row-level security for fine-grained access control
- Real-time subscriptions out of the box
- Self-hosting option eliminates vendor lock-in concerns
- Generous free tier for side projects

**Limitations:**
- Edge functions are Deno-based (different ecosystem from Node.js)
- Complex migrations require PostgreSQL expertise
- Real-time at scale requires careful subscription management
- Dashboard can obscure underlying database complexity

## Our take

For any new SaaS project, Supabase is our default starting point. The combination of managed Postgres, built-in auth, and auto-generated APIs lets a solo developer ship a production backend in days instead of weeks. We've been running it in production since 2025 with zero regrets.

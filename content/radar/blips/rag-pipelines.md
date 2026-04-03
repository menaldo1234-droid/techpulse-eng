---
title: "RAG Pipelines"
date: 2026-04-01
type: "radar-blip"
draft: false
ring: "Adopt"
quadrant: "AI & ML"
moved: 0
description: "Retrieval-Augmented Generation is the default architecture for production LLM applications."
---

## What is it?

RAG (Retrieval-Augmented Generation) combines vector search with LLM generation. Instead of relying solely on a model's training data, RAG retrieves relevant documents from your own data store and feeds them as context to the LLM. This grounds responses in your specific domain knowledge.

## Why does it matter?

RAG solves the two biggest problems with vanilla LLM deployments: hallucination and stale knowledge. By anchoring generation in retrieved documents, you get factual responses that reflect your current data — without the cost and complexity of fine-tuning.

## Trade-offs

**Strengths:**
- Dramatically reduces hallucination for domain-specific queries
- Works with any LLM without model modification
- Data stays current without retraining
- Cost-effective compared to fine-tuning

**Limitations:**
- Retrieval quality directly limits generation quality (garbage in, garbage out)
- Chunking strategy is a critical design decision with no universal solution
- Embedding model choice significantly affects retrieval accuracy
- Complex queries requiring reasoning across multiple documents remain challenging

## Our take

RAG is a solved pattern for most enterprise LLM use cases. The tooling (LlamaIndex, LangChain, custom pipelines) is mature, embedding models are commodity, and vector databases are production-ready. We keep this at **Adopt** — if you're building an LLM application that needs domain knowledge, RAG should be your starting architecture.

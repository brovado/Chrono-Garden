# Chrono-Garden

A garden sandbox where plants grow, evolve, and mutate over time.

**Playable prototype:** the repository now contains the first vertical slice of the game.

The player's collection becomes the engine that improves the game's mini-games, while mini-games provide Tickets that let the player accelerate Garden Time.

## Play the Prototype

Once GitHub Pages finishes its first deployment:

**https://brovado.github.io/Chrono-Garden/**

The current prototype is intentionally small:

- 6 garden plots
- 3 starter plants
- Plant growth stages
- Garden Time
- Tickets
- Ticket deposits
- Mutation discoveries
- Persistent browser save
- Firefly-catching Ticket mini-game
- Basic Almanac

## Core Loop

**Plant → Wait → Mutate → Discover → Earn Tickets → Advance Time → Repeat**

The important distinction is that mature plants remain in the garden. The player is encouraged to leave interesting plants growing because additional time creates additional opportunities for evolution and mutation.

## Current Design Status

The following sections are the signed-off foundation of the game:

1. Fantasy
2. Core Loop
3. Garden
4. Mutation System
5. Mutation Types
6. Mutation Rules
7. Plant Persistence
8. Tickets
9. Time Deposits
10. Mini-Games
11. Mini-Game Bonuses
12. Plant Specialization
13. The Feedback Loop
14. Plant Collection / Almanac
15. Rarity
16. Discovery Moments
17. Core Resources

See [docs/GAME-SPEC.md](docs/GAME-SPEC.md) for the full specification.

## Design Pillar

> The player should always have something interesting growing.

The garden should create curiosity rather than obligation:

**"Something might happen if you give me a little more time."**

## Prototype Scope

This build is a proof of the core loop, not the finished game.

The mutation thresholds are deliberately simple and deterministic for now so the underlying loop can be tested before adding probability, larger mutation trees, plant bonuses, more mini-games, and deeper collection content.

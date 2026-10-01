# Chrono-Garden — Game Specification

**Status:** Core design signed off  
**Scope:** Sections 1–17  
**Project:** Chrono-Garden

---

## 1. The Fantasy

Chrono-Garden is a persistent garden sandbox where plants are not simply grown and harvested.

**They change.**

The player begins with ordinary plants. Over time, plants can evolve, mutate, and become unusual variants.

The goal is not simply to grow the most plants. It is to discover what can happen when individual plants are given enough time.

The garden is a living collection.

---

## 2. The Core Loop

The fundamental game loop is:

**Plant → Wait → Mutate → Discover → Earn Tickets → Advance Time → Repeat**

More specifically:

1. Plant a plant.
2. Allow Garden Time to pass.
3. Plants grow through their lifecycle.
4. Plants receive opportunities to mutate.
5. Discover new plant variants.
6. Use discovered plants to improve mini-games and garden progression.
7. Play mini-games to earn Tickets.
8. Deposit Tickets to advance Garden Time.
9. Return to the garden and see what has changed.

The garden and mini-games form a feedback loop rather than two disconnected systems.

---

## 3. The Garden

The garden is the player's persistent sandbox.

Plants occupy garden plots and progress through stages.

A basic lifecycle can be represented as:

**Seed → Sprout → Young → Mature → Evolved → Mutated → Special Variant**

This is a conceptual progression rather than a requirement that every plant follow exactly the same sequence.

A plant is fundamentally defined by its:

- Base species
- Age
- Growth state
- Mutations
- Mutation history
- Potential future mutations
- Gameplay bonuses

Example:

**Rose**

- Age: 18 Garden Hours
- Mutations:
  - Large
  - Crimson
  - Thorny
- Possible future mutations:
  - Crystal
  - Golden
  - Ancient
  - Unknown

---

## 4. Mutation System

Mutation is the heart of Chrono-Garden.

Each plant has a collection of possible mutations.

Mutations become possible as the plant ages.

For example:

- At planting: essentially no mutation opportunity
- Young: low mutation opportunity
- Mature: increased opportunity
- Old: increased opportunity
- Ancient: high opportunity

The exact numerical rates are implementation/balance details and are not yet locked.

### Important Rule

**Time creates opportunities rather than guaranteeing mutations.**

Keeping a plant alive longer is therefore a gamble with potential.

A plant might remain ordinary for a long time.

Another may progress through several mutations.

The player should never know exactly what the next growth period will produce.

---

## 5. Mutation Types

Mutations can be organized into categories.

### Physical

Changes the plant's physical form.

- Large
- Tiny
- Tall
- Wide
- Twisted
- Drooping

### Color

Changes the plant's coloration.

- Golden
- Crimson
- Blue
- Rainbow
- Black
- White

### Environmental

Gives the plant unusual environmental properties.

- Glowing
- Frozen
- Burning
- Crystal
- Shadow
- Celestial

### Biological

Changes its biological characteristics.

- Thorned
- Many-petaled
- Multiple stems
- Carnivorous
- Fungal
- Insect-eating

### Temporal

Mutations connected directly to time.

- Ancient
- Fossilized
- Withered
- Eternal
- Time-touched

### Compound Mutations

Multiple mutations can combine.

For example:

**Golden + Crystal + Ancient = Ancient Golden Crystal Rose**

This allows the number of possible variants to grow dramatically without requiring every variant to be designed as a completely separate base plant.

---

## 6. Mutation Rules

Plants should not randomly mutate into absolutely anything.

Each base plant has a mutation tree.

Example:

**ROSE**

- Large
  - Giant
  - Colossal
- Golden
  - Radiant
- Thorny
  - Razor
- Strange
  - Crystal
    - Prismatic
  - Shadow
    - Void

The full tree does not necessarily need to be shown to the player.

Discovery itself is gameplay.

Players can gradually learn which mutation paths exist.

---

## 7. Plant Persistence

Plants are **not harvested when they reach maturity**.

They remain in the garden.

This is one of the defining differences between Chrono-Garden and a conventional farming game.

A player might have a Rose that has been growing for 47 hours.

The player may not want to remove it because:

**"What if it mutates again?"**

This creates attachment to individual plants.

Some plants should eventually feel more like treasures—or even pets—than crops.

---

## 8. Tickets

Tickets are the active currency used to manipulate Garden Time.

Mini-games generate Tickets.

Tickets can then be deposited into the garden to advance its internal time.

Example:

**100 Tickets → +1 Garden Hour**

The exact conversion rate is a balance value and is not yet locked.

Plant discoveries and progression can improve this conversion.

Example:

- Base: 100 Tickets → +1 hour
- Plant bonus: +15%
- Garden bonus: +25%
- Final result: 100 Tickets → +1.4 hours

The collection therefore directly improves the player's ability to accelerate the garden.

---

## 9. Time Deposits

Ticket spending should be an intentional action rather than an invisible automatic conversion.

A conceptual interface:

**TIME BANK**

- Tickets Available: 427
- Garden Time: Day 14 — 08:32
- Deposit: 100 Tickets
- Estimated Time: +1h 20m
- **ADVANCE GARDEN**

The player should be able to see how much Garden Time a deposit will create before committing it.

This creates anticipation, especially when a plant is approaching a growth or mutation threshold.

---

## 10. Mini-Games

Mini-games are the active gameplay side of Chrono-Garden.

Their primary purpose is to generate Tickets.

They should remain distinct from the garden rather than becoming alternate versions of farming.

The player actively plays a mini-game, earns Tickets, then returns to the garden and decides how to spend those Tickets on time.

---

## 11. Mini-Game Bonuses

Plants provide bonuses to mini-games.

Example:

### Golden Sunflower

**Garden Effect**

+5% Time from Ticket Deposits

**Mini-Game Effect**

Sun Catcher:
+10% Ticket multiplier

### Crystal Mushroom

**Garden Effect**

+2% Mutation Chance

**Mini-Game Effect**

Memory Maze:
+1 Extra Life

### Thorn Rose

**Garden Effect**

+15% Garden Time

**Mini-Game Effect**

Pruning Panic:
+20% score from perfect cuts

The collection is therefore mechanically meaningful.

Plants are not merely cosmetic collectibles.

---

## 12. Plant Specialization

Plants should specialize rather than simply providing small bonuses to everything.

Possible specializations include:

### Ticket Generation

Improves mini-game rewards.

### Time Conversion

Makes Tickets advance Garden Time further.

### Mutation

Improves mutation opportunities or mutation outcomes.

### Mini-Game Specific

Improves performance in a particular mini-game.

### Rare Mutation

Improves the chance of discovering unusual or high-tier mutations.

This allows players to develop different collection strategies.

---

## 13. The Feedback Loop

The long-term progression should form a spiral:

**Discover a rare plant**

↓

The plant improves a mini-game.

↓

The mini-game produces Tickets faster.

↓

Tickets accelerate Garden Time.

↓

Plants receive more mutation opportunities.

↓

Another rare plant is discovered.

↓

The player's mini-games become stronger.

↓

Repeat.

Progression therefore compounds through discovery.

The numbers are machinery.

**The discoveries are the reward.**

---

## 14. Plant Collection / Almanac

Chrono-Garden should have a Plant Almanac that records discovered species and variants.

Conceptual structure:

**PLANT ALMANAC**

- Rose — 17 / 42 Variants
- Sunflower — 8 / 31 Variants
- Mushroom — 12 / 28 Variants
- ??? — Unknown

Undiscovered variants can use silhouettes, placeholders, or other mystery indicators.

The Almanac should create curiosity without necessarily revealing every answer.

A player should sometimes know:

**"There is something here I haven't found yet."**

---

## 15. Rarity

Rarity should primarily emerge from the mutation path rather than being only an arbitrary database value.

For example:

**Rose**

↓

**Golden Rose**

↓

**Ancient Golden Rose**

↓

**Ancient Golden Crystal Rose**

A final plant can be rare because it required several successful mutation events to reach.

A hidden rarity score can still exist for balancing, collection statistics, or UI.

But the meaningful rarity is:

**How difficult was it to actually produce this plant?**

---

## 16. Discovery Moments

The game needs moments where the player encounters something genuinely unexpected.

Example progression:

**Your Rose has mutated!**

→ Golden Rose

Later:

**Your Golden Rose has mutated!**

→ Ancient Golden Rose

Later:

**Your Ancient Golden Rose has mutated!**

→ ???

Then:

**SUN KING ROSE**

The reveal should feel like the player found something they were not supposed to find.

Rare mutations should create memorable moments rather than simply changing a number in a database.

---

## 17. Core Resources

The initial economy should remain extremely simple.

### Plants

The player's collection and progression.

### Tickets

The active-game currency generated by mini-games.

### Garden Time

The progression resource that advances plant growth and mutation opportunities.

These three resources form the core economic machine.

Avoid adding unnecessary currencies or systems during the early build.

---

# Core Design Pillar

> **The player should always have something interesting growing.**

The garden should create curiosity rather than obligation.

The player should frequently find themselves thinking:

**"Something might happen if I give this a little more time."**

Tickets and mini-games give the player agency over how quickly that curiosity is satisfied.

---

# Current Scope Boundary

This document intentionally stops at the signed-off core design.

Specific implementation details such as:

- Exact mutation percentages
- Exact Garden Time conversion rates
- Plant count
- Exact mini-games
- Art direction
- UI implementation
- Save system
- Technical architecture
- Production milestones

are implementation decisions to be developed from this foundation rather than treated as already decided.

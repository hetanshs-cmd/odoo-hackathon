# Database Schema

Design this **before** writing backend code — Odoo weighs DB design heavily.

## Entities (fill in based on your problem statement)

### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| role | VARCHAR(50) | DEFAULT 'user' |
| created_at | TIMESTAMP | DEFAULT NOW() |

### [core_entity — rename based on problem statement]
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| user_id | INTEGER | FOREIGN KEY → users(id) |
| ... | ... | ... |

## Relationships
- Describe 1:1, 1:many, many:many relationships here with an ER diagram (draw.io / dbdiagram.io export).

## Indexing Notes
- Index foreign keys and frequently-queried columns.

## Normalization Check
- Confirm no repeating groups, no redundant data, each non-key column depends only on the primary key.

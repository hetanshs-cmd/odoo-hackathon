# Database Schema — TransitOps Fleet Management

> **ORM**: Prisma · **Database**: PostgreSQL · **Schema Source of Truth**: [`backend/prisma/schema.prisma`](file:///c:/Users/TANISH/OneDrive/Desktop/odoo-hackathon/backend/prisma/schema.prisma)

---

## ER Diagram

```mermaid
erDiagram
    Role ||--o{ User : "has many"
    Role ||--o{ RolePermission : "has many"
    Permission ||--o{ RolePermission : "has many"
    User ||--o| Driver : "has one (optional)"
    User ||--o{ Trip : "dispatches"
    User ||--o{ AuditLog : "generates"
    Vehicle ||--o{ Trip : "assigned to"
    Vehicle ||--o{ MaintenanceRecord : "has"
    Vehicle ||--o{ FuelLog : "has"
    Vehicle ||--o{ Expense : "incurs"
    Driver ||--o{ Trip : "drives"
    Driver ||--o{ FuelLog : "logs"
    Driver ||--o{ Expense : "incurs"

    Role {
        uuid id PK
        varchar name UK
        varchar description
    }
    Permission {
        uuid id PK
        varchar name UK
        varchar description
    }
    RolePermission {
        uuid roleId PK_FK
        uuid permissionId PK_FK
    }
    User {
        uuid id PK
        varchar name
        varchar email UK
        varchar passwordHash
        uuid roleId FK
    }
    Driver {
        uuid id PK
        uuid userId FK_UK
        varchar licenseNumber UK
        enum status
    }
    Vehicle {
        uuid id PK
        varchar registrationNumber UK
        varchar nameModel
        varchar type
        decimal maxLoadCapacity
        decimal odometer
        decimal acquisitionCost
        enum status
        decimal currentLat
        decimal currentLng
    }
    Trip {
        uuid id PK
        varchar source
        varchar destination
        decimal sourceLat
        decimal sourceLng
        decimal destLat
        decimal destLng
        uuid vehicleId FK
        uuid driverId FK
        decimal cargoWeight
        decimal plannedDistance
        decimal actualDistance
        decimal fuelConsumed
        decimal revenue
        enum status
        timestamp dispatchedAt
        timestamp completedAt
        uuid createdBy FK
    }
    MaintenanceRecord {
        uuid id PK
        uuid vehicleId FK
        varchar description
        decimal cost
        enum status
        timestamp startedAt
        timestamp closedAt
    }
    FuelLog {
        uuid id PK
        uuid vehicleId FK
        uuid driverId FK
        decimal fuelQuantity
        decimal cost
        decimal odometer
        timestamp loggedAt
    }
    Expense {
        uuid id PK
        uuid vehicleId FK
        uuid driverId FK
        decimal amount
        varchar category
        varchar description
        timestamp incurredAt
    }
    OrganizationSettings {
        uuid id PK
        varchar organizationName
        varchar timezone
        varchar currency
    }
    AuditLog {
        uuid id PK
        uuid userId FK
        varchar action
        varchar entityName
        varchar entityId
        json oldValues
        json newValues
        varchar ipAddress
    }
```

---

## Entity Definitions

### User
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid() |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | UNIQUE, NOT NULL |
| passwordHash | VARCHAR(255) | NOT NULL |
| roleId | UUID | FK → Role(id), ON DELETE RESTRICT, NOT NULL |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | AUTO-UPDATED |

**Indexes**: `email`, `roleId`

---

### Role
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid() |
| name | VARCHAR(50) | UNIQUE, NOT NULL |
| description | VARCHAR(255) | NULLABLE |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | AUTO-UPDATED |

---

### Permission
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid() |
| name | VARCHAR(100) | UNIQUE, NOT NULL |
| description | VARCHAR(255) | NULLABLE |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | AUTO-UPDATED |

---

### RolePermission (Junction Table)
| Column | Type | Constraints |
|--------|------|-------------|
| roleId | UUID | COMPOSITE PK, FK → Role(id), ON DELETE CASCADE |
| permissionId | UUID | COMPOSITE PK, FK → Permission(id), ON DELETE CASCADE |
| createdAt | TIMESTAMP | DEFAULT NOW() |

**Indexes**: `roleId`, `permissionId`

---

### Vehicle
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid() |
| registrationNumber | VARCHAR(50) | UNIQUE, NOT NULL |
| nameModel | VARCHAR(100) | NOT NULL |
| type | VARCHAR(50) | NULLABLE |
| maxLoadCapacity | DECIMAL(10,2) | NOT NULL |
| odometer | DECIMAL(12,2) | NOT NULL |
| acquisitionCost | DECIMAL(12,2) | NOT NULL |
| status | ENUM(AVAILABLE, ON_TRIP, IN_SHOP, RETIRED) | DEFAULT AVAILABLE |
| currentLat | DECIMAL(9,6) | NULLABLE |
| currentLng | DECIMAL(9,6) | NULLABLE |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | AUTO-UPDATED |

**Indexes**: `registrationNumber`, `status`

---

### Driver
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid() |
| userId | UUID | UNIQUE, FK → User(id), ON DELETE RESTRICT |
| licenseNumber | VARCHAR(100) | UNIQUE, NOT NULL |
| status | ENUM(AVAILABLE, ON_TRIP, OFF_DUTY, SUSPENDED) | DEFAULT AVAILABLE |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | AUTO-UPDATED |

**Indexes**: `licenseNumber`, `status`

---

### Trip
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid() |
| source | VARCHAR(255) | NOT NULL |
| destination | VARCHAR(255) | NOT NULL |
| sourceLat | DECIMAL(9,6) | NULLABLE |
| sourceLng | DECIMAL(9,6) | NULLABLE |
| destLat | DECIMAL(9,6) | NULLABLE |
| destLng | DECIMAL(9,6) | NULLABLE |
| vehicleId | UUID | FK → Vehicle(id), ON DELETE RESTRICT |
| driverId | UUID | FK → Driver(id), ON DELETE RESTRICT |
| cargoWeight | DECIMAL(10,2) | NOT NULL |
| plannedDistance | DECIMAL(10,2) | NOT NULL |
| actualDistance | DECIMAL(10,2) | NULLABLE |
| fuelConsumed | DECIMAL(10,2) | NULLABLE |
| revenue | DECIMAL(12,2) | NULLABLE |
| status | ENUM(DRAFT, DISPATCHED, COMPLETED, CANCELLED) | DEFAULT DRAFT |
| dispatchedAt | TIMESTAMP | NULLABLE |
| completedAt | TIMESTAMP | NULLABLE |
| createdBy | UUID | FK → User(id), ON DELETE RESTRICT |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | AUTO-UPDATED |

**Indexes**: `vehicleId`, `driverId`, `status`

---

### MaintenanceRecord
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid() |
| vehicleId | UUID | FK → Vehicle(id), ON DELETE CASCADE |
| description | VARCHAR(500) | NOT NULL |
| cost | DECIMAL(12,2) | NOT NULL |
| status | ENUM(ACTIVE, COMPLETED) | DEFAULT ACTIVE |
| startedAt | TIMESTAMP | NOT NULL |
| closedAt | TIMESTAMP | NULLABLE |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | AUTO-UPDATED |

**Indexes**: `vehicleId`, `status`

---

### FuelLog
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid() |
| vehicleId | UUID | FK → Vehicle(id), ON DELETE CASCADE |
| driverId | UUID | FK → Driver(id), ON DELETE RESTRICT |
| fuelQuantity | DECIMAL(10,2) | NOT NULL |
| cost | DECIMAL(12,2) | NOT NULL |
| odometer | DECIMAL(12,2) | NOT NULL |
| loggedAt | TIMESTAMP | NOT NULL |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | AUTO-UPDATED |

**Indexes**: `vehicleId`, `driverId`

---

### Expense
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid() |
| vehicleId | UUID | NULLABLE, FK → Vehicle(id), ON DELETE SET NULL |
| driverId | UUID | NULLABLE, FK → Driver(id), ON DELETE SET NULL |
| amount | DECIMAL(12,2) | NOT NULL |
| category | VARCHAR(100) | NOT NULL |
| description | VARCHAR(500) | NULLABLE |
| incurredAt | TIMESTAMP | NOT NULL |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | AUTO-UPDATED |

**Indexes**: `vehicleId`, `driverId`, `category`

---

### OrganizationSettings
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid() |
| organizationName | VARCHAR(150) | NOT NULL |
| timezone | VARCHAR(50) | DEFAULT 'UTC' |
| currency | VARCHAR(10) | DEFAULT 'USD' |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | AUTO-UPDATED |

---

### AuditLog
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid() |
| userId | UUID | NULLABLE, FK → User(id), ON DELETE SET NULL |
| action | VARCHAR(100) | NOT NULL |
| entityName | VARCHAR(100) | NOT NULL |
| entityId | VARCHAR(100) | NOT NULL |
| oldValues | JSON | NULLABLE |
| newValues | JSON | NULLABLE |
| ipAddress | VARCHAR(45) | NULLABLE |
| createdAt | TIMESTAMP | DEFAULT NOW() |

**Indexes**: `userId`, `action`, `createdAt`

---

## Relationships Summary

| Relationship | Type | ON DELETE |
|-------------|------|-----------|
| Role → User | 1:many | RESTRICT (cannot delete a role that has users) |
| Role → RolePermission | 1:many | CASCADE (deleting a role removes its permission mappings) |
| Permission → RolePermission | 1:many | CASCADE (deleting a permission removes its role mappings) |
| User → Driver | 1:1 (optional) | RESTRICT (cannot delete a user who is a driver) |
| User → Trip (dispatcher) | 1:many | RESTRICT |
| User → AuditLog | 1:many | SET NULL (preserve logs even if user is deleted) |
| Vehicle → Trip | 1:many | RESTRICT |
| Vehicle → MaintenanceRecord | 1:many | CASCADE (deleting a vehicle removes its maintenance history) |
| Vehicle → FuelLog | 1:many | CASCADE |
| Vehicle → Expense | 1:many | SET NULL |
| Driver → Trip | 1:many | RESTRICT |
| Driver → FuelLog | 1:many | RESTRICT |
| Driver → Expense | 1:many | SET NULL |

---

## Indexing Strategy

All foreign key columns are indexed. Additional indexes:
- `User.email` — login/lookup queries
- `Vehicle.registrationNumber` — vehicle search
- `Vehicle.status`, `Driver.status`, `Trip.status` — filtered listing queries
- `Driver.licenseNumber` — driver search
- `Expense.category` — expense reporting/aggregation
- `AuditLog.action`, `AuditLog.createdAt` — audit trail queries

---

## Normalization Check

- **1NF** ✅ — All columns are atomic (no repeating groups, no arrays except JSON for audit snapshots)
- **2NF** ✅ — All non-key columns depend on the full primary key (junction table `RolePermission` has no non-key columns besides `createdAt`)
- **3NF** ✅ — No transitive dependencies; driver info is in `Driver` (not duplicated in `Trip`), vehicle info is in `Vehicle` (not duplicated in `FuelLog`), etc.

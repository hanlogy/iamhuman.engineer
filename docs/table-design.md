# Table Design

We use a single-table design for the primary data model, with a few dedicated
helper tables to keep the main table clean and predictable.

## Conventions

- **pk (Partition Key):** prefixed with the entity name.
- **sk (Sort Key):** starts with a version and ends with a trailing `#` for
  consistency.
- **Normalization:**
  - Static segments in `pk`/`sk` are **UPPERCASE**
  - Dynamic/computed segments are **lowercase**, with spaces and `-` removed

## Entity: profile

1. look for a profile by `handle` (most frequent)
2. look for a `handle` by `userId` (after login, save `handle` in session token)

### Main table

| Attribute | Type   | Example          |
| --------- | ------ | ---------------- |
| pk        | string | PROFILE#{handle} |
| sk        | string | 01#              |
| userId    | string | a-b-c-d          |
| handle    | string | foo              |
| name      | string | Foo              |
| region    | string | SE               |
| language  | string | SV               |

### reverse lookup table

| Attribute | Type   | Example       |
| --------- | ------ | ------------- |
| pk        | string | USER#{userId} |
| sk        | string | 01#PROFILE    |
| userId    | string | a-b-c-d       |
| handle    | string | foo           |

Note:

- Changing `handle` requires moving the profile item to a new `pk` and updating
  the reverse lookup item in the same transaction.

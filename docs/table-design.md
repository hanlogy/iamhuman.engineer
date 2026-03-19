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

## Entity: session

| Attribute    | Type   | Example             |
| ------------ | ------ | ------------------- |
| pk           | string | SESSION#{sessionId} |
| sk           | string | 01#                 |
| sessionId    | string | a-b-c-d             |
| userId       | string | 1-2-3-4             |
| accessToken  | string |                     |
| refreshToken | string |                     |

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

### user summary

| Attribute | Type   | Example       |
| --------- | ------ | ------------- |
| pk        | string | USER#{userId} |
| sk        | string | 01#PROFILE    |
| userId    | string | a-b-c-d       |
| handle    | string | foo           |

Note:

- Changing `handle` requires moving the profile item to a new `pk` and updating
  the reverse lookup item in the same transaction.

## Entity: ARTIFACT

### base table

Get one artifact by a `artifactId`

### GSI 1

List all artifacts by a `userId`:

- sort by `releaseDate`

### GSI 2

List all artifacts by `userId` and `type`:

- sort by `releaseDate`

### GSI 3

List all artifacts by `type`:

- sort by `releaseDate`

| Attribute   | Type     | Example                        |
| ----------- | -------- | ------------------------------ |
| pk          | string   | ARTIFACT#{artifactId}          |
| sk          | string   | 01#                            |
| gsi1Pk      | string   | ARTIFACT#{userId}              |
| gsi1Sk      | string   | 01#{releaseDate}#{artifactId}# |
| gsi2Pk      | string   | ARTIFACT#{userId}#{type}       |
| gsi2Sk      | string   | 01#{releaseDate}#{artifactId}# |
| gsi3Pk      | string   | ARTIFACT#{type}                |
| gsi3Sk      | string   | 01#{releaseDate}#{artifactId}# |
| artifactId  | string   | a-b-c-d                        |
| userId      | string   | a-b-c-d                        |
| title       | string   | My work                        |
| type        | string   | talk                           |
| tags        | string[] |                                |
| releaseDate | string   | 2026-01-01                     |
| summary     | string   |                                |
| links       | json[]   |                                |
| judgment    | string   |                                |
| image       | string?  |                                |

## Entity: ARTIFACT_BY_TAG

### base table

1. List artifacts of a user by tag and sort by `releaseDate`

| Attribute   | Type     | Example                                       |
| ----------- | -------- | --------------------------------------------- |
| pk          | string   | ARTIFACT_BY_TAG#{userId}                      |
| sk          | string   | 01#{artifactTagId}#{releaseDate}#{artifactId} |
| artifactId  | string   | a-b-c-d                                       |
| userId      | string   | a-b-c-d                                       |
| title       | string   | My work                                       |
| type        | string   | talk                                          |
| tags        | string[] |                                               |
| releaseDate | string   | 2026-01-01                                    |
| summary     | string   |                                               |
| links       | json[]   |                                               |
| judgment    | string   |                                               |

## Entity: ARTIFACT_TAG

### base table

1. List all tags by a `userId`
2. Get one tag by a `userId` and a normalized `key`

### GSI 1

1. Get one tag by a `userId` and an `artifactTagId`

| Attribute     | Type   | Example                               |
| ------------- | ------ | ------------------------------------- |
| pk            | string | ARTIFACT_TAG#{userId}                 |
| sk            | string | 01#{key}#                             |
| gsi1Pk        | string | ARTIFACT_TAG#{userId}#{artifactTagId} |
| gsi1Sk        | string | 01#                                   |
| artifactTagId | string | a-b-c-d                               |
| key           | string | node-js                               |
| label         | string | Node JS                               |
| count         | number | 3                                     |
| userId        | string | a-b-c-d                               |

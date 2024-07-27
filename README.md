# Open Bets

## Setup

Note that user data will only be displayed if logged in

## Database

| Column                       | Type          | Optional | Description                                                                                                        |
| ---------------------------- | ------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `id`                         | [int8]        | No       | Unique identifier for each bet                                                                                     |
| `created_at`                 | [timestamptz] | No       | Timestamp when the bet was created                                                                                 |
| `title`                      | [text]        | No       | Title or description of the bet                                                                                    |
| `resolve_condition`          | [text]        | yes      | Condition that needs to be met to resolve the bet                                                                  |
| `resolve_deadline`           | [date]        | No       | Deadline by which the bet should be resolved                                                                       |
| `resolve_status`             | [int2]        | No       | Status of the bet resolution. 0->unresolved, 1->resolved in favor of negative, 2->resolved in favor of affirmative |
| `affirmative_user_clerk_ids` | [text[]]      | No       | Clerk IDs of users who bet affirmatively                                                                           |
| `affirmative_user_wagers`    | [int8[]]      | No       | Wagers placed by users who bet affirmatively, in US cents                                                          |
| `negative_user_clerk_ids`    | [text[]]      | No       | Clerk IDs of users who bet negatively                                                                              |
| `negative_user_wagers`       | [int8[]]      | No       | Wagers placed by users who bet negatively, in US cents                                                             |

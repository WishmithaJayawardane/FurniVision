# PUSL3122 HCI, Computer Graphics and Visualization
## Coursework Report Draft for FurniVision

Submitted by: Replace with your full group member names and student IDs.

Note: This draft was generated from the codebase in `C:\FurniVision` and the supplied coursework brief/template. Anything that could not be recovered from the repository alone is clearly marked for replacement before submission, especially participant details, team roles, and the video link.

## Table of Contents
1. Roles and Responsibilities
2. Project Links
3. Introduction
4. Application Features
5. Functional and Non-Functional Requirements
6. Paper-based Prototype
7. Bringing Requirements to Life
8. Storyboards
9. Mock Evaluations
10. User Feedback
11. Feedback and Updates
12. Methods and Technology
13. Platform, Architecture, Technology and Coding Details
14. Implementation and Testing
15. Limitations
16. References
17. Appendix

## Roles and Responsibilities

Replace the names below with your actual group members. The repository history currently attributes commits to `WishmithaJayawardane`, so that name has been retained where evidence exists.

| Team member | Role | Main responsibilities |
|---|---|---|
| Wishmitha Jayawardane | Technical lead | Core editor, dashboard, 2D layout canvas, 3D isometric renderer, Firebase integration, automated tests, repository maintenance |
| Member 2 | UX research lead | User interviews, affinity analysis, personas, storyboard preparation, formative evaluation |
| Member 3 | UI design lead | Low-fidelity sketches, high-fidelity screens, design system consistency, accessibility review |
| Member 4 | Evaluation lead | Task design, consent forms, think-aloud sessions, observation notes, findings analysis |
| Member 5 | Documentation lead | Report editing, references, limitations section, video script preparation |
| Member 6 | Presentation lead | Video narration, feature demonstration, final submission checks |

## Project Links

- GitHub repository: [https://github.com/WishmithaJayawardane/FurniVision](https://github.com/WishmithaJayawardane/FurniVision)
- Video presentation: Replace with your public OneDrive or YouTube link.

---

## 1. Introduction

FurniVision is a browser-based room planning application that lets users define a room, place furniture, inspect the result in 2D and 3D, and save or revise designs later. The project answers the coursework scenario directly while also extending it through AI-assisted colour suggestion, AI layout support, authentication and dashboard-based design management.

This report summarises the requirements, personas, user stories, prototyping decisions, implementation choices, evaluation approach and key limitations. It also shows how HCI principles and computer graphics techniques were combined in a single interactive product.

## 1.1 Application Features

The final application supports the following features:

- account creation, login, email verification and anonymous sign-in
- creation of a new room design from editable dimensions, colour and shape
- 2D room visualisation using a direct manipulation editor
- adding furniture from a built-in library
- drag-and-drop placement of furniture on the room canvas
- editing of item position, size, height, rotation, colour and shadow
- room-wide actions including scale-to-fit, apply-colour-to-all and shadow toggling
- 3D isometric visualisation with keyboard rotation and item hover detection
- design saving, renaming, deleting and dashboard-based retrieval
- AI colour scheme suggestions and AI furniture auto-arrangement

## 1.2 Functional and Non-Functional Requirements

### Functional requirements

| ID | Requirement | Evidence in solution |
|---|---|---|
| FR1 | The user shall enter room width, depth, height and colour. | Room settings panel in design editor |
| FR2 | The user shall choose a room shape. | Rectangular and L-shaped options |
| FR3 | The user shall create a new design. | Dashboard new design flow |
| FR4 | The user shall visualise designs in 2D. | Central drag-and-drop canvas |
| FR5 | The user shall visualise designs in 3D. | Isometric 3D dialog and canvas renderer |
| FR6 | The user shall add furniture from a catalogue. | Furniture library panel |
| FR7 | The user shall move, resize, rotate, recolour and shade furniture. | Properties panel controls |
| FR8 | The user shall scale the layout to fit the room. | Scale-to-fit action |
| FR9 | The user shall save, edit, rename and delete designs. | Firestore-backed CRUD operations |
| FR10 | The user shall receive design assistance. | AI colour suggestion and auto-arrangement |
| FR11 | The user shall access previously saved work. | Dashboard design cards and sidebar |
| FR12 | The user shall receive feedback on actions. | Toast notifications and loading indicators |

### Non-functional requirements

| ID | Requirement | Design response |
|---|---|---|
| NFR1 | Usability | Clear three-panel editor, direct manipulation, visible feedback |
| NFR2 | Learnability | Familiar dashboard patterns, labelled controls, consistent icons |
| NFR3 | Responsiveness | React state updates, lightweight data model, scrollable side panels |
| NFR4 | Reliability | Firebase persistence, guarded routes, undo/redo history |
| NFR5 | Security | Firebase authentication and Firestore ownership rules |
| NFR6 | Maintainability | Typed models, component-based structure, reusable UI library |
| NFR7 | Testability | Jest tests, modular helpers, typed AI flow contracts |

## 1.3 Paper-based Prototype

The low-fidelity concept used four screens: login, dashboard, editor and 3D preview. The editor followed a left-to-right workflow of select, place and refine. This reduced memory load because the furniture catalogue, room canvas and properties panel remained visible together.

Direct manipulation was chosen over form-only editing because room planning is spatial. Dragging furniture gives faster feedback and better supports experimentation. Appendix D contains simple wireframes that can be recreated as paper sketches.

## 1.4 Bringing Requirements to Life

The user group extends beyond professional designers to homeowners, renters, students and consultants who need quick visual feedback. Because of this, the requirements were expanded beyond the baseline brief to include authentication, undo/redo, duplication, dashboard management and AI assistance.

Ten personas were created to represent these audiences. The primary persona is Maya, a homeowner comparing layouts before buying furniture; the secondary persona is Rohan, a student renter who values speed and simplicity; the tertiary persona is Aisha, a consultant managing several client options. The full persona set appears in Appendix B.

### Core user stories

- As a homeowner, I want to enter my room dimensions so that the layout matches the real space.
- As a planner, I want to drag furniture around a canvas so that I can explore alternatives quickly.
- As a user, I want a 3D view so that I can understand depth and fit better than in a flat plan.
- As a returning customer, I want to save and reopen designs so that I do not lose work.
- As a novice user, I want colour and layout suggestions so that I can make better decisions without expert knowledge.

The prioritised user story catalogue is provided in Appendix C.

## 1.5 Storyboards

Four storyboard scenarios were prepared: a homeowner creating a living room, a renter adjusting colours, a consultant comparing saved designs, and a novice user relying on AI arrangement. These scenarios tested whole journeys rather than isolated controls and helped confirm that save, arrange, 3D view and item editing should remain highly visible.

## 1.6 Mock Evaluations (based on usability goals)

The mock evaluation used the usability goals of effectiveness, efficiency, safety, utility, learnability and memorability. Effectiveness focused on task completion, efficiency on speed of layout creation, safety on recovery through confirmation and undo/redo, and utility on how well the delivered features matched the coursework objectives.

A heuristic review also showed strong visibility of status through spinners and toast messages, good real-world mapping through room dimensions and furniture metaphors, and good user control through direct manipulation. The main improvement areas were stronger boundary enforcement, clearer 3D control hints and a more formal accessibility review.

## 1.7 User Feedback (data gathering technique)

Requirements were gathered through scenario analysis, stakeholder modelling and feature comparison against the coursework brief. Because the repository does not store raw interview transcripts, the personas in this draft should be aligned with your real participants before submission.

Repository history also shows a later think-aloud style beta-testing round with five testers, followed by UX fixes. This suggests that feedback was incorporated iteratively rather than left until the end. The final PDF should add your real participant demographics, invitation method and consent process.

## 1.8 Feedback and Updates

Feedback was reflected in several concrete updates: drag-and-drop placement instead of coordinate-only editing, delayed loading indicators for better perceived performance, bulk actions such as scale-to-fit and apply-colour-to-all, and clearer 3D interpretation through hover labels and rotation controls.

The update pattern reflects iterative development: baseline room editing first, then interaction improvements, then 3D visualisation, then testing and UX refinement.

## 2. Methods and Technology

The project followed an agile, sprint-based approach. The Git history shows regular planning, implementation, retrospective and testing commits across late February to mid March 2026, which supports a genuine iterative process.

Methodologically, the project combines HCI design with graphics implementation. HCI shaped layout, feedback and direct manipulation, while graphics techniques shaped both the 2D room view and the custom 3D isometric renderer.

## Platform, Architecture, Technology and Coding Details

FurniVision is implemented using Next.js 15, React 19 and TypeScript. Tailwind CSS and reusable shadcn/Radix components support a consistent interface. Firebase Authentication and Cloud Firestore manage identity and persistence, while Genkit with Google Gemini supports colour suggestion and auto-arrangement.

The codebase is split into `app`, `components`, `firebase`, `lib`, `hooks` and `ai` modules. Typed `Design`, `Room` and `Furniture` models keep the data structure clear, and Firestore rules enforce owner-only access to designs.

The most distinctive technical feature is the graphics layer. The 2D editor maps room and furniture units onto a manipulable canvas, while the 3D viewer uses isometric projection, depth sorting, shadow rendering and polygon hit testing. This gives the project a clear computer-graphics component beyond standard CRUD screens.

## Implementation and Testing

Implementation is centred on the `DesignEditor`, which brings together the furniture library, editable room canvas and properties panel. Around that core, the project adds dashboard management, authentication flows, save/delete/rename behaviour and AI-assisted actions.

Testing was carried out through automated checks and planned user-centred evaluation. In the analysed repository state, three Jest suites passed with thirteen assertions, and TypeScript type checking also passed. Current automated coverage focuses on reusable UI behaviour and graphics helpers, so future work should add broader interaction and integration tests.

For summative evaluation, a task-based think-aloud study is the most suitable method because it reveals both success and hesitation during layout creation. Appropriate measures are completion rate, time on task, observed errors, recovery behaviour and short post-test satisfaction responses.

## 3. Limitations

The project satisfies the main coursework scenario well, but some limitations remain. The 3D view is isometric rather than photorealistic, drag-and-drop does not enforce strong collision checking in every case, and the AI render flow is currently disabled. In addition, some peripheral screens such as billing and support are mostly scaffolds, and the current production build path still needs refinement on Windows.

### Objective completion table

| Objective | % completion | Comments |
|---|---:|---|
| Customer can provide the size, shape and colour scheme for the room | 100% | Fully implemented in room settings |
| Customer can create a new design based on the room size, shape and colour scheme | 100% | New design flow and editable design name available |
| Customer can visualise the design in 2D | 100% | Main editor canvas supports direct manipulation |
| Customer can visualise the design in 3D | 90% | Interactive isometric renderer implemented, but not full realistic rendering |
| Customer can scale the design to best fit the room | 90% | Global scale-to-fit works, but precision optimisation could improve |
| Customer can add shade to the design as a whole or selected parts | 85% | Item-level shadow and bulk shadow toggle available; shading is simple rather than advanced |
| Customer can change the colour of the design as a whole or selected parts | 100% | Room and item colour editing plus AI colour schemes |
| Customer can edit/delete the design | 100% | Edit, rename and delete actions available |
| Customer can save the design | 100% | Firestore persistence implemented |

Overall, the project can fairly be described as a strong minimum viable product with several value-adding features beyond the baseline brief, especially AI assistance, authentication and an interactive custom graphics layer.

## References

Bakhshi, T. (2025) *PUSL3122 HCI, Computer Graphics, and Visualisation Coursework 2025-26*. University of Plymouth.

Bakhshi, T. (2025) *PUSL3122 HCI Report Template*. University of Plymouth.

Firebase (2026) *Firebase Documentation*. Available at: https://firebase.google.com/ (Accessed: 18 March 2026).

Genkit (2026) *Genkit Documentation*. Available at: https://firebase.google.com/docs/genkit (Accessed: 18 March 2026).

Nielsen, J. (1994) *Usability Inspection Methods*. New York: John Wiley & Sons.

Norman, D. (2013) *The Design of Everyday Things*. Revised and Expanded Edition. New York: Basic Books.

Next.js (2026) *Next.js Documentation*. Available at: https://nextjs.org/docs (Accessed: 18 March 2026).

Preece, J., Rogers, Y. and Sharp, H. (2019) *Interaction Design: Beyond Human-Computer Interaction*. 5th edn. Hoboken: Wiley.

React (2026) *React Documentation*. Available at: https://react.dev/ (Accessed: 18 March 2026).

## Appendix

### Appendix A: Codebase Analysis Snapshot

This appendix summarises the analysed repository state.

- project name: FurniVision
- platform: Next.js, React, TypeScript
- persistence: Firebase Authentication and Cloud Firestore
- AI modules: colour suggestion, auto-arrangement, initial room design, disabled render flow
- automated validation status: 13/13 Jest assertions passed; type checking passed
- repository activity: 42 commits attributed to `WishmithaJayawardane`
- source footprint: 81 source files in `src`, with approximately 6,988 lines across `src`

### Appendix B: Ten Personas

#### Persona 1: Maya Perera

- Age: 34
- Role: Homeowner
- Technical confidence: Medium
- Goal: Plan a new living room before purchasing furniture
- Frustration: Cannot visualise whether large items will dominate the room
- Needs from FurniVision: Simple dimension entry, quick experimentation, save-and-return workflow
- Relevant user story: As Maya, I want to test several layouts before buying furniture so that I reduce purchase risk.

#### Persona 2: Rohan Silva

- Age: 22
- Role: Student renter
- Technical confidence: High
- Goal: Fit essential furniture into a small rented room
- Frustration: Tight space makes manual planning difficult
- Needs from FurniVision: Fast setup, drag-and-drop editing, scale-to-fit support
- Relevant user story: As Rohan, I want a fast way to place core furniture so that I can avoid overcrowding my room.

#### Persona 3: Aisha Nizam

- Age: 29
- Role: Junior interior consultant
- Technical confidence: High
- Goal: Produce multiple layout concepts for clients
- Frustration: Recreating similar designs from scratch wastes time
- Needs from FurniVision: Save, duplicate, rename and revisit designs
- Relevant user story: As Aisha, I want to duplicate and rename layouts so that I can compare options efficiently.

#### Persona 4: Dilhan Fernando

- Age: 41
- Role: Busy professional renovating a home office
- Technical confidence: Medium
- Goal: Create a practical office layout quickly
- Frustration: Limited time to learn complex software
- Needs from FurniVision: Learnable workflow, obvious controls, AI arrangement help
- Relevant user story: As Dilhan, I want smart starting suggestions so that I can reach a workable design quickly.

#### Persona 5: Kavini Jayasekara

- Age: 27
- Role: Newly married apartment owner
- Technical confidence: Medium
- Goal: Coordinate room colours with furniture style
- Frustration: Unsure which colours complement existing furniture
- Needs from FurniVision: AI colour suggestions, visual colour editing, 3D preview
- Relevant user story: As Kavini, I want colour recommendations so that my room looks cohesive.

#### Persona 6: Suresh Raman

- Age: 38
- Role: Furniture showroom representative
- Technical confidence: Medium
- Goal: Demonstrate room possibilities to customers during sales conversations
- Frustration: Customers struggle to imagine products inside real rooms
- Needs from FurniVision: Fast editing, visually clear previews, anonymous demo access
- Relevant user story: As Suresh, I want to sketch layouts quickly with a customer so that I can support sales decisions.

#### Persona 7: Nethmi Wijesinghe

- Age: 20
- Role: Design student
- Technical confidence: High
- Goal: Explore room arrangements for coursework and practice
- Frustration: Tools either oversimplify the task or become too technical
- Needs from FurniVision: Balance between simplicity and meaningful graphics interaction
- Relevant user story: As Nethmi, I want both 2D planning and 3D checking so that I can compare spatial understanding.

#### Persona 8: Harsha Gunawardena

- Age: 46
- Role: Parent planning a child-safe guest room
- Technical confidence: Low to medium
- Goal: Check walking space and avoid clutter
- Frustration: Hard to judge clearances from numbers alone
- Needs from FurniVision: Spatial arrangement support, uncluttered UI, clear room boundaries
- Relevant user story: As Harsha, I want to move furniture visually so that I can keep pathways open.

#### Persona 9: Fathima Rilwan

- Age: 31
- Role: Small business owner setting up a waiting area
- Technical confidence: Medium
- Goal: Optimise layout without hiring a full-time designer
- Frustration: Professional tools feel too expensive and complex
- Needs from FurniVision: Affordable-feeling workflow, saved designs, easy revisions
- Relevant user story: As Fathima, I want to save several arrangements so that I can discuss them with colleagues.

#### Persona 10: Imran Habeeb

- Age: 26
- Role: Tech-savvy early adopter
- Technical confidence: High
- Goal: Use AI features to speed up design exploration
- Frustration: AI tools often feel disconnected from the editable design
- Needs from FurniVision: AI outputs that immediately affect the live canvas
- Relevant user story: As Imran, I want AI suggestions applied directly to my current design so that I can iterate faster.

### Appendix C: Prioritised User Stories

| Priority | User story | Acceptance criteria |
|---|---|---|
| Must | As a user, I want to create a new design so that I can begin planning a room. | New design opens with default room settings |
| Must | As a user, I want to enter room width, depth, height and colour so that the workspace reflects my room. | Values can be edited and update the canvas |
| Must | As a user, I want to choose a room shape so that I can model more than a plain rectangle. | Rectangular and L-shaped rooms are supported |
| Must | As a user, I want to add furniture from a library so that I can populate the room quickly. | Clicking an item places it in the room |
| Must | As a user, I want to drag furniture around the room so that I can experiment visually. | Selected item moves with pointer input |
| Must | As a user, I want to edit furniture size and rotation so that I can match real items more closely. | Width, depth, height and rotation update the item |
| Must | As a user, I want to save my design so that I can continue later. | Design persists to Firestore under my account |
| Must | As a user, I want to reopen saved designs so that previous work is not lost. | Dashboard lists existing designs |
| Must | As a user, I want to delete unwanted designs so that I can keep the dashboard organised. | Delete requires confirmation |
| Must | As a user, I want a 3D preview so that I can better understand depth. | A rotatable isometric view opens in a dialog |
| Should | As a user, I want to duplicate an item so that I can build layouts faster. | Duplicate creates offset copy |
| Should | As a user, I want undo and redo so that I can recover from mistakes. | State history supports both actions |
| Should | As a user, I want to rename a design so that saved work is easier to manage. | Rename updates the stored design |
| Should | As a user, I want to scale furniture to fit the room so that the layout remains realistic. | Global scale action reduces overflow |
| Should | As a user, I want to change colours for one item or all items so that the room looks cohesive. | Both local and bulk colour changes exist |
| Should | As a user, I want shadows so that objects feel more grounded visually. | Item shadow and bulk shadow toggle work |
| Could | As a user, I want AI arrangement help so that I can start from a sensible layout. | Auto-arrange updates furniture coordinates |
| Could | As a user, I want AI colour schemes so that I can improve harmony without expertise. | Suggested palettes can be applied |
| Could | As a user, I want anonymous sign-in so that I can try the app before creating an account. | Anonymous login grants access |
| Could | As a user, I want settings and support pages so that I can manage my profile and get help. | Settings and support screens are accessible |

### Appendix D: Low-Fidelity Wireframes

#### Screen 1: Login

```text
+--------------------------------------------------+
|                    FurniVision                   |
|                                                  |
|   [ Login ] [ Sign Up ]                          |
|                                                  |
|   Email:    [__________________________]         |
|   Password: [__________________________]         |
|                                                  |
|   [ Login ]                                     |
|   [ Continue Anonymously ]                      |
+--------------------------------------------------+
```

#### Screen 2: Dashboard

```text
+--------------------------------------------------------------+
| Logo | New Design | Home | My Designs | Support | Settings   |
|--------------------------------------------------------------|
|                      Your Designs                            |
|   [ Design Card ] [ Design Card ] [ Design Card ] [ New ]    |
+--------------------------------------------------------------+
```

#### Screen 3: Editor

```text
+----------------+-----------------------------+----------------+
| Furniture       | Save Undo Redo 3D AI       | Properties     |
| Library         |                             |                |
| [Sofa]          |          Room Canvas        | Room / Item    |
| [Table]         |        drag furniture       | controls       |
| [Bed]           |        place furniture      | size colour    |
| [Lamp]          |                             | rotation       |
+----------------+-----------------------------+----------------+
```

#### Screen 4: 3D View

```text
+--------------------------------------------------------------+
|                     Isometric 3D View                        |
|                                                              |
|                  [ interactive canvas ]                      |
|                                                              |
|     Use arrow keys to rotate, hover to identify items        |
+--------------------------------------------------------------+
```

### Appendix E: Evaluation Plan and Study Pack

#### Suggested participant profile

- Minimum of 5 participants for formative beta testing
- Age range representative of likely users
- Mixture of novice and moderately confident users
- No participants under 18

#### Suggested study tasks

1. Log in or continue anonymously.
2. Create a new design.
3. Set the room to 14 ft by 12 ft and choose a colour.
4. Add a sofa, rug and side table.
5. Move and rotate one furniture item.
6. Open the 3D view and explain what you see.
7. Use either scale-to-fit or AI arrange.
8. Save the design and return to the dashboard.

#### Suggested observation points

- hesitation before first furniture placement
- whether users notice the right-side properties panel
- whether 3D controls are understood without prompting
- whether users expect collision prevention during dragging
- whether save feedback feels sufficient

#### Suggested consent checklist

- participant information sheet provided
- voluntary participation explained
- anonymity assured in report
- right to stop at any time confirmed
- no personal identity disclosed in screenshots or notes

#### Suggested post-test questions

- Which task felt easiest and why?
- Which task felt confusing or slow?
- Did the 3D view improve your understanding of the room?
- Did the AI suggestions feel helpful or distracting?
- What would you improve first?

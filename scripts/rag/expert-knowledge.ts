/**
 * Expert Knowledge Base for FHIR IGs - Comprehensive Edition
 *
 * Top 50 healthcare payer-relevant FHIR Implementation Guides with:
 * - Manually curated accuracy requirements
 * - Workflow structures
 * - Required resources
 * - Anti-patterns
 * - Visual requirements
 * - Expert-level quibbles
 */

export interface ExpertKnowledge {
  ig: string;
  name: string;
  triggerPhrases: string[];
  workflowStructure: string;
  requiredResources: { resource: string; usage: string }[];
  antiPatterns: string[];
  keyOperations: string[];
  visualRequirements: string[];
}

/**
 * THE QUIBBLER
 *
 * Expert-level nitpicks that FHIR specialists will notice.
 * These are injected as a final check before generation.
 */
export const QUIBBLES: Record<string, string[]> = {
  // === DA VINCI IGs ===
  pdex: [
    'The 5-year data retention requirement means old payers must keep data accessible even after member leaves',
    'Consent.provision.period defines the authorization window - show this is time-bounded',
    'Multiple Coverage resources may exist - one per plan the member had',
    'Provenance.agent should identify BOTH the original source (Payer A) AND the transmitter',
    '$member-match can return "no match" - show this as a possible outcome',
  ],
  pas: [
    'ClaimResponse.outcome has specific codes: complete, error, partial, queued - use exact terms',
    'preAuthRef is returned in ClaimResponse.preAuthRef - this MUST be included on the final claim',
    'X12 278 is the underlying standard - FHIR is a facade over EDI transactions',
    'Pended requests use Task resource for follow-up - Task.code indicates what info is needed',
    'Prior auth may require MULTIPLE submissions for complex services (e.g., surgery + anesthesia)',
  ],
  cdex: [
    'PRIMARY DIRECTION: Payer requests clinical data FROM Provider - this is the flagship use case',
    'Two patterns exist: Direct Query (sync) vs Task-based (async) - clarify which is shown',
    'Task.status lifecycle: requested → accepted → in-progress → completed',
    'Task.code specifies request type: data-request-code, data-request-questionnaire',
    'Integrates with PAS - attachments for prior authorization are a key use case',
    'Provider is the DATA HOLDER, Payer is the DATA REQUESTER in primary flow',
  ],
  crd: [
    'CRD uses CDS Hooks - not direct FHIR API calls. Show the hook trigger points',
    'order-select and order-sign are the key hooks - different timing in workflow',
    'Cards returned can be: coverage information, documentation requirements, or prior auth needs',
    'The provider system calls the payer CDS service - not the other way around',
  ],
  dtr: [
    'DTR executes payer-provided CQL/questionnaires IN the provider EHR context',
    'Questionnaire resources are retrieved from payer, filled by provider, stored back',
    'Pre-population uses CQL to pull data from EHR automatically',
    'QuestionnaireResponse links back to the triggering order and coverage',
  ],
  atr: [
    'Attribution is not real-time - lists are typically refreshed monthly or quarterly',
    'Group resource contains the attributed patient list - Group.member references Patients',
    'Contracts (value-based care) are the trigger for attribution - show the business context',
    'Attribution can be prospective or retrospective based on contract type',
  ],
  hrex: [
    'HRex is FOUNDATIONAL - other Da Vinci IGs inherit from it. It is not standalone.',
    'Defines Task patterns used across multiple IGs (CDex, PAS, etc.)',
    'Member Match operation is defined here and used by PDex, ATR',
    'Consent handling patterns are defined here',
  ],
  alerts: [
    'The preferred term is "Notifications" not "Alerts" in recent versions',
    'Uses MessageHeader with event codes to signal notification type',
    'ADT (Admit/Discharge/Transfer) notifications are the primary use case',
    'Subscriptions IG is preferred for new implementations - Alerts is for direct push',
  ],
  deqm: [
    'MeasureReport is the core resource - Individual (patient-level) or Summary (population)',
    'Gaps in Care (GIC) reporting identifies missing quality actions',
    'Submit data vs Collect data - two different reporting directions',
    'Links to specific quality measures via Measure.url canonical reference',
  ],
  ra: [
    'Risk Adjustment coding gaps are communicated payer-to-provider',
    'HCC (Hierarchical Condition Category) codes drive risk scores',
    'Suspected conditions vs confirmed conditions have different handling',
    'Annual wellness visits are key opportunities for gap closure',
  ],
  pcde: [
    'Coverage Decision Exchange is about formulary/benefit decisions, not clinical data',
    'Payer provides coverage decision info back to provider for patient discussion',
    'Often triggered after CRD indicates coverage limitations',
  ],
  pct: [
    'Good Faith Estimate (GFE) is the provider-submitted estimate',
    'Advanced EOB (AEOB) is the payer response with expected costs',
    'No Surprises Act compliance is the key driver',
    'Network status affects out-of-pocket calculations significantly',
  ],
  vbpr: [
    'Value-Based Performance Reporting aggregates quality and cost data',
    'Uses MeasureReport from DEQM for quality metrics',
    'Attribution from ATR defines which patients count toward performance',
  ],

  // === CARIN IGs ===
  carin: [
    'ExplanationOfBenefit has multiple profiles: Inpatient, Outpatient, Professional, Pharmacy - each has different required fields',
    'EOB.total shows the full cost breakdown - adjudication at item level shows line-item decisions',
    'Coverage.class identifies the specific plan within a payer',
    'CARIN BB is READ-ONLY - consumers cannot modify claims data',
  ],
  'carin-dic': [
    'Digital Insurance Card returns card images AND structured data',
    'Coverage resource extended with card-specific elements',
    'Front and back card images may be separate Binary resources',
  ],
  'carin-rtpbc': [
    'Real-Time Pharmacy Benefit Check happens BEFORE prescription is finalized',
    'Returns patient cost, alternatives, and coverage information',
    'Integrates with e-prescribing workflows at pharmacy selection',
  ],

  // === FOUNDATIONAL/INFRASTRUCTURE ===
  uscore: [
    'Patient.identifier requires BOTH system and value - show as "system|value" format',
    'Observation.category is 1..* (required AND repeatable) - vitals need "vital-signs" category',
    'us-core-race and us-core-ethnicity use OMB categories with specific coding',
    'MedicationRequest.status must be "active" for current medications',
    'DocumentReference for C-CDA must have type from US Core DocumentReference Type ValueSet',
  ],
  smart: [
    'The "launch" scope is ONLY for EHR launch - standalone launch does not use it',
    'PKCE (code_verifier/code_challenge) is REQUIRED for public clients',
    'Refresh tokens may have shorter lifetime than access tokens - handle refresh failures gracefully',
    'Backend services use RS384 or ES384 for JWT signing - not HS256',
    'The "aud" parameter must match the FHIR server base URL exactly',
  ],
  bulk: [
    'The polling URL (Content-Location) is opaque - clients must not parse or construct it',
    'X-Progress header during polling gives human-readable status',
    'ndjson files are NOT guaranteed to be in any order - clients must handle out-of-order processing',
    'Bulk export can be scoped by _type parameter to limit resource types returned',
    'Group/$export requires the client to have access to that specific Group',
  ],
  subscriptions: [
    'Server Admins define SubscriptionTopics independently - Apps DISCOVER topics, they do not create them',
    'After Subscription creation, server returns Subscription with status="active" (or "error") - show this status transition',
    'Handshake notification is an EMPTY notification (no payload resources) - just SubscriptionStatus with type="handshake"',
    'Heartbeat notifications are periodic - they confirm the subscription is still active',
    'If using rest-hook, the endpoint URL must be pre-registered and validated',
    'Common use case: Prior Authorization status updates - ClaimResponse changes trigger notifications to providers',
  ],

  // === QUALITY/CLINICAL ===
  qicore: [
    'QI-Core profiles add quality measure requirements on top of US Core',
    'negation patterns (e.g., MedicationNotRequested) are important for exclusions',
    'Links to CQL (Clinical Quality Language) for measure logic',
  ],
  cqfm: [
    'Quality Measures are defined as Measure resources with CQL logic',
    'measure.scoring determines type: proportion, ratio, continuous-variable, cohort',
    'Libraries contain reusable CQL that measures reference',
  ],

  // === SPECIALTY ===
  formulary: [
    'FormularyItem links drugs to coverage plans with tier and restrictions',
    'MedicationKnowledge describes the drug itself',
    'Formulary coverage can vary by pharmacy type (retail vs mail-order)',
  ],
  plannet: [
    'PractitionerRole connects Practitioner to Organization to Location',
    'Network defines the insurance network - OrganizationAffiliation links to it',
    'HealthcareService describes specific services offered at locations',
  ],
  'provider-access': [
    'Attribution lists are typically refreshed monthly - show this is not real-time',
    'Group membership can change retroactively for claims purposes',
    'Provider NPIs must be validated against NPPES registry',
    'Attribution can be prospective (assigned) or retrospective (based on claims history)',
  ],

  // === PHARMACY ===
  'specialty-rx': [
    'Hub vendors coordinate between prescribers, pharmacies, and manufacturers',
    'Enrollment in patient support programs is a key use case',
    'Task-based workflow for specialty medication dispensing',
  ],
  meds: [
    'MedicationRequest for orders, MedicationDispense for fills, MedicationAdministration for given doses',
    'MedicationStatement is patient-reported - different from clinical record',
  ],

  // === CLINICAL EXCHANGE ===
  'c-cda': [
    'C-CDA on FHIR wraps CDA documents in DocumentReference + Binary',
    'section templates map to FHIR Composition.section',
    'Not a pure FHIR representation - maintains CDA semantics',
  ],
  ips: [
    'International Patient Summary is designed for cross-border data exchange',
    'Composition organizes sections: allergies, medications, problems, etc.',
    'Bundle type is "document" not "collection"',
  ],

  // === FINANCIAL ===
  eligibility: [
    'CoverageEligibilityRequest is the inquiry, CoverageEligibilityResponse is the answer',
    'Can check for general eligibility or specific service coverage',
    'Benefits returned may include copay, deductible, out-of-pocket max',
  ],
  claim: [
    'Claim.use: claim (billing), preauthorization (PA request), predetermination (estimate)',
    'ClaimResponse.outcome: queued, complete, error, partial',
    'Claim flows are typically synchronous in FHIR unlike X12 batch processing',
  ],

  // === REFERRAL/ORDERS ===
  bser: [
    'Bidirectional Services eReferrals focus on social determinants (SDOH)',
    'ServiceRequest initiates, Task tracks fulfillment, DocumentReference returns results',
    'Key use cases: diabetes prevention, tobacco cessation, obesity referrals',
  ],
  eltss: [
    'Electronic Long-Term Services and Supports for Medicaid LTSS',
    'CarePlan is central - links to services, goals, and responsible parties',
    'Guardian/representative consent patterns are important',
  ],

  // === PUBLIC HEALTH ===
  ecr: [
    'Electronic Case Reporting is triggered by reportable condition detection',
    'eICR (initial report) goes to public health, RR (response) comes back',
    'Automated triggering from EHR based on diagnosis codes',
  ],
  medmorph: [
    'MedMorph provides a framework for public health reporting beyond eCR',
    'Knowledge Artifacts define when/what to report',
    'Backend Services auth for system-to-system reporting',
  ],
};

/**
 * Build quibbles section for injection
 */
export function buildQuibblesSection(ig: string): string {
  const quibbles = QUIBBLES[ig];
  if (!quibbles || quibbles.length === 0) return '';

  return `

THE QUIBBLER - Expert-level details that FHIR specialists will notice:
${quibbles.map(q => `• ${q}`).join('\n')}

Consider incorporating these details if they fit naturally in the diagram. These are not required but demonstrate deep domain knowledge.
`;
}

export const EXPERT_KNOWLEDGE: ExpertKnowledge[] = [
  // ============================================================
  // DA VINCI PROJECT IGs (Payer-Provider Data Exchange)
  // ============================================================

  {
    ig: 'pdex',
    name: 'Da Vinci PDex - Payer Data Exchange',
    triggerPhrases: [
      'payer to payer', 'payer data exchange', 'pdex', 'member switching plans',
      'health plan data transfer', 'cms interoperability', 'payer interoperability',
      'member data transfer', 'plan switch', 'coverage transition'
    ],
    workflowStructure: `
MANDATORY TWO-PHASE WORKFLOW:

PHASE 1 - PATIENT CONSENT & ENROLLMENT (Business/Legal Layer)
Timing: Days or weeks before technical exchange
Actor: Patient initiates
Steps:
1. Patient enrolls with New Payer (Payer B)
2. Patient provides Old Payer (Payer A) member information
3. Patient signs consent authorizing data transfer
4. Consent resource created and stored at New Payer

PHASE 2 - TECHNICAL EXCHANGE (System-to-System Layer)
Timing: After consent exists
Actor: New Payer (Payer B) initiates
Steps:
1. Payer B authenticates to Payer A using SMART Backend Services OAuth
2. Payer B calls $member-match operation (includes Consent reference)
3. Payer A validates consent exists and is active
4. Payer A returns matched Patient identifier
5. Payer B calls $everything or Bulk $export
6. Payer B stores received data with Provenance (source: Payer A)

CRITICAL: These phases happen at DIFFERENT TIMES and must be visually separated.
`,
    requiredResources: [
      { resource: 'Consent', usage: 'Patient authorization for data transfer (Phase 1)' },
      { resource: 'Patient', usage: 'Member demographics' },
      { resource: 'Coverage', usage: 'Insurance plan information' },
      { resource: 'ExplanationOfBenefit', usage: 'Claims and encounter data - THIS IS THE CORRECT RESOURCE FOR CLAIMS' },
      { resource: 'Provenance', usage: 'Tracks data source/lineage after transfer' },
      { resource: 'DocumentReference', usage: 'Clinical summaries and unstructured data' },
    ],
    antiPatterns: [
      'NEVER use ClinicalImpression - it is for clinical decision support at point of care, NOT payer data exchange',
      'NEVER conflate patient consent (Phase 1) with system OAuth authentication (Phase 2)',
      'NEVER show direct Patient resource queries between payers - must use $member-match',
      'NEVER skip Provenance - data lineage tracking is required',
    ],
    keyOperations: [
      '$member-match - Match patient across payers using demographics + coverage',
      '$everything - Retrieve all data for a patient',
      '$export - Bulk data export for multiple members',
    ],
    visualRequirements: [
      'Clear phase separation with labels (Phase 1: Business/Legal, Phase 2: Technical)',
      'Roadmap at top: "1. Enroll & Consent → 2. Auth & Match → 3. Retrieve → 4. Store"',
      'Patient lane shows Phase 1 activity only',
      'Payer lanes show Phase 2 activity',
      'Group clinical resources as "Clinical Data" not individual resources',
      'Color coding: Clinical (blue), Administrative (green), Financial (orange)',
    ],
  },

  {
    ig: 'pas',
    name: 'Da Vinci PAS - Prior Authorization Support',
    triggerPhrases: [
      'prior authorization', 'prior auth', 'pas', 'pre-authorization',
      'service authorization', 'pa request', 'auth request', 'preauth'
    ],
    workflowStructure: `
PRIOR AUTHORIZATION WORKFLOW:

PHASE 1 - DETERMINE NEED
- Provider identifies service requiring prior authorization
- May be triggered by CRD (Coverage Requirements Discovery) hook
- Decision point: PA required for this service?

PHASE 2 - GATHER DOCUMENTATION
- Provider collects required clinical documentation
- May use DTR (Documentation Templates and Rules) for forms
- Bundle supporting resources

PHASE 3 - SUBMIT REQUEST
- Provider calls Claim/$submit operation
- Claim resource with use = "preauthorization"
- Includes: Patient, Coverage, ServiceRequest/MedicationRequest
- Includes: Supporting clinical documentation

PHASE 4 - PAYER ADJUDICATION
- Payer evaluates request (may be automated or manual)
- Payer returns ClaimResponse with outcome

PHASE 5 - ACT ON DECISION
- Approved: Proceed with service, include preAuthRef on final claim
- Denied: Appeal or modify request
- Pended: Provide additional information via Task
`,
    requiredResources: [
      { resource: 'Claim', usage: 'The PA request itself (use: preauthorization)' },
      { resource: 'ClaimResponse', usage: 'Payer decision with outcome and preAuthRef' },
      { resource: 'Patient', usage: 'Member being authorized' },
      { resource: 'Coverage', usage: 'Insurance information' },
      { resource: 'ServiceRequest', usage: 'Procedure/service being requested' },
      { resource: 'MedicationRequest', usage: 'Medication being requested (pharmacy PA)' },
      { resource: 'Task', usage: 'Follow-up requests for additional information' },
      { resource: 'Bundle', usage: 'Contains the complete PA request' },
    ],
    antiPatterns: [
      'NEVER use ClinicalImpression in PA workflows',
      'NEVER confuse Claim (request) with ExplanationOfBenefit (adjudicated claim)',
      'NEVER skip the ClaimResponse - it contains the actual decision',
    ],
    keyOperations: [
      '$submit - Submit the prior authorization request',
    ],
    visualRequirements: [
      'Provider-Payer focus (two main swim lanes)',
      'Show the Bundle contents being submitted',
      'Show response outcomes: approved/denied/pended decision tree',
      'Roadmap: "1. Identify Need → 2. Submit Request → 3. Get Decision → 4. Act"',
    ],
  },

  {
    ig: 'cdex',
    name: 'Da Vinci CDex - Clinical Data Exchange',
    triggerPhrases: [
      'cdex', 'clinical data exchange', 'clinical data request', 'data request',
      'attachments', 'solicited attachment', 'unsolicited attachment', 'payer data request'
    ],
    workflowStructure: `
CDex CLINICAL DATA EXCHANGE WORKFLOW:

IMPORTANT: PRIMARY DIRECTION IS PAYER → PROVIDER (Payer requests data FROM Provider)
The Provider is the DATA HOLDER. The Payer is the DATA REQUESTER.

PATTERN 1 - DIRECT QUERY (Synchronous)
When payer needs simple, standardized data that exists in structured form:
1. Payer authenticates to Provider's FHIR server (SMART Backend Services)
2. Payer sends GET request for specific resources (Condition, Observation, etc.)
3. Provider returns requested resources immediately
4. Best for: Lab results, vitals, diagnoses

PATTERN 2 - TASK-BASED EXCHANGE (Asynchronous)
When payer needs complex data, documents, or human review is required:
1. Payer creates Task resource on Provider's FHIR server
   - Task.code: data-request-code OR data-request-questionnaire
   - Task.for: Patient reference
   - Task.requester: Payer organization
   - Task.owner: Provider organization (who must fulfill)
   - Task.input: Specifies what data is needed
2. Provider receives Task (status: requested)
3. Provider accepts Task (status: accepted → in-progress)
4. Provider gathers clinical data (may involve human review)
5. Provider completes Task (status: completed)
   - Task.output: References to gathered resources
6. Payer retrieves output resources

TASK STATUS LIFECYCLE: requested → accepted → in-progress → completed (or rejected/failed)

USE CASES:
- Prior Authorization attachments (integrates with PAS)
- Claims attachments
- Risk adjustment documentation
- Quality measure data
- Care gap closure evidence
`,
    requiredResources: [
      { resource: 'Task', usage: 'Async request/fulfill - the core CDex coordination resource' },
      { resource: 'Patient', usage: 'Subject of the data request' },
      { resource: 'Organization', usage: 'Requester (Payer) and Owner (Provider)' },
      { resource: 'DocumentReference', usage: 'Clinical documents returned as output' },
      { resource: 'Bundle', usage: 'Collection of clinical resources in response' },
      { resource: 'Condition', usage: 'Diagnoses - commonly requested' },
      { resource: 'Observation', usage: 'Labs, vitals - commonly requested' },
      { resource: 'Procedure', usage: 'Procedures performed - commonly requested' },
      { resource: 'DiagnosticReport', usage: 'Lab reports and imaging results' },
    ],
    antiPatterns: [
      'NEVER show Provider requesting from Payer - the PRIMARY flow is Payer requesting FROM Provider',
      'NEVER skip Task.status lifecycle - show the state transitions',
      'NEVER confuse direct query (GET) with Task-based (async) - they serve different purposes',
      'NEVER forget Task.code - it specifies what type of request this is',
      'NEVER use ClinicalImpression for CDex - use actual clinical resources',
    ],
    keyOperations: [
      '$submit-attachment - Submit attachments for claims/prior auth',
    ],
    visualRequirements: [
      'PAYER on LEFT, PROVIDER on RIGHT - data flows RIGHT to LEFT (Provider → Payer)',
      'Show both patterns OR clearly indicate which one',
      'For Task-based: Show full status lifecycle (requested → accepted → in-progress → completed)',
      'Show Task.input (what is requested) and Task.output (what is returned)',
      'Mention integration with PAS for prior auth attachments',
      'Roadmap: "1. Request Data → 2. Locate Patient → 3. Gather Data → 4. Transmit & Store"',
    ],
  },

  {
    ig: 'crd',
    name: 'Da Vinci CRD - Coverage Requirements Discovery',
    triggerPhrases: [
      'coverage requirements', 'crd', 'coverage discovery', 'payer requirements',
      'cds hooks', 'decision support', 'coverage check', 'requirements discovery'
    ],
    workflowStructure: `
CRD WORKFLOW (CDS Hooks Based):

PHASE 1 - HOOK TRIGGER
- Provider takes clinical action in EHR (order, prescription, etc.)
- EHR fires CDS Hook to Payer CDS Service
- Key hooks:
  * order-select: When order is being created
  * order-sign: When order is being finalized
  * appointment-book: When scheduling
  * encounter-start/discharge: Encounter lifecycle

PHASE 2 - PAYER EVALUATION
- Payer CDS Service receives hook with context (patient, coverage, order)
- Evaluates coverage rules for the requested service
- Determines: prior auth needed? documentation required? alternatives?

PHASE 3 - RESPONSE CARDS
- Payer returns CDS Cards to EHR
- Card types:
  * Coverage Information - what's covered, cost estimates
  * Documentation Requirements - what DTR forms are needed
  * Prior Auth Requirements - PA required, link to start
  * Alternative Suggestions - covered alternatives

PHASE 4 - PROVIDER ACTION
- Provider reviews cards in EHR
- Takes action: proceed, document, start PA, choose alternative
`,
    requiredResources: [
      { resource: 'CDS Hooks', usage: 'Hook request/response mechanism (not FHIR resource)' },
      { resource: 'Coverage', usage: 'Patient insurance context in hook' },
      { resource: 'Patient', usage: 'Patient context' },
      { resource: 'ServiceRequest', usage: 'Order being evaluated' },
      { resource: 'MedicationRequest', usage: 'Prescription being evaluated' },
    ],
    antiPatterns: [
      'NEVER show direct FHIR API calls - CRD uses CDS Hooks',
      'NEVER confuse CRD (discovery) with PAS (submission)',
      'NEVER show payer initiating - provider EHR fires the hook',
    ],
    keyOperations: [
      'CDS Hook: order-select, order-sign, appointment-book',
    ],
    visualRequirements: [
      'Show CDS Hooks integration point between EHR and Payer',
      'Cards visual representing payer responses',
      'Timing: at point of care, before order finalization',
      'Roadmap: "1. Clinical Action → 2. Fire Hook → 3. Evaluate Coverage → 4. Return Cards"',
    ],
  },

  {
    ig: 'dtr',
    name: 'Da Vinci DTR - Documentation Templates and Rules',
    triggerPhrases: [
      'documentation templates', 'dtr', 'questionnaire', 'forms',
      'documentation requirements', 'payer forms', 'smart forms', 'cql forms'
    ],
    workflowStructure: `
DTR WORKFLOW:

PHASE 1 - DISCOVER REQUIREMENTS
- CRD indicates documentation is needed
- Provider selects to complete documentation
- EHR launches DTR SMART app or native DTR functionality

PHASE 2 - RETRIEVE QUESTIONNAIRE
- DTR app fetches Questionnaire from payer
- Questionnaire contains CQL logic for pre-population
- May include adaptive questions (branch logic)

PHASE 3 - PRE-POPULATE
- DTR executes CQL in provider EHR context
- Automatically fills answers from EHR data (labs, diagnoses, etc.)
- Provider reviews and completes remaining fields

PHASE 4 - SUBMIT RESPONSE
- QuestionnaireResponse saved to provider's system
- Can be attached to prior auth request (PAS)
- Can be stored for audit/documentation purposes
`,
    requiredResources: [
      { resource: 'Questionnaire', usage: 'Payer-defined form with CQL logic' },
      { resource: 'QuestionnaireResponse', usage: 'Completed form responses' },
      { resource: 'Library', usage: 'CQL logic for pre-population' },
      { resource: 'Coverage', usage: 'Links form to specific coverage' },
    ],
    antiPatterns: [
      'NEVER show Questionnaire created by provider - payer defines templates',
      'NEVER skip pre-population - CQL automation is a key feature',
    ],
    keyOperations: [
      '$questionnaire-package - Get questionnaire with dependencies',
      'CQL execution in provider context',
    ],
    visualRequirements: [
      'Show SMART app or embedded DTR in EHR',
      'Show CQL pre-population pulling from EHR data',
      'Questionnaire → QuestionnaireResponse flow',
      'Roadmap: "1. Discover Need → 2. Get Form → 3. Pre-populate → 4. Complete & Submit"',
    ],
  },

  {
    ig: 'atr',
    name: 'Da Vinci ATR - Member Attribution',
    triggerPhrases: [
      'attribution', 'atr', 'member attribution', 'patient panel',
      'attributed patients', 'value based care', 'vbc attribution', 'risk contracts'
    ],
    workflowStructure: `
MEMBER ATTRIBUTION WORKFLOW:

PHASE 1 - CONTRACT ESTABLISHMENT
- Payer and Provider establish value-based care contract
- Define attribution methodology (prospective vs retrospective)
- Set attribution refresh schedule (typically monthly)

PHASE 2 - ATTRIBUTION LIST CREATION
- Payer generates attribution list based on:
  * Claims history (retrospective)
  * Primary care assignment (prospective)
  * Care management enrollment
- Group resource created with member list

PHASE 3 - SHARE ATTRIBUTION
- Payer makes Group available via FHIR API
- Provider retrieves attributed patient list
- May use $davinci-data-export for bulk retrieval

PHASE 4 - USE FOR ACCESS CONTROL
- Provider Access API scoped to attributed patients
- Quality reporting scoped to attributed population
- Care gap outreach limited to attributed members
`,
    requiredResources: [
      { resource: 'Group', usage: 'Contains attributed patient list (atr-group profile)' },
      { resource: 'Patient', usage: 'Attributed members' },
      { resource: 'Practitioner', usage: 'Attributed provider' },
      { resource: 'Organization', usage: 'Provider organization in contract' },
      { resource: 'Coverage', usage: 'Plan coverage for members' },
    ],
    antiPatterns: [
      'NEVER show real-time attribution - lists are periodic',
      'NEVER confuse Group with CareTeam - Group is for population, CareTeam for individual',
    ],
    keyOperations: [
      '$davinci-data-export - Bulk export for attributed population',
      '$member-add, $member-remove - Attribution list changes',
    ],
    visualRequirements: [
      'Show business context: value-based care contract',
      'Group resource as container for attributed patients',
      'Periodic refresh indication (not real-time)',
      'Roadmap: "1. Contract → 2. Build List → 3. Share → 4. Scope Access"',
    ],
  },

  {
    ig: 'hrex',
    name: 'Da Vinci HRex - Health Record Exchange',
    triggerPhrases: [
      'hrex', 'health record exchange', 'da vinci foundation',
      'member match', 'consent patterns'
    ],
    workflowStructure: `
HRex FOUNDATIONAL PATTERNS:

HRex is NOT a standalone IG - it provides patterns used by other Da Vinci IGs.

PATTERN 1 - MEMBER MATCH
- Used by PDex, ATR, and others
- Match patient across organizations using demographics + coverage
- $member-match operation

PATTERN 2 - TASK-BASED WORKFLOW
- Request/fulfill pattern for async operations
- Task.code indicates type of request
- Status lifecycle: requested → accepted → in-progress → completed
- Used by CDex, PAS (for pended requests)

PATTERN 3 - CONSENT HANDLING
- Consent resource patterns for data sharing authorization
- Consent.provision defines scope and period
- Referenced by PDex, CDex

PATTERN 4 - COMMON PROFILES
- HRex Organization, Practitioner, Coverage profiles
- Referenced as base by other IGs
`,
    requiredResources: [
      { resource: 'Task', usage: 'Async request/fulfill pattern' },
      { resource: 'Consent', usage: 'Data sharing authorization' },
      { resource: 'Parameters', usage: '$member-match input/output' },
      { resource: 'Coverage', usage: 'HRex Coverage profile' },
    ],
    antiPatterns: [
      'NEVER implement HRex in isolation - use with specific use case IG',
    ],
    keyOperations: [
      '$member-match - Patient matching across organizations',
    ],
    visualRequirements: [
      'Show as foundation layer that other IGs build on',
      'If diagramming: show which IG is using HRex patterns',
    ],
  },

  {
    ig: 'deqm',
    name: 'Da Vinci DEQM - Data Exchange for Quality Measures',
    triggerPhrases: [
      'quality measures', 'deqm', 'quality reporting', 'hedis',
      'gaps in care', 'quality data', 'measure report', 'ecqm'
    ],
    workflowStructure: `
QUALITY MEASURE DATA EXCHANGE:

PATTERN 1 - SUBMIT DATA
Provider → Payer/Registry direction
- Provider submits data for measure evaluation
- MeasureReport with status: data-collection
- Includes relevant clinical resources

PATTERN 2 - COLLECT DATA
Payer → Provider direction
- Payer requests specific data for measures
- Provider returns MeasureReport with resources
- May use CDex Task pattern for async

PATTERN 3 - GAPS IN CARE
- Payer identifies missing quality actions
- DetectedIssue or custom gap report
- Provider uses to prioritize outreach

PATTERN 4 - MEASURE REPORTING
- Final MeasureReport with status: complete
- Individual (patient-level) or Summary (population)
- Includes calculated scores and populations
`,
    requiredResources: [
      { resource: 'MeasureReport', usage: 'Quality measure results - individual or summary' },
      { resource: 'Measure', usage: 'Definition of quality measure' },
      { resource: 'DetectedIssue', usage: 'Gaps in care identification' },
      { resource: 'Patient', usage: 'Subject of individual measure' },
      { resource: 'Group', usage: 'Population for summary measures' },
    ],
    antiPatterns: [
      'NEVER confuse Individual MeasureReport (1 patient) with Summary (population)',
      'NEVER skip the Measure reference - links to measure definition',
    ],
    keyOperations: [
      '$submit-data - Submit quality data',
      '$collect-data - Request quality data',
      '$care-gaps - Get gaps in care report',
    ],
    visualRequirements: [
      'Show bidirectional flows (submit vs collect)',
      'MeasureReport as central artifact',
      'Gaps in care as actionable output',
      'Roadmap varies: Submit: "1. Gather → 2. Package → 3. Submit" / Collect: "1. Request → 2. Gather → 3. Return"',
    ],
  },

  {
    ig: 'alerts',
    name: 'Da Vinci Alerts - Unsolicited Notifications',
    triggerPhrases: [
      'alerts', 'notifications', 'adt notifications', 'admit discharge transfer',
      'unsolicited notifications', 'event notifications', 'admission alerts'
    ],
    workflowStructure: `
UNSOLICITED NOTIFICATION WORKFLOW:

TRIGGER EVENTS:
- Patient admission
- Patient discharge
- Patient transfer
- Treatment changes
- New diagnoses

NOTIFICATION FLOW:
1. Event occurs at sending facility
2. Sender builds notification Bundle
3. Bundle contains:
   - MessageHeader (event type, sender, recipient)
   - Triggering resource (Encounter, Condition, etc.)
   - Supporting context (Patient, Coverage)
4. POST Bundle to receiver's endpoint
5. Receiver processes and acknowledges

NOTE: For new implementations, prefer Subscriptions IG for event-driven notifications.
Alerts is for direct push without subscription setup.
`,
    requiredResources: [
      { resource: 'Bundle', usage: 'Notification container (type: message)' },
      { resource: 'MessageHeader', usage: 'Notification metadata and event type' },
      { resource: 'Encounter', usage: 'Admission/discharge/transfer context' },
      { resource: 'Condition', usage: 'New diagnosis notifications' },
      { resource: 'Patient', usage: 'Subject of notification' },
      { resource: 'Coverage', usage: 'Insurance context' },
    ],
    antiPatterns: [
      'NEVER confuse with Subscriptions IG - Alerts is push, Subscriptions is subscribe-then-push',
    ],
    keyOperations: [
      '$process-message - Process notification bundle',
    ],
    visualRequirements: [
      'Show push from sender to receiver (no subscription step)',
      'MessageHeader as routing information',
      'Event trigger clearly shown',
      'Roadmap: "1. Event Occurs → 2. Build Notification → 3. Send → 4. Process"',
    ],
  },

  {
    ig: 'ra',
    name: 'Da Vinci RA - Risk Adjustment',
    triggerPhrases: [
      'risk adjustment', 'hcc', 'hierarchical condition categories',
      'risk scores', 'coding gaps', 'raf', 'risk adjustment factor'
    ],
    workflowStructure: `
RISK ADJUSTMENT WORKFLOW:

PHASE 1 - IDENTIFY GAPS
- Payer analyzes claims/encounters for coding opportunities
- Identifies suspected conditions lacking HCC documentation
- Generates coding gap report

PHASE 2 - COMMUNICATE GAPS
- Payer sends gap report to Provider
- Report includes:
  * Patient
  * Suspected condition
  * Evidence/rationale
  * Documentation requirements

PHASE 3 - PROVIDER REVIEW
- Provider reviews during care encounter
- Confirms or rejects suspected conditions
- Documents appropriately in EHR

PHASE 4 - CLOSE GAPS
- Provider submits encounters with proper coding
- Payer updates risk scores
- Annual wellness visits are key opportunity
`,
    requiredResources: [
      { resource: 'MeasureReport', usage: 'Risk gap report' },
      { resource: 'Condition', usage: 'Suspected conditions for documentation' },
      { resource: 'DetectedIssue', usage: 'Coding gap identification' },
      { resource: 'Patient', usage: 'Member with gaps' },
    ],
    antiPatterns: [
      'NEVER show provider initiating gaps - payer identifies from claims analysis',
      'NEVER confuse with quality gaps (DEQM) - RA is about coding accuracy',
    ],
    keyOperations: [
      '$report - Generate risk adjustment report',
    ],
    visualRequirements: [
      'Payer-to-Provider flow for gap communication',
      'Show suspected vs confirmed condition distinction',
      'Annual wellness visit as key touchpoint',
      'Roadmap: "1. Analyze Claims → 2. Identify Gaps → 3. Communicate → 4. Document & Close"',
    ],
  },

  {
    ig: 'pct',
    name: 'Da Vinci PCT - Patient Cost Transparency',
    triggerPhrases: [
      'patient cost', 'pct', 'good faith estimate', 'gfe',
      'no surprises', 'cost estimate', 'aeob', 'advanced eob'
    ],
    workflowStructure: `
PATIENT COST TRANSPARENCY (No Surprises Act):

PHASE 1 - PROVIDER ESTIMATE (GFE)
- Patient requests estimate or scheduling triggers requirement
- Provider creates Good Faith Estimate (GFE)
- GFE Bundle contains expected services and charges
- Submitted to payer for AEOB

PHASE 2 - PAYER PROCESSING
- Payer receives GFE Bundle via $gfe-submit
- Applies coverage rules, network status, accumulators
- Calculates patient responsibility

PHASE 3 - ADVANCED EOB (AEOB)
- Payer returns Advanced EOB
- Shows expected patient costs
- Includes breakdown: deductible, copay, coinsurance

PHASE 4 - PATIENT RECEIVES
- Provider or payer delivers estimate to patient
- Patient makes informed decision
- Estimate valid for specified period
`,
    requiredResources: [
      { resource: 'Bundle', usage: 'GFE Bundle and AEOB Bundle' },
      { resource: 'Claim', usage: 'GFE claim with use: predetermination' },
      { resource: 'ExplanationOfBenefit', usage: 'AEOB with cost breakdown' },
      { resource: 'Coverage', usage: 'Patient insurance information' },
      { resource: 'Patient', usage: 'Requesting patient' },
    ],
    antiPatterns: [
      'NEVER confuse GFE (provider estimate) with AEOB (payer response)',
      'NEVER skip network status - major impact on patient costs',
    ],
    keyOperations: [
      '$gfe-submit - Submit Good Faith Estimate',
      '$gfe-retrieve - Get GFE by identifier',
    ],
    visualRequirements: [
      'Three parties: Provider, Payer, Patient',
      'GFE Bundle → AEOB response flow',
      'Cost breakdown visualization',
      'Roadmap: "1. Create GFE → 2. Submit to Payer → 3. Get AEOB → 4. Deliver to Patient"',
    ],
  },

  // ============================================================
  // CARIN ALLIANCE IGs
  // ============================================================

  {
    ig: 'carin',
    name: 'CARIN Blue Button - Consumer Claims Access',
    triggerPhrases: [
      'carin', 'blue button', 'consumer claims', 'patient claims access',
      'c4bb', 'member claims', 'claims history', 'carin bb'
    ],
    workflowStructure: `
CONSUMER CLAIMS ACCESS WORKFLOW:

PHASE 1 - MEMBER AUTHORIZATION
- Member connects third-party app to payer portal
- SMART App Launch (patient-facing)
- Member authorizes claims data access

PHASE 2 - CLAIMS DATA RETRIEVAL
- App queries ExplanationOfBenefit endpoint
- Returns claims history in CARIN BB format
- Includes professional, institutional, pharmacy claims

CLAIM TYPES (Different Profiles):
- C4BB ExplanationOfBenefit Inpatient
- C4BB ExplanationOfBenefit Outpatient
- C4BB ExplanationOfBenefit Professional
- C4BB ExplanationOfBenefit Pharmacy
- C4BB ExplanationOfBenefit Oral

PHASE 3 - DATA USE
- Consumer views in app
- Can share with other apps/providers
- Historical claims for care coordination
`,
    requiredResources: [
      { resource: 'ExplanationOfBenefit', usage: 'Claims data - the core resource (multiple profiles for claim types)' },
      { resource: 'Coverage', usage: 'Insurance plan details' },
      { resource: 'Patient', usage: 'Member demographics' },
      { resource: 'Organization', usage: 'Payer and provider organizations' },
      { resource: 'Practitioner', usage: 'Rendering and referring providers' },
    ],
    antiPatterns: [
      'NEVER use Claim for consumer access - use ExplanationOfBenefit (adjudicated claims)',
      'NEVER use ClinicalImpression for claims data',
      'NEVER allow write access - CARIN BB is READ-ONLY',
    ],
    keyOperations: [],
    visualRequirements: [
      'Consumer/member-centric view',
      'Show OAuth app authorization flow',
      'ExplanationOfBenefit as primary output',
      'Show different claim type profiles if relevant',
      'Roadmap: "1. Connect App → 2. Authorize → 3. Retrieve Claims"',
    ],
  },

  {
    ig: 'carin-dic',
    name: 'CARIN Digital Insurance Card',
    triggerPhrases: [
      'insurance card', 'digital insurance card', 'dic', 'member card',
      'insurance id card', 'digital id card', 'coverage card'
    ],
    workflowStructure: `
DIGITAL INSURANCE CARD WORKFLOW:

PHASE 1 - MEMBER REQUEST
- Member opens app or payer portal
- Requests digital insurance card
- May be proactive (card in wallet) or on-demand

PHASE 2 - CARD RETRIEVAL
- App queries Coverage endpoint with card extension
- Returns structured data AND card images
- Card data includes: member ID, group, plan, dates

PHASE 3 - CARD DISPLAY
- Front card image (Binary resource)
- Back card image (Binary resource)
- Structured data for form-filling
- QR code for verification (optional)
`,
    requiredResources: [
      { resource: 'Coverage', usage: 'Insurance information with card extensions' },
      { resource: 'Binary', usage: 'Card images (front and back)' },
      { resource: 'Patient', usage: 'Member demographics' },
      { resource: 'Organization', usage: 'Payer information' },
    ],
    antiPatterns: [
      'NEVER return only structured data - card images are key use case',
    ],
    keyOperations: [],
    visualRequirements: [
      'Show both structured data and visual card',
      'Front/back card images',
      'Member accessing via app',
      'Roadmap: "1. Request Card → 2. Get Coverage + Images → 3. Display"',
    ],
  },

  // ============================================================
  // FOUNDATIONAL/INFRASTRUCTURE IGs
  // ============================================================

  {
    ig: 'uscore',
    name: 'US Core - Clinical Data Access',
    triggerPhrases: [
      'us core', 'patient access', 'clinical data api', 'patient portal',
      'uscdi', 'patient data access', 'ehr access', 'patient records'
    ],
    workflowStructure: `
PATIENT DATA ACCESS WORKFLOW:

PHASE 1 - AUTHORIZATION (SMART App Launch)
- Patient or Provider launches app
- App redirects to EHR authorization server
- User authenticates and authorizes requested scopes
- App receives access token with patient context

PHASE 2 - DATA ACCESS
- App queries FHIR server with bearer token
- Retrieves US Core profiled resources
- Respects granted scopes (patient/*.read, etc.)

KEY RESOURCE CATEGORIES (USCDI):
- Problems: Condition
- Medications: MedicationRequest
- Allergies: AllergyIntolerance
- Lab Results: Observation, DiagnosticReport
- Vital Signs: Observation (vital-signs category)
- Procedures: Procedure
- Immunizations: Immunization
- Clinical Notes: DocumentReference
`,
    requiredResources: [
      { resource: 'Patient', usage: 'Demographics with required extensions' },
      { resource: 'Condition', usage: 'Problems/diagnoses (category required)' },
      { resource: 'Observation', usage: 'Vitals and lab results (category: vital-signs or laboratory)' },
      { resource: 'MedicationRequest', usage: 'Active medications' },
      { resource: 'AllergyIntolerance', usage: 'Allergies and intolerances' },
      { resource: 'Procedure', usage: 'Procedures performed' },
      { resource: 'Immunization', usage: 'Vaccination records' },
      { resource: 'DiagnosticReport', usage: 'Lab reports and imaging' },
      { resource: 'DocumentReference', usage: 'Clinical notes (C-CDA on FHIR)' },
    ],
    antiPatterns: [
      'NEVER forget US Core required extensions on Patient: us-core-race, us-core-ethnicity, us-core-birthsex',
      'NEVER skip category on Condition and Observation - they are required',
    ],
    keyOperations: [],
    visualRequirements: [
      'Show SMART App Launch OAuth flow',
      'Patient-centered (patient authorizes access)',
      'Group resources by USCDI category: Problems, Medications, Labs, Vitals, etc.',
      'Roadmap: "1. Launch → 2. Authorize → 3. Get Token → 4. Query Data"',
    ],
  },

  {
    ig: 'smart',
    name: 'SMART App Launch - Authorization',
    triggerPhrases: [
      'smart app launch', 'smart on fhir', 'oauth', 'authorization',
      'app launch', 'ehr launch', 'standalone launch', 'smart auth'
    ],
    workflowStructure: `
SMART APP LAUNCH WORKFLOW:

STANDALONE LAUNCH:
1. App opens authorization URL with: client_id, redirect_uri, scope, state, aud
2. User authenticates at authorization server
3. User authorizes requested scopes
4. Redirect back to app with authorization code
5. App exchanges code for access token (+ refresh token, patient context)
6. App uses token to access FHIR resources

EHR LAUNCH:
1. EHR launches app with launch parameter
2. App requests authorization with launch scope
3. Token response includes EHR context (patient, encounter, etc.)
4. App uses context for FHIR queries

BACKEND SERVICES (System-to-System):
1. Client creates signed JWT assertion
2. POST to token endpoint with grant_type=client_credentials
3. Receive access token (no refresh token)
4. Use for system-level operations
`,
    requiredResources: [],
    antiPatterns: [
      'NEVER confuse standalone launch (app opens first) with EHR launch (EHR opens app)',
      'NEVER use user-facing OAuth for backend services - use client credentials + JWT',
      'NEVER forget PKCE for public clients',
    ],
    keyOperations: [],
    visualRequirements: [
      'Show different launch types as separate flows',
      'For EHR launch, show launch parameter flow',
      'For backend services, show JWT assertion',
      'Scopes prominently displayed',
      'Roadmap varies by type',
    ],
  },

  {
    ig: 'bulk',
    name: 'Bulk Data - Population Health Export',
    triggerPhrases: [
      'bulk data', 'population health', '$export', 'bulk export',
      'ndjson', 'backend services', 'analytics', 'quality measures', 'flat fhir'
    ],
    workflowStructure: `
BULK DATA EXPORT WORKFLOW:

PHASE 1 - SYSTEM AUTHENTICATION
- Backend Services OAuth (no user interaction)
- Client credentials + signed JWT assertion
- System-level scopes (system/*.read)

PHASE 2 - INITIATE EXPORT
- Kick off: GET [base]/Patient/$export or Group/[id]/$export
- Header: Prefer: respond-async
- Response: 202 Accepted + Content-Location header with polling URL

PHASE 3 - POLL FOR COMPLETION
- GET polling URL
- 202 while processing (X-Progress header for status)
- 200 when complete with manifest

PHASE 4 - DOWNLOAD FILES
- Manifest contains URLs to ndjson files
- One file per resource type
- Download with bearer token
`,
    requiredResources: [
      { resource: 'Group', usage: 'Defines patient cohort for Group-level export' },
      { resource: 'Patient', usage: 'Patient-level export retrieves all data for all patients' },
    ],
    antiPatterns: [
      'NEVER show user/patient in the flow - this is system-to-system',
      'NEVER forget the async pattern (polling)',
      'NEVER assume file order in ndjson output',
    ],
    keyOperations: [
      '$export - Initiate bulk export (Patient-level or Group-level)',
    ],
    visualRequirements: [
      'System-to-system only (no patient actor)',
      'Show async pattern clearly: Kick-off → Poll → Download',
      'Show ndjson files as output',
      'Roadmap: "1. System Auth → 2. Kick-off Export → 3. Poll Status → 4. Download ndjson"',
    ],
  },

  {
    ig: 'subscriptions',
    name: 'FHIR Subscriptions - Real-time Notifications',
    triggerPhrases: [
      'subscription', 'notifications', 'real-time', 'topic-based subscription',
      'webhook', 'push notifications', 'event notifications', 'subscription topic'
    ],
    workflowStructure: `
TOPIC-BASED SUBSCRIPTION WORKFLOW:

PHASE 1 - TOPIC DEFINITION (Server Admin)
- SubscriptionTopic resource defines what triggers notifications
- Specifies: trigger resource type, filter criteria, allowed payload content
- Topics are canonical - referenced by URL

PHASE 2 - CREATE SUBSCRIPTION (App)
- App creates Subscription resource referencing a Topic
- Specifies channel: rest-hook, websocket, email, or message
- Specifies endpoint URL for notifications
- Specifies payload type: empty, id-only, or full-resource
- Server validates and sets status: requested → active

PHASE 3 - HANDSHAKE (Server → App)
- For rest-hook: Server sends empty notification to validate endpoint
- App must respond with 200 OK
- Subscription becomes active only after successful handshake

PHASE 4 - TRIGGER EVENT (Server)
- Resource change matches SubscriptionTopic criteria
- Example: ClaimResponse updated with outcome (Prior Authorization decision)
- Example: Task created requesting additional documentation

PHASE 5 - SEND NOTIFICATION (Server → App)
- Server builds notification Bundle (type: subscription-notification)
- First entry: SubscriptionStatus (event count, type, errors)
- Subsequent entries: Triggering resources (based on payload type)
- POST Bundle to endpoint

PHASE 6 - PROCESS (App)
- App receives Bundle
- Extracts SubscriptionStatus for metadata
- Processes payload resources
- May GET full resources if payload was id-only
`,
    requiredResources: [
      { resource: 'SubscriptionTopic', usage: 'Canonical definition of what triggers notifications (R5/backport)' },
      { resource: 'Subscription', usage: 'Instance that subscribes to a topic with channel config' },
      { resource: 'SubscriptionStatus', usage: 'First entry in notification Bundle - contains event metadata' },
      { resource: 'Bundle', usage: 'Notification container (type: subscription-notification)' },
    ],
    antiPatterns: [
      'NEVER conflate SubscriptionTopic (canonical definition) with Subscription (instance)',
      'NEVER forget the SubscriptionStatus resource - it is ALWAYS the first entry in notification Bundle',
      'NEVER skip the channel type - rest-hook, websocket, email, or message must be specified',
      'NEVER forget handshake for rest-hook channels',
      'Common healthcare use case: Prior Auth status notifications (ClaimResponse changes) - NOT just admissions',
    ],
    keyOperations: [
      '$status - Get current status of a subscription',
      '$events - Retrieve missed events',
    ],
    visualRequirements: [
      'Show SubscriptionTopic as separate from Subscription',
      'Show channel type prominently (rest-hook is most common)',
      'Show notification Bundle structure with SubscriptionStatus first',
      'Show handshake step for rest-hook',
      'Roadmap: "1. Define Topic → 2. Subscribe → 3. Handshake → 4. Trigger → 5. Notify"',
      'Use Prior Authorization (ClaimResponse) as the trigger example - most relevant healthcare use case',
    ],
  },

  {
    ig: 'provider-access',
    name: 'Provider Access API - Value-Based Care',
    triggerPhrases: [
      'provider access', 'provider api', 'provider directory',
      'attribution', 'patient panel', 'value-based care', 'aco'
    ],
    workflowStructure: `
PROVIDER ACCESS WORKFLOW:

PHASE 1 - APP REGISTRATION
- Provider organization registers app with payer/data holder
- Receives client credentials

PHASE 2 - PATIENT-PROVIDER ATTRIBUTION
- Provider/Organization is attributed to a patient panel
- Group resource defines which patients the provider can access
- Attribution sources:
  - Payer attribution list (value-based care contracts)
  - ACO/CIN roster
  - PCP assignment
  - Care team membership
- This determines the SCOPE of data access

PHASE 3 - AUTHENTICATION
- Backend Services OAuth (system-to-system)
- Or SMART App Launch if user context needed
- Scopes limited to attributed patients

PHASE 4 - DATA QUERY
- Query FHIR endpoints for attributed patients only
- Access restricted via Group membership
- GET Patient, Condition, Observation, etc.
`,
    requiredResources: [
      { resource: 'Group', usage: 'Defines attributed patient panel' },
      { resource: 'Patient', usage: 'Patient demographics' },
      { resource: 'Practitioner', usage: 'Provider being attributed' },
      { resource: 'Organization', usage: 'Provider organization' },
      { resource: 'Condition', usage: 'Patient conditions' },
      { resource: 'Observation', usage: 'Clinical observations' },
    ],
    antiPatterns: [
      'NEVER skip attribution - providers only access their attributed patients',
      'NEVER use ClinicalImpression for clinical data',
    ],
    keyOperations: [],
    visualRequirements: [
      'MUST show Patient-Provider Attribution step prominently',
      'Group resource links Practitioner to Patient panel',
      'Show that access is scoped to attributed patients only',
      'Roadmap: "1. Register → 2. Attribution → 3. Authenticate → 4. Query"',
    ],
  },

  // ============================================================
  // PHARMACY IGs
  // ============================================================

  {
    ig: 'formulary',
    name: 'PDex US Drug Formulary',
    triggerPhrases: [
      'formulary', 'drug formulary', 'medication formulary', 'drug list',
      'tier', 'drug coverage', 'pdex formulary', 'prescription coverage'
    ],
    workflowStructure: `
DRUG FORMULARY ACCESS:

PHASE 1 - DISCOVER FORMULARIES
- Consumer/app queries InsurancePlan endpoint
- Gets list of plans for payer
- Each plan links to its formulary

PHASE 2 - SEARCH FORMULARY
- Query FormularyItem with drug code
- Returns coverage information:
  * Tier (1, 2, 3, etc.)
  * Prior auth required?
  * Step therapy required?
  * Quantity limits?

PHASE 3 - DRUG DETAILS
- Query MedicationKnowledge for drug info
- Package sizes, strengths, forms
- Alternative medications

PHASE 4 - COST COMPARISON
- Compare across plans
- Compare alternatives
- Factor in pharmacy type (retail vs mail)
`,
    requiredResources: [
      { resource: 'InsurancePlan', usage: 'Plan information with formulary reference' },
      { resource: 'FormularyItem', usage: 'Drug coverage details (tier, restrictions)' },
      { resource: 'MedicationKnowledge', usage: 'Drug information' },
      { resource: 'Location', usage: 'Pharmacy locations (retail vs mail)' },
    ],
    antiPatterns: [
      'NEVER confuse FormularyItem (coverage) with MedicationKnowledge (drug info)',
      'NEVER forget pharmacy type affects coverage',
    ],
    keyOperations: [],
    visualRequirements: [
      'Consumer-facing application',
      'Show tier structure (1=generic, 2=preferred brand, etc.)',
      'Show restriction types (PA, ST, QL)',
      'Roadmap: "1. Select Plan → 2. Search Drug → 3. View Coverage → 4. Compare Options"',
    ],
  },

  {
    ig: 'plannet',
    name: 'PDex Plan-Net - Provider Directory',
    triggerPhrases: [
      'provider directory', 'plan net', 'plannet', 'network directory',
      'find provider', 'in-network', 'provider search', 'directory'
    ],
    workflowStructure: `
PROVIDER DIRECTORY ACCESS:

SEARCH PATTERNS:
- Find providers by specialty
- Find providers by location
- Find providers in network
- Find organizations accepting new patients

KEY RELATIONSHIPS:
- Practitioner → PractitionerRole → Organization
- Organization → OrganizationAffiliation → Network
- HealthcareService → Location
- InsurancePlan → Network

QUERY FLOW:
1. Consumer selects insurance plan
2. Get Network(s) for plan
3. Search PractitionerRole with network filter
4. Get details: Practitioner, Location, HealthcareService
5. Display results with accepting status
`,
    requiredResources: [
      { resource: 'Practitioner', usage: 'Provider demographics and qualifications' },
      { resource: 'PractitionerRole', usage: 'Links practitioner to organization and network' },
      { resource: 'Organization', usage: 'Provider organizations' },
      { resource: 'OrganizationAffiliation', usage: 'Organization participation in networks' },
      { resource: 'Network', usage: 'Insurance network' },
      { resource: 'HealthcareService', usage: 'Services offered' },
      { resource: 'Location', usage: 'Physical locations' },
      { resource: 'InsurancePlan', usage: 'Links plans to networks' },
    ],
    antiPatterns: [
      'NEVER query Practitioner directly for network info - use PractitionerRole',
      'NEVER skip OrganizationAffiliation for organization-level network participation',
    ],
    keyOperations: [],
    visualRequirements: [
      'Show relationship chain: Plan → Network → PractitionerRole → Practitioner',
      'Consumer/member as initiator',
      'Location-based search visualization',
      'Roadmap: "1. Select Plan → 2. Get Network → 3. Search Providers → 4. View Details"',
    ],
  },

  {
    ig: 'specialty-rx',
    name: 'Specialty Medication Enrollment',
    triggerPhrases: [
      'specialty rx', 'specialty pharmacy', 'specialty medication',
      'patient enrollment', 'hub', 'manufacturer program', 'patient support'
    ],
    workflowStructure: `
SPECIALTY MEDICATION WORKFLOW:

PHASE 1 - PRESCRIPTION
- Provider prescribes specialty medication
- Identifies need for specialty pharmacy fulfillment
- May require prior authorization first

PHASE 2 - ENROLLMENT REQUEST
- Prescriber or pharmacy creates enrollment Task
- Task sent to hub vendor or specialty pharmacy
- Includes: prescription, patient demographics, insurance

PHASE 3 - PROGRAM ENROLLMENT
- Hub coordinates with manufacturer programs
- Patient support program enrollment
- Financial assistance evaluation
- Copay card enrollment

PHASE 4 - COORDINATION
- Specialty pharmacy receives prescription
- Benefits investigation
- Patient outreach and education
- Delivery scheduling

PHASE 5 - DISPENSING
- Medication shipped to patient or infusion center
- Administration instructions provided
- Ongoing refill management
`,
    requiredResources: [
      { resource: 'Task', usage: 'Enrollment request and tracking' },
      { resource: 'MedicationRequest', usage: 'Specialty prescription' },
      { resource: 'Patient', usage: 'Patient demographics' },
      { resource: 'Coverage', usage: 'Insurance information' },
      { resource: 'Organization', usage: 'Prescriber, pharmacy, hub, manufacturer' },
    ],
    antiPatterns: [
      'NEVER skip hub coordination - specialty meds usually require it',
      'NEVER confuse with regular e-prescribing workflow',
    ],
    keyOperations: [],
    visualRequirements: [
      'Multiple parties: Prescriber, Hub, Specialty Pharmacy, Manufacturer, Patient',
      'Task-based coordination',
      'Enrollment as key step before dispensing',
      'Roadmap: "1. Prescribe → 2. Enroll → 3. Coordinate → 4. Dispense"',
    ],
  },

  // ============================================================
  // QUALITY MEASURE IGs
  // ============================================================

  {
    ig: 'qicore',
    name: 'QI-Core - Quality Improvement Core',
    triggerPhrases: [
      'qi core', 'qicore', 'quality improvement', 'cql',
      'clinical quality', 'measure profiles', 'quality data model'
    ],
    workflowStructure: `
QI-CORE PURPOSE:

QI-Core builds on US Core with quality-specific requirements:
- Adds profiles for negation (what was NOT done)
- Supports CQL (Clinical Quality Language) execution
- Used by quality measures for data requirements

KEY PATTERNS:

POSITIVE ASSERTIONS:
- Condition, Procedure, MedicationRequest, etc. from US Core
- Extended with measure-relevant elements

NEGATION PATTERNS:
- MedicationNotRequested - medication explicitly not ordered
- ProcedureNotDone - procedure explicitly not performed
- Includes reason for not doing (patient refused, contraindicated, etc.)
- Critical for measure exclusions

CQL INTEGRATION:
- CQL libraries reference QI-Core profiles
- DataRequirements specify what data measures need
- Enables portable measure logic
`,
    requiredResources: [
      { resource: 'US Core profiles', usage: 'Base clinical data profiles' },
      { resource: 'MedicationNotRequested', usage: 'Negation of medication order' },
      { resource: 'ProcedureNotDone', usage: 'Negation of procedure' },
      { resource: 'ServiceNotRequested', usage: 'Negation of service request' },
    ],
    antiPatterns: [
      'NEVER forget negation profiles for exclusion criteria',
      'NEVER use absence of data as negation - must be explicit',
    ],
    keyOperations: [],
    visualRequirements: [
      'Show as layer on top of US Core',
      'Highlight negation patterns',
      'Show CQL linkage',
    ],
  },

  {
    ig: 'cqfm',
    name: 'Quality Measure IG',
    triggerPhrases: [
      'quality measure', 'cqfm', 'ecqm', 'measure definition',
      'cql measure', 'measure authoring', 'clinical quality measure'
    ],
    workflowStructure: `
QUALITY MEASURE STRUCTURE:

MEASURE RESOURCE:
- scoring: proportion, ratio, continuous-variable, cohort
- type: process, outcome, structure
- improvementNotation: increase or decrease
- group: defines measure populations

POPULATION TYPES:
- Initial Population (IP) - starting denominator
- Denominator - eligible for measure
- Denominator Exclusion - valid reasons to exclude
- Numerator - met the measure criteria
- Numerator Exclusion - met criteria but excluded
- Denominator Exception - did not meet but excused

CQL LOGIC:
- Library contains reusable logic
- Each population references CQL expression
- Data requirements derived from CQL

MEASURE USE:
- Measures are canonical - referenced by URL
- MeasureReport contains evaluation results
- Can be individual or population-level
`,
    requiredResources: [
      { resource: 'Measure', usage: 'Measure definition with populations' },
      { resource: 'Library', usage: 'CQL logic library' },
      { resource: 'MeasureReport', usage: 'Evaluation results' },
      { resource: 'ValueSet', usage: 'Code sets used in logic' },
    ],
    antiPatterns: [
      'NEVER confuse scoring types - each has different calculation',
      'NEVER skip Library - CQL logic is not inline in Measure',
    ],
    keyOperations: [
      '$evaluate-measure - Execute measure against data',
      '$data-requirements - Get data needs for measure',
    ],
    visualRequirements: [
      'Show Measure → Library relationship',
      'Population funnel: IP → Denom → Numer',
      'Show exclusion/exception branches',
    ],
  },

  // ============================================================
  // CLINICAL EXCHANGE IGs
  // ============================================================

  {
    ig: 'c-cda',
    name: 'C-CDA on FHIR',
    triggerPhrases: [
      'ccda', 'c-cda', 'clinical document', 'continuity of care',
      'ccd', 'discharge summary', 'clinical summary', 'cda on fhir'
    ],
    workflowStructure: `
C-CDA ON FHIR:

DOCUMENT TYPES:
- Continuity of Care Document (CCD)
- Discharge Summary
- Progress Note
- Consultation Note
- Referral Note

FHIR REPRESENTATION:
- DocumentReference points to document
- Binary contains the actual CDA content
- Or: Composition-based with sections mapped

SECTION MAPPING:
- Problems → Condition resources
- Medications → MedicationStatement/Request
- Allergies → AllergyIntolerance
- Procedures → Procedure
- Results → Observation, DiagnosticReport
- Vital Signs → Observation

EXCHANGE PATTERNS:
- Query DocumentReference by type
- Retrieve document content
- May be rendered or structured
`,
    requiredResources: [
      { resource: 'DocumentReference', usage: 'Metadata and pointer to document' },
      { resource: 'Binary', usage: 'Raw CDA document content' },
      { resource: 'Composition', usage: 'Structured document sections' },
      { resource: 'Bundle', usage: 'Document bundle (type: document)' },
    ],
    antiPatterns: [
      'NEVER assume C-CDA sections map 1:1 to FHIR resources',
      'NEVER skip DocumentReference metadata',
    ],
    keyOperations: [
      '$document - Generate document from Composition',
    ],
    visualRequirements: [
      'Show document type hierarchy',
      'Section to FHIR resource mapping',
      'DocumentReference → Binary relationship',
    ],
  },

  {
    ig: 'ips',
    name: 'International Patient Summary',
    triggerPhrases: [
      'ips', 'international patient summary', 'cross border',
      'patient summary', 'emergency access', 'travel health'
    ],
    workflowStructure: `
INTERNATIONAL PATIENT SUMMARY:

PURPOSE:
- Cross-border care scenarios
- Emergency access to patient information
- Travel health records
- Minimum viable patient summary

REQUIRED SECTIONS:
- Medication Summary
- Allergies and Intolerances
- Problem List

RECOMMENDED SECTIONS:
- Immunizations
- Procedures
- Medical Devices
- Diagnostic Results
- Vital Signs
- Past Illness History
- Pregnancy Status
- Social History
- Functional Status
- Plan of Care

STRUCTURE:
- Bundle type: document
- First entry: Composition
- Composition.type: 60591-5 (Patient summary)
- Sections reference contained resources
`,
    requiredResources: [
      { resource: 'Bundle', usage: 'Document bundle containing IPS' },
      { resource: 'Composition', usage: 'Organizes sections' },
      { resource: 'Patient', usage: 'Subject of summary' },
      { resource: 'AllergyIntolerance', usage: 'Required section' },
      { resource: 'MedicationStatement', usage: 'Required section' },
      { resource: 'Condition', usage: 'Required section' },
    ],
    antiPatterns: [
      'NEVER use Bundle type: collection - must be document',
      'NEVER skip required sections (even if empty - use "no known" entries)',
    ],
    keyOperations: [
      '$summary - Generate IPS for patient',
    ],
    visualRequirements: [
      'Document structure with Composition sections',
      'Required vs recommended sections',
      'Cross-border use case context',
    ],
  },

  // ============================================================
  // FINANCIAL IGs
  // ============================================================

  {
    ig: 'eligibility',
    name: 'Coverage Eligibility',
    triggerPhrases: [
      'eligibility', 'coverage check', 'benefit check', 'insurance verification',
      'coverage eligibility', 'benefit verification', '270 271'
    ],
    workflowStructure: `
COVERAGE ELIGIBILITY CHECK:

PHASE 1 - ELIGIBILITY REQUEST
- Provider/app creates CoverageEligibilityRequest
- Specifies: patient, coverage, date(s), service type (optional)
- Can be general or service-specific query

PHASE 2 - PAYER PROCESSING
- Payer validates coverage
- Checks benefits for service type if specified
- Calculates remaining benefits based on accumulators

PHASE 3 - ELIGIBILITY RESPONSE
- CoverageEligibilityResponse returned
- Contains:
  * Coverage status (active/cancelled)
  * Benefit details (deductible, copay, coinsurance)
  * Limitations and maximums
  * Remaining amounts (accumulators)
  * Prior auth requirements

QUERY TYPES:
- General eligibility: Is coverage active?
- Benefits inquiry: What's covered for this service?
- Specific service: Is this specific service covered?
`,
    requiredResources: [
      { resource: 'CoverageEligibilityRequest', usage: 'Eligibility inquiry' },
      { resource: 'CoverageEligibilityResponse', usage: 'Eligibility and benefit details' },
      { resource: 'Coverage', usage: 'Insurance plan being queried' },
      { resource: 'Patient', usage: 'Member being verified' },
      { resource: 'Organization', usage: 'Payer' },
    ],
    antiPatterns: [
      'NEVER confuse with claims (Claim/ClaimResponse) - this is inquiry only',
      'NEVER skip the response - contains actual benefit information',
    ],
    keyOperations: [],
    visualRequirements: [
      'Provider → Payer inquiry/response',
      'Show benefit breakdown in response',
      'Real-time transaction (not async)',
      'Roadmap: "1. Create Request → 2. Submit → 3. Get Response → 4. Use Benefits Info"',
    ],
  },

  {
    ig: 'claim',
    name: 'Claims Processing',
    triggerPhrases: [
      'claim', 'claims', 'billing', 'claim submission',
      '837', 'claim processing', 'remittance', 'claim response'
    ],
    workflowStructure: `
CLAIMS WORKFLOW:

CLAIM USES:
- claim: Actual billing for services rendered
- preauthorization: Prior auth request (see PAS)
- predetermination: Cost estimate (see PCT)

PHASE 1 - CLAIM CREATION
- Provider bundles claim data:
  * Patient, Coverage
  * Line items with procedures/services
  * Diagnoses
  * Supporting documentation

PHASE 2 - SUBMISSION
- Professional vs Institutional claim types
- Submit via $submit operation or POST
- May be real-time or batch

PHASE 3 - ADJUDICATION
- Payer processes claim
- Applies coverage rules
- Determines payment

PHASE 4 - RESPONSE
- ClaimResponse with outcome:
  * complete: Fully processed
  * error: Could not process
  * partial: Some items processed
  * queued: Will process later
- Payment details if approved
- Denial reasons if rejected
`,
    requiredResources: [
      { resource: 'Claim', usage: 'The claim being submitted' },
      { resource: 'ClaimResponse', usage: 'Adjudication result' },
      { resource: 'Patient', usage: 'Member billed for' },
      { resource: 'Coverage', usage: 'Insurance being billed' },
      { resource: 'Practitioner', usage: 'Rendering provider' },
      { resource: 'Organization', usage: 'Billing provider organization' },
    ],
    antiPatterns: [
      'NEVER confuse Claim with ExplanationOfBenefit - EOB is post-adjudication for consumers',
      'NEVER submit preauthorization as regular claim',
    ],
    keyOperations: [
      '$submit - Submit claim for processing',
    ],
    visualRequirements: [
      'Provider → Payer submission flow',
      'Show claim type differentiation',
      'Show outcome codes',
      'Roadmap: "1. Create Claim → 2. Submit → 3. Adjudicate → 4. Get Response"',
    ],
  },

  // ============================================================
  // REFERRAL/ORDERS IGs
  // ============================================================

  {
    ig: 'bser',
    name: 'BSeR - Bidirectional Services eReferral',
    triggerPhrases: [
      'bser', 'ereferral', 'referral', 'social determinants',
      'sdoh', 'diabetes prevention', 'tobacco cessation', 'obesity'
    ],
    workflowStructure: `
BIDIRECTIONAL SERVICES eREFERRAL:

USE CASES:
- Diabetes Prevention Program (DPP)
- Tobacco Cessation
- Obesity/Weight Management
- Chronic Disease Management
- Social Services Referral

PHASE 1 - REFERRAL INITIATION
- Provider identifies patient need
- Creates ServiceRequest referral
- Includes: patient, reason, supporting info
- Task created for tracking

PHASE 2 - REFERRAL TRANSMISSION
- ServiceRequest sent to receiving organization
- May be community-based organization (CBO)
- Task status: requested

PHASE 3 - REFERRAL ACCEPTANCE
- Receiver reviews referral
- Accepts or rejects
- Task status: accepted or rejected

PHASE 4 - SERVICE DELIVERY
- Program/service delivered to patient
- Task status: in-progress
- Progress documented

PHASE 5 - FEEDBACK LOOP
- Results sent back to referring provider
- DocumentReference with outcomes
- Task status: completed
`,
    requiredResources: [
      { resource: 'ServiceRequest', usage: 'The referral request' },
      { resource: 'Task', usage: 'Tracking referral fulfillment' },
      { resource: 'Patient', usage: 'Subject of referral' },
      { resource: 'Observation', usage: 'Supporting clinical info and outcomes' },
      { resource: 'DocumentReference', usage: 'Feedback documents' },
      { resource: 'Organization', usage: 'Referring and receiving organizations' },
    ],
    antiPatterns: [
      'NEVER skip the feedback loop - bidirectional is key',
      'NEVER confuse with simple order - includes social/community services',
    ],
    keyOperations: [],
    visualRequirements: [
      'Bidirectional flow: Referral out, Feedback back',
      'Multiple organization types (healthcare + CBO)',
      'Task-based tracking throughout',
      'Roadmap: "1. Identify Need → 2. Send Referral → 3. Deliver Service → 4. Return Feedback"',
    ],
  },

  {
    ig: 'eltss',
    name: 'eLTSS - Electronic Long-Term Services and Supports',
    triggerPhrases: [
      'eltss', 'long term services', 'ltss', 'medicaid ltss',
      'home care', 'personal care', 'waiver services', 'care plan'
    ],
    workflowStructure: `
ELECTRONIC LONG-TERM SERVICES AND SUPPORTS:

CONTEXT:
- Medicaid LTSS programs
- Home and Community-Based Services (HCBS)
- Waiver programs
- Supports for elderly/disabled

PHASE 1 - ASSESSMENT
- Person-centered assessment
- Identifies support needs
- Documents goals and preferences

PHASE 2 - CARE PLAN DEVELOPMENT
- CarePlan as central resource
- Goals linked to activities
- Services identified to meet goals
- Responsible parties assigned

PHASE 3 - SERVICE AUTHORIZATION
- Services authorized under waiver/program
- Claim/preauthorization for services
- Budget/allocation tracking

PHASE 4 - SERVICE DELIVERY
- Services delivered per plan
- Multiple service providers may be involved
- Guardians/representatives may authorize

PHASE 5 - MONITORING
- Progress toward goals
- Care plan updates
- Reassessment triggers
`,
    requiredResources: [
      { resource: 'CarePlan', usage: 'Central care plan document' },
      { resource: 'Goal', usage: 'Person-centered goals' },
      { resource: 'ServiceRequest', usage: 'Services in the plan' },
      { resource: 'Patient', usage: 'Person receiving services' },
      { resource: 'RelatedPerson', usage: 'Guardians, representatives' },
      { resource: 'Consent', usage: 'Authorization from person/guardian' },
      { resource: 'Observation', usage: 'Assessment findings' },
    ],
    antiPatterns: [
      'NEVER skip person-centered approach - individual goals are key',
      'NEVER forget guardian/representative consent patterns',
    ],
    keyOperations: [],
    visualRequirements: [
      'Person at center (person-centered planning)',
      'CarePlan → Goals → Services relationships',
      'Multiple provider/organization involvement',
      'Guardian/representative roles',
      'Roadmap: "1. Assess → 2. Plan → 3. Authorize → 4. Deliver → 5. Monitor"',
    ],
  },

  // ============================================================
  // PUBLIC HEALTH IGs
  // ============================================================

  {
    ig: 'ecr',
    name: 'eCR - Electronic Case Reporting',
    triggerPhrases: [
      'ecr', 'case reporting', 'electronic case reporting',
      'reportable condition', 'public health reporting', 'eicr'
    ],
    workflowStructure: `
ELECTRONIC CASE REPORTING:

TRIGGER:
- Provider EHR detects reportable condition
- Based on diagnosis code, lab result, etc.
- Automated trigger (RCTC - Reportable Condition Trigger Codes)

PHASE 1 - GENERATE eICR
- EHR generates electronic Initial Case Report (eICR)
- Document bundle with patient and condition info
- Automatically assembled from EHR data

PHASE 2 - TRANSMIT TO PHA
- eICR sent to Public Health Authority
- Via AIMS platform or direct transmission
- Routing based on patient jurisdiction

PHASE 3 - PUBLIC HEALTH PROCESSING
- PHA receives and processes report
- May request additional information
- Epidemiological investigation if needed

PHASE 4 - REPORTABILITY RESPONSE (RR)
- PHA returns Reportability Response
- Confirms receipt
- Indicates if condition is reportable in jurisdiction
- May include instructions for provider
`,
    requiredResources: [
      { resource: 'Bundle', usage: 'eICR document bundle' },
      { resource: 'Composition', usage: 'eICR document structure' },
      { resource: 'Patient', usage: 'Case subject' },
      { resource: 'Condition', usage: 'Reportable condition' },
      { resource: 'Observation', usage: 'Lab results, findings' },
      { resource: 'Encounter', usage: 'Visit context' },
    ],
    antiPatterns: [
      'NEVER skip automated triggering - manual reporting is backup only',
      'NEVER confuse eICR (report) with RR (response)',
    ],
    keyOperations: [],
    visualRequirements: [
      'EHR → Public Health flow',
      'Automated trigger point',
      'Bidirectional: eICR out, RR back',
      'Roadmap: "1. Detect Condition → 2. Generate eICR → 3. Transmit → 4. Receive RR"',
    ],
  },

  {
    ig: 'medmorph',
    name: 'MedMorph - Public Health Reporting Framework',
    triggerPhrases: [
      'medmorph', 'public health framework', 'health data exchange',
      'research reporting', 'registry reporting', 'cancer registry'
    ],
    workflowStructure: `
MEDMORPH FRAMEWORK:

PURPOSE:
- Standardized framework for public health and research reporting
- Goes beyond eCR to other use cases:
  * Cancer registry reporting
  * Health survey reporting
  * Research data submission
  * Chronic disease reporting

COMPONENTS:
- Knowledge Artifacts: Define what/when to report
- Backend Services: Automated system-to-system auth
- Subscriptions: Trigger-based reporting

PHASE 1 - KNOWLEDGE DISTRIBUTION
- Public Health/Research defines reporting requirements
- PlanDefinition describes triggers and actions
- Distributed to healthcare organizations

PHASE 2 - SUBSCRIPTION/TRIGGER
- EHR subscribes to relevant events
- Trigger condition met (diagnosis, procedure, etc.)

PHASE 3 - DATA COLLECTION
- Gather relevant data per Knowledge Artifact
- May include clinical, administrative data
- Bundle assembled

PHASE 4 - TRANSMISSION
- Backend Services auth to receiving system
- Submit data bundle
- Track submission status
`,
    requiredResources: [
      { resource: 'PlanDefinition', usage: 'Knowledge artifact defining reporting rules' },
      { resource: 'Bundle', usage: 'Submitted data package' },
      { resource: 'MessageHeader', usage: 'Routing information' },
      { resource: 'Subscription', usage: 'Event-based triggering' },
    ],
    antiPatterns: [
      'NEVER implement without Knowledge Artifact - defines the rules',
      'NEVER skip Backend Services auth - system-to-system',
    ],
    keyOperations: [
      '$process-message - Process reporting bundle',
    ],
    visualRequirements: [
      'Knowledge Artifact distribution layer',
      'Trigger-based automated reporting',
      'Healthcare → Public Health/Research flow',
      'Roadmap: "1. Distribute Rules → 2. Subscribe → 3. Trigger → 4. Collect → 5. Submit"',
    ],
  },
];

/**
 * Build a composite knowledge chunk for embedding
 */
export function buildExpertChunk(knowledge: ExpertKnowledge): string {
  const resources = knowledge.requiredResources
    .map(r => `- ${r.resource}: ${r.usage}`)
    .join('\n');

  const antiPatterns = knowledge.antiPatterns
    .map(a => `- ${a}`)
    .join('\n');

  const visual = knowledge.visualRequirements
    .map(v => `- ${v}`)
    .join('\n');

  const operations = knowledge.keyOperations.length > 0
    ? `KEY OPERATIONS:\n${knowledge.keyOperations.map(o => `- ${o}`).join('\n')}\n\n`
    : '';

  return `[FHIR IG: ${knowledge.name}]

TRIGGER PHRASES: ${knowledge.triggerPhrases.join(', ')}

${knowledge.workflowStructure}

REQUIRED RESOURCES:
${resources}

ANTI-PATTERNS (DO NOT DO):
${antiPatterns}

${operations}VISUAL REQUIREMENTS:
${visual}
`;
}

# 20-case portfolio

> Generated from `src/content/cases/portfolio/`. Do not edit by hand. Run `npm run portfolio:docs`.

Every case is set on **Remote Health USA**, validated against the plan knowledge base, and also cites `rhus.structure.self_funded_erisa` and `rhus.structure.spd_governs` (plan header / rules panel). Those two are omitted from the table.

**Recommended warm-up:** `SAMPLE-01` (The $2,400 MRI bill) before Case 1.

## Cases

| # | Title | Difficulty | Primary scenario | Skills tested | Plan rules tested | Concepts tested | Recording priority |
|---|---|---|---|---|---|---|---|
| 1 | "Do I owe $285?": reading a paid EOB | Foundation | In-network PCP visit paid in full. Member mistakes the EOB for a bill and the billed amount for what they owe. | EOB investigation, Allowed amount, Member responsibility, CPT concepts, ICD-10 concepts, Plain-English explanation | `rhus.benefit.pcp_visit`<br>`rhus.cost.in_network_no_cost_share`<br>`rhus.cost.deductible.in_network`<br>`rhus.structure.in_network_direct_billing` | eob, billed-amount, allowed-amount, contracted-rate, plan-payment, member-responsibility, provider-statement, cpt, icd10, member-communication, care-coordination | high |
| 2 | "Copay due": a charge the EOB doesn't support | Foundation | In-network specialist visit with $0 EOB. The provider statement asks for a front-desk 'copay'. Pharmacy copay is correct. | Medical billing, Identifying inconsistencies / errors, Member responsibility, Provider/member/payer coordination, Pharmacy authorization, Plain-English explanation, Deductible / copay / coinsurance | `rhus.benefit.specialist_visit`<br>`rhus.cost.in_network_no_cost_share`<br>`rhus.rx.retail` | eob, provider-statement, member-responsibility, copayment, contracted-rate, pharmacy-prior-authorization, cpt, icd10, member-communication, care-coordination | medium |
| 3 | A $480 bill for a claim that isn't finished | Foundation | In-network PT. The claim is pended for provider records, yet the clinic transfers the balance to the patient. Member considers stopping therapy. | Claims investigation, Medical billing, Provider/member/payer coordination, CPT concepts, ICD-10 concepts, Member communication | `rhus.benefit.physical_therapy`<br>`rhus.cost.in_network_no_cost_share`<br>`rhus.structure.in_network_direct_billing`<br>`rhus.structure.bywater_tpa` | claims-lifecycle, claim-statuses, adjudication, provider-statement, eob, cpt, icd10, member-communication, care-coordination | medium |
| 4 | Approved CT, scary-looking EOB | Foundation | Pre-authorization required, obtained and linked. The claim is paid correctly. Member confuses the billed amount with the amount owed. | Prior authorization, EOB investigation, Allowed amount, CPT concepts, ICD-10 concepts, Plain-English explanation | `rhus.benefit.diagnostic_ct`<br>`rhus.pa.list.k`<br>`rhus.pa.provider_usually_requests`<br>`rhus.pa.member_must_confirm`<br>`rhus.cost.in_network_no_cost_share` | prior-authorization, authorization-linking, eob, member-responsibility, billed-amount, allowed-amount, contracted-rate, provider-statement, cpt, icd10, medical-necessity, member-communication, care-coordination | high |
| 5 | "Why am I paying for their mistake?": the missing pre-authorization | Intermediate | Pre-authorization required but never requested. The official 10% penalty ($420) is applied, the bill matches the EOB, and the penalty doesn't count toward the out-of-pocket limit. | Prior authorization, Member responsibility, Medical billing, CPT concepts, ICD-10 concepts, Member communication | `rhus.benefit.day_surgery`<br>`rhus.pa.list.j`<br>`rhus.pa.penalty`<br>`rhus.pa.penalty_not_counted`<br>`rhus.pa.member_must_confirm`<br>`rhus.pa.provider_usually_requests`<br>`rhus.cost.in_network_no_cost_share` | prior-authorization, member-responsibility, out-of-pocket-max, provider-statement, eob, cpt, icd10, member-communication, care-coordination | high |
| 6 | Approved for a CT, billed for an MRI | Intermediate | The authorization covers a different service. The order changed from CT to MRI the day before, and nobody requested a new approval. The EOB shows $0; the bill shows $2,850. | Prior authorization, CPT concepts, Identifying inconsistencies / errors, Claim denials, Medical billing, Provider/member/payer coordination | `rhus.benefit.diagnostic_mri`<br>`rhus.benefit.diagnostic_ct`<br>`rhus.pa.list.k`<br>`rhus.pa.penalty`<br>`rhus.pa.provider_usually_requests`<br>`rhus.structure.bywater_tpa` | prior-authorization, authorization-linking, cpt, icd10, denial, claim-correction, provider-statement, eob, member-responsibility, member-communication, care-coordination | high |
| 7 | "The directory said in-network!" | Intermediate | The claim was processed out of network ($380 to the deductible), and the provider bills $520. The directory lists the doctor in network under a different group and tax ID. Needs verification before anyone tells the member what they owe. | Network vs. out-of-network, Member responsibility, Balance billing, Identifying inconsistencies / errors, Claim correction / reprocessing, Provider/member/payer coordination | `rhus.structure.cigna_ppo_network`<br>`rhus.benefit.specialist_visit`<br>`rhus.cost.in_network_no_cost_share`<br>`rhus.cost.deductible.out_of_network`<br>`rhus.cost.coinsurance.out_of_network`<br>`rhus.cost.balance_billing`<br>`rhus.cost.deductible.rules` | network, deductible, balance-billing, allowed-amount, claim-correction, provider-statement, eob, icd10, cpt, member-communication, care-coordination | high |
| 8 | Back pain therapy denied for an ear infection | Intermediate | CPT/ICD mismatch. A diagnosis keying error caused the denial, so the fix is a corrected claim, not an appeal. The EOB shows $0; the clinic bills $195. | CPT concepts, ICD-10 concepts, Claim denials, Claim correction / reprocessing, Appeals (general concepts), Identifying inconsistencies / errors, Plain-English explanation | `rhus.benefit.physical_therapy`<br>`rhus.cost.in_network_no_cost_share`<br>`rhus.structure.medical_necessity` | cpt, icd10, coding-error, medical-necessity, denial, claim-correction, appeal, provider-statement, eob, member-responsibility, member-communication, care-coordination | medium |
| 9 | "DENIED as a duplicate?": the colonoscopy that was already paid | Intermediate+ | Two claims and two EOBs. The original was paid in full and the resubmission denied as a duplicate. The provider's statement ignores the original payment and adjustment. | Claims investigation, Claim denials, Medical billing, Identifying inconsistencies / errors, Prior authorization, Provider/member/payer coordination | `rhus.benefit.endoscopy_non_routine`<br>`rhus.cost.in_network_no_cost_share` | duplicate-claim, claim-statuses, denial, eob, provider-statement, prior-authorization, authorization-linking, contracted-rate, cpt, icd10, member-communication, care-coordination | medium |
| 10 | Expired authorization, and a bill that's still too high | Intermediate+ | Two separate issues. (1) Expired authorization: the official 10% reduction = $135. (2) The statement adds a $750 contractual adjustment the EOB doesn't support ($885 vs $135). | Prior authorization, Member responsibility, Allowed amount, Medical billing, Identifying inconsistencies / errors, Provider/member/payer coordination | `rhus.benefit.diagnostic_mri`<br>`rhus.pa.list.k`<br>`rhus.pa.penalty`<br>`rhus.pa.penalty_not_counted`<br>`rhus.pa.member_must_confirm`<br>`rhus.cost.in_network_no_cost_share` | prior-authorization, authorization-linking, allowed-amount, contracted-rate, provider-statement, member-responsibility, eob, cpt, icd10, member-communication, care-coordination | high |
| 11 | Fixed claim, old bill | Intermediate+ | Two claims and two EOBs: the original was denied (CPT code in the diagnosis field) and the corrected claim paid. The statement, dated after the correction, still shows the denial. Teaches which document is current. | Claim correction / reprocessing, CPT concepts, ICD-10 concepts, Claim denials, Medical billing, Identifying inconsistencies / errors | `rhus.benefit.allergy_testing`<br>`rhus.cost.in_network_no_cost_share` | claim-correction, coding-error, cpt, icd10, denial, claim-statuses, provider-statement, eob, allowed-amount, member-communication, care-coordination | medium |
| 12 | Visit 21: when a benefit runs out | Intermediate+ | Partial payment: visit 20 paid, visits 21–22 not covered (plan maximum). The member does owe $190 per the EOB, but the statement asks for $265 because adjustments weren't applied. | EOB investigation, Member responsibility, Allowed amount, Medical billing, Identifying inconsistencies / errors, Plain-English explanation, Claim denials | `rhus.benefit.acupuncture`<br>`rhus.excl.plan_maximums`<br>`rhus.cost.oop.never_counts`<br>`rhus.cost.in_network_no_cost_share` | benefit-limit, eob, member-responsibility, allowed-amount, contracted-rate, provider-statement, out-of-pocket-max, denial, cpt, icd10, member-communication, care-coordination | medium |
| 13 | $330 on the EOB, $580 on the bill | Advanced | Out-of-network visit: remaining deductible, 70/30 split, and a $250 balance bill that's consistent with the plan rules. The member must learn the difference and which amounts count toward the out-of-pocket limit. | Network vs. out-of-network, Balance billing, Allowed amount, Member responsibility, Plain-English explanation, Deductible / copay / coinsurance | `rhus.structure.cigna_ppo_network`<br>`rhus.structure.out_of_network_allowed`<br>`rhus.benefit.specialist_visit`<br>`rhus.cost.deductible.out_of_network`<br>`rhus.cost.coinsurance.out_of_network`<br>`rhus.cost.balance_billing`<br>`rhus.cost.oop.out_of_network`<br>`rhus.cost.oop.never_counts` | network, deductible, coinsurance, allowed-amount, balance-billing, out-of-pocket-max, member-responsibility, eob, provider-statement, icd10, member-communication, care-coordination | high |
| 14 | The anesthesia bill nobody warned me about | Advanced | Three claims: facility and surgeon paid $0, anesthesia processed out of network (EOB $720, bill $1,800). Federal surprise-billing protections may apply (general concept), so verify before telling the member anything is owed. | Network vs. out-of-network, Balance billing, Member responsibility, Prior authorization, Provider/member/payer coordination, Identifying inconsistencies / errors | `rhus.benefit.surgery`<br>`rhus.pa.list.j`<br>`rhus.cost.in_network_no_cost_share`<br>`rhus.cost.deductible.out_of_network`<br>`rhus.cost.balance_billing`<br>`rhus.structure.bywater_tpa`<br>`rhus.structure.cigna_ppo_network` | surprise-billing, network, balance-billing, deductible, allowed-amount, prior-authorization, authorization-linking, eob, provider-statement, cpt, icd10, member-communication, care-coordination | high |
| 15 | New cancer treatment, approval "pending" | Advanced | Specialty authorization: chemo (E) and infusion (L) require pre-authorization. The existing approval doesn't cover the new drug, and the new request is pending. High-empathy communication with no promises and no medical advice. | Specialty authorization, Prior authorization, CPT concepts, ICD-10 concepts, Provider/member/payer coordination, Member communication | `rhus.benefit.oncology`<br>`rhus.benefit.infusion`<br>`rhus.pa.list.e`<br>`rhus.pa.list.l`<br>`rhus.pa.provider_usually_requests`<br>`rhus.pa.member_must_confirm`<br>`rhus.pa.penalty`<br>`rhus.cost.in_network_no_cost_share` | prior-authorization, authorization-linking, hcpcs, cpt, icd10, medical-necessity, eob, member-communication, care-coordination | high |
| 16 | "The pharmacy wants $6,912" | Advanced | Pharmacy authorization. A rejected pharmacy claim shows the cash price, not cost share. Specialty copay of $50 (official). The source is silent on the pharmacy PA process, so verify. Contrasted with medical-benefit infusion (list L). | Pharmacy authorization, Specialty authorization, Prior authorization, Member responsibility, Provider/member/payer coordination, Plain-English explanation | `rhus.rx.specialty`<br>`rhus.benefit.pharmacy_specialty`<br>`rhus.benefit.infusion`<br>`rhus.pa.list.l`<br>`rhus.cost.in_network_no_cost_share` | pharmacy-prior-authorization, prior-authorization, member-responsibility, copayment, hcpcs, icd10, member-communication, care-coordination | high |
| 17 | Emergency appendectomy out of town | Complex | Conflicting information: a timely weekend notification exists but wasn't linked, so the penalty looks inconsistent. Whether emergency-level benefits extend to the admission is unresolved by the sources. Out-of-pocket cap math, a $16,100 hospital bill, and federal protections to verify. | Complex claim investigation, Network vs. out-of-network, Prior authorization, Member responsibility, Balance billing, Identifying inconsistencies / errors, Member communication | `rhus.benefit.emergency_services`<br>`rhus.pa.emergency_notification`<br>`rhus.pa.penalty`<br>`rhus.pa.penalty_not_counted`<br>`rhus.pa.list.a`<br>`rhus.benefit.hospital_room`<br>`rhus.cost.deductible.out_of_network`<br>`rhus.cost.coinsurance.out_of_network`<br>`rhus.cost.oop.out_of_network`<br>`rhus.cost.oop.rules`<br>`rhus.cost.oop.never_counts`<br>`rhus.cost.balance_billing`<br>`rhus.structure.bywater_tpa` | surprise-billing, network, deductible, coinsurance, out-of-pocket-max, balance-billing, prior-authorization, authorization-linking, eob, provider-statement, cpt, icd10, member-communication, care-coordination | high |
| 18 | After the stroke: home nursing and a hospital bed | Complex | Specialty authorizations. Home health visits 9–12 got a 10% reduction ($60), but the agency bills $1,100. The DME authorization was denied (medical necessity), so the EOB says $480 is owed. The member asks to 'fight it', which is handled as a general appeal concept with no invented procedure. | Specialty authorization, Prior authorization, Medical billing, Identifying inconsistencies / errors, Appeals (general concepts), Complex claim investigation, Provider/member/payer coordination | `rhus.benefit.home_health`<br>`rhus.pa.list.m`<br>`rhus.benefit.dme`<br>`rhus.pa.list.h`<br>`rhus.pa.penalty`<br>`rhus.structure.medical_necessity`<br>`rhus.cost.in_network_no_cost_share`<br>`rhus.pa.provider_usually_requests` | prior-authorization, authorization-linking, appeal, denial, medical-necessity, provider-statement, eob, hcpcs, icd10, member-responsibility, member-communication, care-coordination | high |
| 19 | "But it was approved!": the genetic test sent to another lab | Complex | The authorization covers a different provider and date. Out-of-network deductible, coinsurance, reduction, and a $2,200 balance bill. Some facts are known, much needs verification, and several parties need contacting. | Complex claim investigation, Prior authorization, Network vs. out-of-network, Balance billing, Member responsibility, Identifying inconsistencies / errors, Member communication | `rhus.benefit.genetic_testing`<br>`rhus.pa.list.n`<br>`rhus.pa.penalty`<br>`rhus.pa.penalty_not_counted`<br>`rhus.cost.deductible.out_of_network`<br>`rhus.cost.coinsurance.out_of_network`<br>`rhus.cost.balance_billing`<br>`rhus.cost.oop.never_counts`<br>`rhus.cost.oop.out_of_network`<br>`rhus.structure.cigna_ppo_network` | prior-authorization, authorization-linking, network, deductible, coinsurance, balance-billing, out-of-pocket-max, eob, provider-statement, cpt, icd10, member-communication, care-coordination | high |
| 20 | Capstone: the knee surgery with four bills | Capstone | Full case: claim, EOBs, bills, authorization, CPT/HCPCS, ICD-10 laterality, plan benefits and communication. Four providers, three different problems. No hints. | Complex claim investigation, Prior authorization, CPT concepts, ICD-10 concepts, Medical billing, Identifying inconsistencies / errors, Provider/member/payer coordination, Member communication | `rhus.benefit.surgery`<br>`rhus.pa.list.j`<br>`rhus.benefit.dme`<br>`rhus.pa.list.h`<br>`rhus.pa.penalty`<br>`rhus.pa.penalty_not_counted`<br>`rhus.benefit.physical_therapy`<br>`rhus.cost.in_network_no_cost_share`<br>`rhus.structure.bywater_tpa`<br>`rhus.pa.provider_usually_requests` | prior-authorization, authorization-linking, cpt, icd10, hcpcs, coding-error, claim-correction, provider-statement, eob, member-responsibility, copayment, contracted-rate, member-communication, care-coordination | high |
| A1 | Medical-necessity denial: the member wants to appeal | **BLOCKED_PENDING_SPD** | A pre-authorization for a specialty service is denied as not medically necessary. The treating physician believes the reviewer lacked key documentation. The member asks how to appeal, how long it takes, and whether they can get the service in the meantime. | Appeals (general concepts), Claim denials, Specialty authorization, Prior authorization, Provider/member/payer coordination, Member communication, Plain-English explanation | `rhus.structure.medical_necessity`<br>`rhus.structure.spd_governs`<br>`rhus.structure.bywater_tpa`<br>`rhus.pa.member_must_confirm` (+ SPD appeals rules, not yet sourced) | appeal, denial, medical-necessity, prior-authorization, care-coordination, member-communication | after SPD |

## Skill coverage

| Skill | Cases | Count |
|---|---|---|
| EOB investigation | 1, 4, 12 | 3 |
| Claims investigation | 3, 9 | 2 |
| Medical billing | 2, 3, 5, 6, 9, 10, 11, 12, 18, 20 | 10 |
| Prior authorization | 4, 5, 6, 9, 10, 14, 15, 16, 17, 18, 19, 20 | 12 |
| CPT concepts | 1, 3, 4, 5, 6, 8, 11, 15, 20 | 9 |
| ICD-10 concepts | 1, 3, 4, 5, 8, 11, 15, 20 | 8 |
| Claim denials | 6, 8, 9, 11, 12 | 5 |
| Claim correction / reprocessing | 7, 8, 11 | 3 |
| Appeals (general concepts) | 8, 18 | 2 |
| Network vs. out-of-network | 7, 13, 14, 17, 19 | 5 |
| Member responsibility | 1, 2, 5, 7, 10, 12, 13, 14, 16, 17, 19 | 11 |
| Allowed amount | 1, 4, 10, 12, 13 | 5 |
| Balance billing | 7, 13, 14, 17, 19 | 5 |
| Provider/member/payer coordination | 2, 3, 6, 7, 9, 10, 14, 15, 16, 18, 20 | 11 |
| Specialty authorization | 15, 16, 18 | 3 |
| Pharmacy authorization | 2, 16 | 2 |
| Complex claim investigation | 17, 18, 19, 20 | 4 |
| Member communication | 3, 5, 15, 17, 19, 20 | 6 |
| Identifying inconsistencies / errors | 2, 6, 7, 8, 9, 10, 11, 12, 14, 17, 18, 19, 20 | 13 |
| Plain-English explanation | 1, 2, 4, 8, 12, 13, 16 | 7 |

Skill tags list each case's *primary* skills (3–8 per case). Practice is broader than the tags: every case grades a written investigation and a member reply, as the next table shows.

## Scoring-category exposure

| Category | Cases graded | Total rubric points across portfolio |
|---|---|---|
| Claims reasoning | 19 / 20 | 122 |
| EOB interpretation | 19 / 20 | 145 |
| CPT/ICD understanding | 20 / 20 | 92 |
| Prior authorization | 12 / 20 | 81 |
| Plan knowledge | 19 / 20 | 120 |
| Problem solving | 19 / 20 | 122 |
| Member communication | 20 / 20 | 200 |

## Prior-authorization situations

| Situation | Cases |
|---|---|
| Required and correctly obtained | 4, 9, 14, 15 (current regimen) |
| Required but never requested | 5, 20 (brace) |
| Approved/notified but not linked to the claim | 17 (emergency notification); SAMPLE-01 |
| Expired before the date of service | 10, 18 (home health window) |
| Covers a different date | 19 |
| Covers a different service | 6 (CT vs MRI), 15 (different drug) |
| Covers a different provider | 19 (different lab) |
| Diagnosis on the authorization doesn't match (laterality) | 20 |
| Request pending | 15 (oncology), 16 (pharmacy) |
| Request denied | 18 (DME, medical necessity) |
| Emergency situation (notification rules) | 17 |

## Task mix

| # | Choice | Select-all | Amount | Written investigation | Member reply | Points (structured / self-graded) |
|---|---|---|---|---|---|---|
| 1 | 5 | 0 | 2 | 1 | 1 | 24 / 17 |
| 2 | 3 | 1 | 3 | 1 | 1 | 23 / 20 |
| 3 | 5 | 1 | 1 | 1 | 1 | 25 / 20 |
| 4 | 4 | 1 | 2 | 1 | 1 | 24 / 19 |
| 5 | 6 | 0 | 2 | 1 | 1 | 26 / 20 |
| 6 | 4 | 1 | 1 | 1 | 1 | 24 / 23 |
| 7 | 3 | 1 | 3 | 1 | 1 | 23 / 20 |
| 8 | 6 | 0 | 1 | 1 | 1 | 24 / 19 |
| 9 | 4 | 1 | 2 | 1 | 1 | 26 / 20 |
| 10 | 3 | 1 | 3 | 1 | 1 | 24 / 21 |
| 11 | 4 | 1 | 2 | 1 | 1 | 24 / 20 |
| 12 | 4 | 0 | 2 | 1 | 1 | 21 / 19 |
| 13 | 2 | 1 | 4 | 1 | 1 | 23 / 20 |
| 14 | 4 | 1 | 2 | 1 | 1 | 23 / 20 |
| 15 | 4 | 2 | 1 | 1 | 1 | 23 / 20 |
| 16 | 4 | 1 | 1 | 1 | 1 | 20 / 20 |
| 17 | 3 | 2 | 3 | 1 | 1 | 27 / 21 |
| 18 | 4 | 1 | 3 | 1 | 1 | 25 / 20 |
| 19 | 2 | 1 | 5 | 1 | 1 | 25 / 21 |
| 20 | 4 | 1 | 3 | 1 | 1 | 27 / 21 |

## Case facts and assumptions

### 1. "Do I owe $285?": reading a paid EOB

**Ticket:** Hi! I got a letter from my health plan about my doctor visit in July. It says "Amount billed: $285.00" in big letters. Do I need to pay this? I don't see a due date anywhere. And what does "allowed" mean? Sorry, this is my first time using US insurance.

**Case facts (fictional):** Claim record · Explanation of Benefits

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.
- No provider statement has arrived yet.

### 2. "Copay due": a charge the EOB doesn't support

**Ticket:** Hello, my dermatologist sent me a bill for $40 that says "copay due". I thought this plan didn't have copays? Also, the pharmacy charged me $10 for the cream she prescribed. Is that right, or should that be free too? And the pharmacist said if I want the brand-name version instead, it "needs prior authorization". What does that mean? Thanks, Marcus

**Case facts (fictional):** Explanation of Benefits · Provider statement · Pharmacy receipt

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.
- The cream is a generic drug filled at a retail pharmacy as a 30-day supply.

### 3. A $480 bill for a claim that isn't finished

**Ticket:** Hi. I've done 3 physical therapy sessions for my shoulder and the clinic already sent me a bill for $480. My doctor referred me there. Does my plan not cover PT?? I have 6 more sessions booked and honestly I'm thinking of cancelling them.

**Case facts (fictional):** Claim record: evaluation (07/28) · Claim record: therapy visits (08/04–08/18) · Explanation of Benefits: evaluation (07/28) · Provider statement

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.

### 4. Approved CT, scary-looking EOB

**Ticket:** Hi, I had a CT scan in September after an ER doctor told me to follow up on stomach pain. My plan sent a statement that says $3,150?! My doctor's office said they got approval beforehand. Did something go wrong? The imaging place also sent a statement but it says $0.00. Is that a mistake?

**Case facts (fictional):** Authorization record · Claim record · Explanation of Benefits · Provider statement

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.

### 5. "Why am I paying for their mistake?": the missing pre-authorization

**Ticket:** I had knee surgery last month at Lakeshore and now I have a $420 bill. The EOB says something about "pre-authorization not obtained". My surgeon's office told me they would take care of everything with insurance! Why am I paying for their mistake? And does this at least count toward my out-of-pocket max?

**Case facts (fictional):** Authorization lookup · Claim record (facility) · Explanation of Benefits · Provider statement

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.
- The EOB shows the pre-authorization reduction as a 'not covered' amount. That presentation is simulated: the source states the rule, not the EOB format.

### 6. Approved for a CT, billed for an MRI

**Ticket:** My MRI got denied?? I specifically asked my doctor's office if my scan was approved and they said YES. Now Northgate Imaging says I owe $2,850. What happened?

**Case facts (fictional):** Authorization record · Imaging report (header) · Claim record · Explanation of Benefits · Provider statement

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.

### 7. "The directory said in-network!"

**Ticket:** Hi, I checked the Cigna directory before booking and Dr. Shah was listed as in-network. Now the EOB says "out-of-network" and the cardiology office wants $520. I did everything right. Why is this happening? — Sam

**Case facts (fictional):** Claim record · Explanation of Benefits · Network directory lookup (by you, 07/09) · Provider statement

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.

### 8. Back pain therapy denied for an ear infection

**Ticket:** My physical therapy claim got DENIED. Does my plan not cover PT for back pain?? The clinic wants $195 and I have 5 more visits scheduled.

**Case facts (fictional):** Referral · Claim record · Explanation of Benefits · Provider statement

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.

### 9. "DENIED as a duplicate?": the colonoscopy that was already paid

**Ticket:** Hi, I got an EOB that says my colonoscopy claim was DENIED as a "duplicate"?? And Bayside just sent me a bill for $2,400. I had approval for this procedure! Do I have to pay?

**Case facts (fictional):** Authorization record · Claim record: CLM-26-0314-4402 (original) · Claim record: CLM-26-0420-1189 (resubmission) · Explanation of Benefits: CLM-26-0314-4402 · Explanation of Benefits: CLM-26-0420-1189 · Provider statement

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.

### 10. Expired authorization, and a bill that's still too high

**Ticket:** Hello, Eastside Imaging is charging me $885 for my shoulder MRI. The EOB says something about an expired authorization?? I didn't even choose the date: the imaging center moved my appointment! This doesn't seem fair. — Nora

**Case facts (fictional):** Authorization record · Scheduling note (from Eastside) · Claim record · Explanation of Benefits · Provider statement

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.
- The EOB shows the pre-authorization reduction as a 'not covered' amount. That presentation is simulated.

### 11. Fixed claim, old bill

**Ticket:** Hi, Willow Allergy sent me a bill for $640 saying insurance denied my allergy testing. But I got another letter from the plan in March that looked different? I'm confused about which one is right.

**Case facts (fictional):** Claim record: CLM-26-0212-0731 (original) · Explanation of Benefits: CLM-26-0212-0731 · Claim record: CLM-26-0320-5518 (corrected / replacement) · Explanation of Benefits: CLM-26-0320-5518 · Provider statement

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.
- This is the member's first allergy testing under the plan.

### 12. Visit 21: when a benefit runs out

**Ticket:** Harmony Acupuncture says I owe $265. My EOB shows two of my visits as "not covered"?? I thought acupuncture was covered on this plan. I've been going weekly for my neck since January.

**Case facts (fictional):** Benefit usage summary · Claim record · Explanation of Benefits · Provider statement

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.
- The member had no acupuncture visits under the plan before 2026. All visits shown are in the member's first year of coverage.

### 13. $330 on the EOB, $580 on the bill

**Ticket:** My dermatologist's bill is $580 but my EOB says I'm only responsible for $330. Which one do I pay?? Is the doctor even allowed to charge me more than the EOB says? I know she's out of network, but still.

**Case facts (fictional):** Accumulator summary (before this claim) · Claim record · Explanation of Benefits · Provider statement

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.
- No other out-of-network claims are in process for this member.

### 14. The anesthesia bill nobody warned me about

**Ticket:** I did everything right for my hernia surgery: in-network surgery center, in-network surgeon, pre-approval. Now I have an $1,800 bill from an anesthesia group I've never heard of, and the EOB says out-of-network. I never chose an anesthesiologist! Do I really owe this? — Ben

**Case facts (fictional):** Authorization record · Claim: Valley Surgical Center (facility) · Claim: Dr. Ruiz (surgeon) · Claim: Summit Anesthesia Partners · EOB: facility · EOB: surgeon · EOB: anesthesia · Provider statement: Summit Anesthesia Partners

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.
- The surgery was scheduled (non-emergency). The member did not choose or sign anything about the anesthesia group in advance.

### 15. New cancer treatment, approval "pending"

**Ticket:** (Call notes) Member is upset. Her oncologist switched her to a new treatment and the office says insurance approval is "pending". Her next infusion is Friday (08/22). She asks: "Will I be covered? I can't afford to pay for cancer drugs myself. Should I postpone?"

**Case facts (fictional):** Authorization: AUTH-2026-041207 (current regimen) · Authorization: request REQ-2026-088153 (new regimen) · Claim record: cycle 3 (07/25) · Explanation of Benefits: cycle 3 · Lakeview financial counselor note

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.
- The official sources don't describe an expedited or urgent review process. Any such option must be confirmed with the claims administrator.

### 16. "The pharmacy wants $6,912"

**Ticket:** The specialty pharmacy just told me my new arthritis medication needs "prior authorization" and if I want it today it's $6,912!!! My rheumatologist says they faxed something already. I only have a few days of my old medication left. What do I do?

**Case facts (fictional):** Pharmacy claim response · Rheumatology office note

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- Pharmacy messages and amounts are simulated. The drug is a self-injected specialty medication dispensed by a specialty pharmacy.
- The official sources list specialty drug copays but don't describe a pharmacy prior-authorization process, timelines or criteria.

### 17. Emergency appendectomy out of town

**Ticket:** I had emergency surgery for appendicitis while visiting my sister in Denver last month. Now the hospital wants $16,100 and the EOB says I owe $2,500 and something about "no notification". My wife DID call the plan on Monday morning! I'm freaking out. What do I actually owe?

**Case facts (fictional):** Member contact log · Authorization lookup (as linked to the claim) · Claim record (hospital) · Accumulator summary (before this claim) · Explanation of Benefits · Provider statement

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.
- 06/13/2026 was a Saturday. The member arrived at the ER at 22:40 and was admitted the same night.
- The EOB shows the reduction as a 'not covered' amount and applies the out-of-pocket cap to deductible + coinsurance. That presentation is simulated.

### 18. After the stroke: home nursing and a hospital bed

**Ticket:** (Call notes) Caller is the member's wife, listed as authorized. Raymond came home after a stroke. BrightPath Home Health sent a bill for $1,100 saying insurance denied his last four nurse visits, and the medical supply company wants $480 for his hospital bed. She says: "The agency told us all the visits were approved. And he needs that bed! Can we fight this?"

**Case facts (fictional):** Authorization: home health · BrightPath office note · Authorization: hospital bed · Claim: BrightPath Home Health · EOB: home health · Statement: BrightPath Home Health · Claim: MedEquip Supply · EOB: hospital bed · Statement: MedEquip Supply

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.
- The EOB applies the 10% reduction only to visits 9–12. That allocation and presentation are simulated.

### 19. "But it was approved!": the genetic test sent to another lab

**Ticket:** My genetic test was APPROVED. My doctor told me so in May. Now I have a $3,700 bill from a lab I've never heard of and an EOB saying I owe $1,500 and something about no matching authorization. I followed every rule. What is going on? — Rachel

**Case facts (fictional):** Authorization record · Clinic note (Dr. Kim's office) · Claim record · Explanation of Benefits · Provider statement

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.
- The EOB applies the deductible and coinsurance before the 10% reduction, and shows the reduction as 'not covered'. The source doesn't describe the order or format.

### 20. Capstone: the knee surgery with four bills

**Ticket:** I'm honestly at my wits' end. I had ACL surgery last month: approved, in-network, everything. Since then I've gotten: a $6,400 bill from my surgeon saying insurance denied it, a $68 bill for my knee brace, and the PT place has charged me $40 at every visit. I thought this plan had no copays and my surgery was approved. Can someone please explain what I actually owe? — Chris

**Case facts (fictional):** Authorization record: surgery · Operative note (header) · Claim: Riverside Surgery Center · Claim: Petrov Orthopedics (surgeon) · Claim: Peak Bracing · Claim: Motion PT · EOB: facility · EOB: surgeon · EOB: knee brace · EOB: physical therapy · Statement: Petrov Orthopedics · Statement: Peak Bracing · Motion PT front-desk receipts

**Assumptions:**
- All people, providers, IDs, dates and amounts are fictional. Each provider's network status is a simulated case fact.
- EOB layouts, remark codes and claim-system wording are invented for the simulation. Real administrator documents look different.
- The EOB shows the brace reduction as a 'not covered' amount. That presentation is simulated.

## A1: Medical-necessity denial: the member wants to appeal (BLOCKED_PENDING_SPD)

A pre-authorization for a specialty service is denied as not medically necessary. The treating physician believes the reviewer lacked key documentation. The member asks how to appeal, how long it takes, and whether they can get the service in the meantime.

**Blocked by:**
- Remote Health USA Summary Plan Description (SPD): claims and appeals procedures section
- Any administrator (Bywater) appeal instructions referenced by the SPD

**Questions the SPD must answer (do not answer from general practice):**
- Who may file (member, authorized representative, provider) and how (form, address, portal)?
- Filing deadlines after a denial, and decision timeframes (standard vs. urgent/expedited)
- How many internal appeal levels exist, and whether external review is available
- What documentation is required or recommended
- Whether pre-service (authorization) and post-service (claim) appeals differ
- How the plan communicates appeal decisions

## Recording each case

Each completed attempt is stored as a portfolio record: case number, date completed, score, investigation notes, answers, criterion-level feedback, hints used, reflection, and an optional recording URL. Export one case as Markdown from its review page, or all attempts as JSON from Case History. Record the browser separately and paste the link into the review page.

/**
 * Patient FAQ content for the four service pages.
 *
 * These are written as answer-engine content: the questions are phrased the
 * way a patient would type them into a search box or ask a chatbot, and each
 * answer is self-contained, so it still makes sense when a model quotes it
 * without the surrounding page. Keep answers to roughly 40–90 words —
 * long enough to actually answer, short enough to be extracted whole.
 *
 * Each entry is { q, a } plus an optional `review` string.
 *
 *   review: '<what a physician or the office needs to confirm>'
 *
 * `review` marks an answer containing a claim NOT supported by anything
 * already published on these pages — a practice-specific fact I could not
 * verify, or clinical guidance that should carry a physician's sign-off.
 * The drafted text is a reasonable default, not a confirmed one. Run
 * `grep -n "review:" src/content/faqs.js` for the full list.
 *
 * NOTHING HERE HAS BEEN CLINICALLY REVIEWED. Every answer should be read by
 * a physician before this goes in front of patients — the `review` flags are
 * the minimum, not the whole job.
 */

export const OB_FAQS = [
  {
    q: 'When should I schedule my first prenatal visit?',
    a: 'Call us as soon as you have a positive pregnancy test. Most first obstetric visits happen between 8 and 10 weeks, but booking early means we can confirm your dating, review any medications you take, and see you sooner if your history calls for it. You do not need to wait until you have symptoms or a referral.',
  },
  {
    q: 'Where do Beaches OBGYN physicians deliver babies?',
    a: 'All of our deliveries take place at Baptist Medical Center Beaches in Jacksonville Beach, Florida. Labor and delivery there is in renovated private suites with home-like comforts, including a rocking chair and a sleeper sofa for your partner, and the unit is equipped for everything from labor through postpartum recovery.',
  },
  {
    q: 'Will my own doctor deliver my baby?',
    a: 'Your baby will be delivered by whichever of our obstetricians is on call when you go into labor. Six of our physicians practice obstetrics, and you will meet each of them during your prenatal visits — so the face beside you on delivery day is already someone you know, rather than a stranger from a rotating hospital pool.',
  },
  {
    q: 'How often will I have prenatal appointments?',
    a: 'A typical low-risk pregnancy follows roughly monthly visits through about 28 weeks, every two weeks from 28 to 36 weeks, then weekly until delivery. If you develop a condition such as gestational diabetes or high blood pressure, or you are carrying more than one baby, we will see you more often. Your schedule is set with your physician, not by a fixed template.',
    review: 'Confirm this matches the practice’s actual visit cadence.',
  },
  {
    q: 'What ultrasounds and tests will I have during pregnancy?',
    a: 'Most patients have an early ultrasound to confirm dating and a detailed anatomy scan around 18 to 22 weeks. Routine bloodwork happens at your first visit, genetic screening is offered in the first and second trimesters, glucose screening for gestational diabetes falls around 24 to 28 weeks, and a Group B strep swab is done near 36 weeks. Your physician will explain each one before it is ordered.',
    review: 'Confirm the standard testing schedule and which genetic screens are offered in-house.',
  },
  {
    q: 'Do you offer VBAC, or vaginal birth after cesarean?',
    a: 'Whether a trial of labor after a prior cesarean is a safe option depends on the type of incision made on your uterus, how many cesareans you have had, and how this pregnancy is progressing. It is a decision to make with your physician early in your care rather than in labor. Bring your prior operative records to your first visit so we can review them.',
    review: 'CONFIRM BEFORE PUBLISHING — does the practice offer TOLAC/VBAC at Baptist Beaches?',
  },
  {
    q: 'Which medications are safe to take while pregnant?',
    a: 'Many everyday medications are safe in pregnancy and some are not, and the answer often changes by trimester. Do not stop a prescribed medication on your own — call us first, because untreated conditions carry their own risks. Our Prenatal Guide app includes a searchable, trimester-aware medication guide, and you can always reach the office before starting anything new, including over-the-counter products and supplements.',
  },
  {
    q: 'When should I call the office or go to the hospital?',
    a: 'Call us any hour for regular contractions about five minutes apart for an hour, your water breaking, vaginal bleeding, or a noticeable drop in your baby’s movement. A severe headache, vision changes, or pain under your ribs can signal preeclampsia and should be reported right away. When you are unsure, call — we would far rather hear from you early.',
  },
  {
    q: 'Do you care for high-risk pregnancies?',
    a: 'Our obstetricians manage many pregnancies that carry added risk, including gestational diabetes, high blood pressure, thyroid disease, and pregnancy after 35. When a pregnancy needs subspecialty input, we co-manage with maternal-fetal medicine while remaining your primary obstetric team, so you are not handed off entirely to strangers.',
    review: 'Confirm which high-risk conditions are managed in-house and the MFM referral relationship.',
  },
  {
    q: 'What is the Beaches OBGYN Prenatal Guide app?',
    a: 'It is a week-by-week pregnancy companion built by the physicians who will deliver your baby, and it is free for our patients. It tracks gestational age and your due-date countdown, maps every visit, lab, and ultrasound by week, explains each prenatal test in plain language, includes a contraction timer and kick counter, and lets you reach the practice in one tap. Ask for your invite at your first prenatal visit.',
  },
  {
    q: 'When is my postpartum visit, and what happens at it?',
    a: 'Postpartum care is no longer a single appointment at six weeks. Expect earlier contact in the first few weeks — sooner if you had a cesarean, high blood pressure, or a difficult delivery — and a comprehensive visit by about twelve weeks covering mood, bleeding, healing, contraception, and how feeding is going. If something feels wrong before then, call rather than waiting for the visit.',
    review: 'Confirm the practice’s postpartum schedule; many practices still run a single 6-week visit.',
  },
  {
    q: 'Do you accept my insurance?',
    a: 'We participate with most major commercial plans in the Jacksonville area. Because obstetric care is billed as a global package covering your prenatal visits, delivery, and postpartum care, it is worth confirming coverage and your out-of-pocket estimate early in the pregnancy. Call the office with your plan details and we will verify your benefits before your first visit.',
    review: 'CONFIRM BEFORE PUBLISHING — list of accepted plans, and whether OB is billed globally.',
  },
]

export const GYN_FAQS = [
  {
    q: 'How often do I need a well-woman exam and a Pap smear?',
    a: 'A well-woman visit is recommended every year, and it covers far more than a Pap smear — blood pressure, contraception, mood, periods, and screening that is due. Pap smears themselves are usually every three years from age 21, or every five years from 30 when the Pap is combined with HPV testing. If you have had an abnormal result, your physician may want you back sooner.',
  },
  {
    q: 'At what age should a girl first see a gynecologist?',
    a: 'The first gynecologic visit is generally recommended between ages 13 and 15, and it usually involves no exam at all — it is a conversation about periods, development, and health, with questions answered honestly at a pace that respects where she is. A pelvic exam and Pap smear are not typically needed until 21 unless there is a specific concern.',
  },
  {
    q: 'Do I still need Pap smears after menopause or a hysterectomy?',
    a: 'Often yes, and it depends on your history. Screening generally continues to age 65 if your prior results have been normal. If your hysterectomy removed the cervix and was done for a non-cancerous reason, routine Pap smears usually stop — but if the cervix remains, or the surgery was for cervical changes, screening continues. You still need a well-woman visit either way.',
  },
  {
    q: 'What birth control options do you offer?',
    a: 'We fit contraception to your body, your health history, and your life rather than defaulting to one method. Options range from combined and progestin-only pills to the patch, ring, injection, implant, and hormonal or copper IUDs, through to permanent options such as tubal ligation. What suits someone planning pregnancy in a year is rarely what suits someone who is finished having children.',
    review: 'Confirm which methods are placed in-office (IUD, implant) versus referred.',
  },
  {
    q: 'What causes heavy or irregular periods, and when should I be seen?',
    a: 'Common causes include fibroids, polyps, hormonal shifts in perimenopause, thyroid problems, and the changes that follow starting or stopping contraception. Make an appointment if you soak through a pad or tampon hourly, pass clots larger than a quarter, bleed longer than seven days, bleed between periods, or bleed at all after menopause. Bleeding after menopause always warrants evaluation.',
  },
  {
    q: 'What are the signs of uterine fibroids?',
    a: 'Many fibroids cause no symptoms at all and are found incidentally. When they do cause trouble it is usually heavy or prolonged periods, pelvic pressure or fullness, frequent urination, pain during sex, or a noticeably firmer lower abdomen. Fibroids are common and benign, and treatment ranges from watchful monitoring to minimally invasive surgery — it depends on your symptoms, not on their size alone.',
  },
  {
    q: 'When should I see a doctor about trouble getting pregnant?',
    a: 'If you are under 35, come in after twelve months of regular unprotected intercourse without conception. If you are 35 or older, come in at six months, and sooner still at 40. Do not wait the full year if your periods are irregular or absent, you have known endometriosis or fibroids, or you have had pelvic surgery or more than one miscarriage.',
  },
  {
    q: 'What happens at a first infertility evaluation?',
    a: 'It starts with a conversation about your cycles, history, and how long you have been trying, followed by bloodwork to check ovulation and thyroid function, and imaging to look at your uterus and ovaries. Semen analysis for a male partner is part of the initial workup, because roughly a third of cases involve male factors. You leave with a clear picture and a defined next step, including referral to a fertility specialist when that is the right move.',
    review: 'Confirm which parts of the infertility workup are done in-house.',
  },
  {
    q: 'I found a lump in my breast — what should I do?',
    a: 'Make an appointment rather than waiting to see whether it goes away. Most breast lumps turn out to be benign, but the only way to know is evaluation, and that is quicker and less stressful than months of worry. We examine the area, arrange imaging promptly when it is warranted, and follow through on results so nothing is left unanswered.',
  },
  {
    q: 'Do you treat painful sex or low libido?',
    a: 'Yes, and they are ordinary clinical concerns rather than something to be embarrassed about. Discomfort, dryness, and changes in desire have identifiable causes — hormonal shifts, pelvic floor tension, skin conditions, medication side effects, and thyroid problems among them. Most are treatable once identified. These conversations are confidential and unhurried, and they are worth having.',
  },
  {
    q: 'Can I get STI testing without a full exam?',
    a: 'Yes. Much testing is done with a urine sample or a simple swab, and blood tests cover the rest, so a full pelvic exam is not always needed. Testing is confidential. If you have symptoms such as unusual discharge, pelvic pain, or sores, mention it when you book so we can allow time to examine and treat you at the same visit.',
    review: 'Confirm same-day/walk-in STI testing availability and whether results are portal-delivered.',
  },
  {
    q: 'Do you offer medical weight loss or GLP-1 medications?',
    a: 'Weight, metabolism, and hormonal health are closely linked, and our practice supports patients working on weight through a dedicated Wellness app that calculates daily calorie and macro targets from your own metabolism, builds weekly meal plans and guided recipes, tracks progress, and provides clinical guidance on GLP-1 medications including expected outcomes and side effects. Ask at your visit whether the program is a fit for you.',
    review: 'CONFIRM BEFORE PUBLISHING — does the practice prescribe GLP-1 medications, or only provide the app and guidance?',
  },
]

export const HRT_FAQS = [
  {
    q: 'What is perimenopause, and when does it start?',
    a: 'Perimenopause is the stretch of years before your final period, when hormone levels fluctuate rather than simply decline. It commonly begins in the forties but can start in the mid-thirties. Cycles grow unpredictable and sleep, mood, and energy often shift first — which is why many women are told they are too young for this conversation. They are not.',
  },
  {
    q: 'How do I know if I have reached menopause?',
    a: 'Menopause is confirmed once you have gone twelve consecutive months without a period, and it is diagnosed looking backward rather than by a single test. The average age is around 51. Hormone blood tests are unreliable during perimenopause because levels swing day to day, so we generally diagnose from your history and symptoms rather than from a lab result.',
  },
  {
    q: 'Is hormone replacement therapy safe?',
    a: 'For most healthy women who begin treatment under 60, or within ten years of their final period, the benefits of hormone therapy for bothersome symptoms generally outweigh the risks. Safety is not one answer for everyone: it depends on the type of hormone, the dose, whether it is taken by mouth or through the skin, and your personal and family history — particularly of breast cancer, blood clots, stroke, or liver disease. That assessment is the point of the visit.',
    review: 'Clinical claim — should carry physician sign-off before publishing.',
  },
  {
    q: 'Who should not take hormone therapy?',
    a: 'Hormone therapy is generally not recommended if you have had breast cancer or certain other hormone-sensitive cancers, unexplained vaginal bleeding, a history of blood clots or stroke, or active liver disease. Some of these are absolute, others depend on the details and on the route of treatment. If systemic therapy is not appropriate for you, there are still options worth discussing, including non-hormonal treatments and local vaginal therapy.',
    review: 'Clinical claim — should carry physician sign-off before publishing.',
  },
  {
    q: 'What symptoms does hormone therapy actually help?',
    a: 'It is most effective for hot flashes and night sweats, and it reliably helps the vaginal dryness and discomfort that follow hormonal change. Many women also see sleep improve, largely because night sweats stop interrupting it. It is not a treatment for low mood on its own, and it is not a weight-loss or anti-ageing therapy — being clear about what it does and does not do is part of deciding whether to start.',
  },
  {
    q: 'Do I need blood work before starting hormone therapy?',
    a: 'Usually not for diagnosis. Because hormone levels fluctuate widely in perimenopause, a single blood test rarely changes the decision, and treatment is guided by your symptoms rather than by chasing a number. We may check thyroid function or other labs when your history warrants it, and we will always review your full medical and family history before prescribing.',
    review: 'Confirm the practice’s testing approach — some practices do baseline panels or level monitoring.',
  },
  {
    q: 'Do you offer bioidentical hormones or pellet therapy?',
    a: 'Bioidentical simply means the hormone is chemically identical to what your body makes, and several FDA-approved options meet that description — these are well studied and consistently dosed. Custom-compounded preparations and pellets are a different matter: they are not FDA-regulated, dosing can vary between batches, and major medical societies do not recommend them over approved alternatives for most patients.',
    review: 'CONFIRM BEFORE PUBLISHING — which specific formulations and routes does the practice prescribe?',
  },
  {
    q: 'How long can I stay on hormone therapy?',
    a: 'There is no arbitrary stopping date. Current guidance favors reviewing periodically rather than enforcing a fixed limit, using the approach that controls your symptoms and reassessing as your health and risk profile change over time. Some women taper after a few years, others continue longer with ongoing review. What matters is that it stays a deliberate decision instead of a prescription nobody revisits.',
    review: 'Clinical claim — should carry physician sign-off before publishing.',
  },
  {
    q: 'Will hormone therapy help with vaginal dryness and painful sex?',
    a: 'Yes, and for these symptoms specifically, low-dose vaginal estrogen applied locally is often the better choice. Very little is absorbed into the bloodstream, so it can frequently be used by women who cannot or prefer not to take systemic hormones. Unlike hot flashes, vaginal dryness tends to worsen over time without treatment rather than settling on its own, so it is worth raising early.',
    review: 'Clinical claim — should carry physician sign-off before publishing.',
  },
  {
    q: 'What are the non-hormonal options for menopause symptoms?',
    a: 'Several non-hormonal prescription medications reduce hot flashes, including certain antidepressants and newer drugs developed specifically for this purpose. Vaginal moisturizers and lubricants help with dryness, and cognitive behavioral therapy has good evidence for both hot flashes and sleep. These are genuine options rather than consolation prizes, and they matter for women who cannot take hormones.',
    review: 'Clinical claim — should carry physician sign-off before publishing.',
  },
  {
    q: 'Does hormone therapy cause weight gain?',
    a: 'The weight change many women notice around menopause is driven mainly by ageing, muscle loss, and shifting fat distribution rather than by hormone therapy itself. Evidence does not show that hormone therapy causes weight gain, and some women find that better sleep and fewer symptoms make it easier to stay active. It is not, however, a weight-loss treatment.',
    review: 'Clinical claim — should carry physician sign-off before publishing.',
  },
  {
    q: 'What does menopause mean for my bones and heart?',
    a: 'The drop in estrogen accelerates bone loss, and cardiovascular risk rises after menopause, which is why we treat bone health and heart risk as part of the same conversation rather than separate errands. Depending on your age and risk factors that can mean a bone density scan, cholesterol and blood pressure review, and specific advice on weight-bearing exercise, vitamin D, and calcium.',
  },
]

export const MIS_FAQS = [
  {
    q: 'What is minimally invasive gynecologic surgery?',
    a: 'It is surgery performed through incisions measured in millimeters, or through no incision at all, instead of one long open incision. A slender camera provides high-definition visualization while the surgeon works with fine instruments. In practice that usually means less pain, less blood loss, lower infection risk, a shorter hospital stay, and a faster return to normal life than open surgery.',
  },
  {
    q: 'Am I a candidate for minimally invasive surgery?',
    a: 'Most patients needing gynecologic surgery are, and our physicians reach first for the least invasive option that will actually solve the problem. Candidacy depends on your diagnosis, your anatomy, prior abdominal surgeries and scar tissue, and your overall health. Occasionally a procedure that begins laparoscopically needs to be converted to open surgery for safety, and your surgeon will discuss that possibility beforehand.',
  },
  {
    q: 'What is the difference between laparoscopic and robotic da Vinci surgery?',
    a: 'Both work through the same tiny incisions. In standard laparoscopy the surgeon holds long rigid instruments directly. With the da Vinci system the surgeon operates the same kind of instruments from a console, gaining wristed instruments that bend beyond the range of a human hand, tremor filtering, and immersive 3D-HD vision. Which one is used depends on the complexity of your particular case.',
  },
  {
    q: 'Does the robot perform the surgery by itself?',
    a: 'No. The da Vinci system never operates on its own and has no autonomy whatsoever. Your surgeon is in complete control of every movement at every moment — the system simply translates the motion of their hands into precise, tremor-free micro-movements of the instruments inside you. It is a set of tools, not a decision-maker.',
  },
  {
    q: 'How long is recovery after a laparoscopic hysterectomy?',
    a: 'Most patients go home the same day or after one night, and return to desk work and light activity within about two weeks. Heavy lifting, strenuous exercise, and intercourse are usually held for around six weeks so internal healing can finish. Recovery from open surgery typically takes considerably longer. Your own timeline depends on your procedure and your job.',
    review: 'General ranges — confirm they match what the practice tells patients.',
  },
  {
    q: 'Will I still have periods after endometrial ablation?',
    a: 'Most patients see bleeding reduce substantially, and many stop having periods altogether, though some continue to have light periods. Ablation treats heavy bleeding rather than eliminating it in every case. It is not usually recommended if you may want to become pregnant in the future, and it does not treat all causes of heavy bleeding — which is why the cause is investigated first.',
  },
  {
    q: 'Can I get pregnant after an endometrial ablation?',
    a: 'Pregnancy after ablation is uncommon but it does happen, and it carries serious risks for both mother and baby. Ablation is not a form of contraception, and you still need reliable birth control afterwards until you reach menopause. This is one of the most important things to understand before choosing the procedure, and your surgeon will discuss permanent contraception options with you.',
  },
  {
    q: 'What is the difference between a total and a supracervical hysterectomy?',
    a: 'A total laparoscopic hysterectomy removes the uterus and the cervix. A supracervical hysterectomy removes the uterus but leaves the cervix in place, which suits some patients and not others. If your cervix is left in place you will still need cervical cancer screening afterwards. Neither procedure removes the ovaries unless that is planned separately.',
  },
  {
    q: 'Will I go through menopause after a hysterectomy?',
    a: 'Only if your ovaries are removed as well. A hysterectomy alone stops your periods but leaves your ovaries producing hormones, so you go through menopause at roughly your natural age. If both ovaries are removed you enter surgical menopause immediately, and symptoms can begin within days — so that decision, and whether hormone therapy follows, is planned in advance rather than discovered afterwards.',
  },
  {
    q: 'Is a tubal ligation reversible?',
    a: 'Treat it as permanent. Reversal surgery exists but it is not always successful, is rarely covered by insurance, and depends heavily on how the original procedure was done. If there is any real chance you might want to become pregnant later, a long-acting reversible method such as an IUD or implant gives comparable effectiveness without closing the door.',
  },
  {
    q: 'How long will I be in the hospital?',
    a: 'Many of our minimally invasive procedures are outpatient, meaning you go home the same day. Endometrial ablation and hysteroscopy are typically same-day. A laparoscopic or robotic hysterectomy is often same-day as well, though some patients stay one night. Your surgeon will tell you what to expect for your specific procedure when it is scheduled.',
    review: 'Confirm typical length of stay at Baptist Beaches for each procedure.',
  },
  {
    q: 'When can I drive, return to work, and exercise again?',
    a: 'Driving generally resumes once you are off prescription pain medication and can brace and turn without hesitation, often within a week for smaller procedures. Desk work commonly restarts at one to two weeks, physical work later. Walking is encouraged early, while heavy lifting and vigorous exercise usually wait about six weeks after a hysterectomy. Follow the instructions you are given at discharge over any general timeline.',
    review: 'General ranges — confirm they match the practice’s discharge instructions.',
  },
]

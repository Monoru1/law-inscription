# THE LAW: REBIRTH — Préinscription

Site : https://law-inscription.netlify.app

Formulaire Netlify Forms : `the-law-rebirth` (pseudo, email, consent).

Mail de confirmation personnalisé : fonction `netlify/functions/submission-created.js`, nécessite `RESEND_API_KEY` et `LAW_FROM_EMAIL` dans les variables du projet Netlify **law-inscription**, domaine expéditeur vérifié dans Resend.

Après activation de Netlify Forms, redéployer pour détecter le formulaire dans le HTML.

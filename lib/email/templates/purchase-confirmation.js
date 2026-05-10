export function purchaseConfirmationTemplate({ courseTitle, amount, reference }) {
  return {
    subject: `Confirmation d’achat — ${courseTitle}`,
    text: [
      'Votre paiement mock Agri-Tech Academy est confirmé.',
      `Formation : ${courseTitle}`,
      `Montant : ${amount}`,
      `Référence : ${reference}`,
      'Accès : activé dans Mes formations.'
    ].join('\n')
  };
}

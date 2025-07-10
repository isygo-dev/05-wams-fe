import {
  GrammarError,
  GrammarErrorSeverity,
  GrammarErrorType,
  LanguageToolMatch,
  LanguageToolResponse
} from "../../types/ai";


export async function checkGrammarText(
  text: string,
  options: { language?: string } = {}
): Promise<GrammarError[]> {
  const cleanText = text.trim();
  if (!cleanText || cleanText.length < 2) {
    return [];
  }

  console.log("📤 Requête LanguageTool envoyée avec texte :", cleanText);

  try {
    const formData = new URLSearchParams({
      text: cleanText,
      language: options.language || "fr-FR",
      enabledOnly: "false",
      level: "picky",
      disabledRules: "WHITESPACE_RULE"
    });

    const response = await fetch("http://localhost:8081/v2/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
      body: formData
    });

    console.log("🌐 Requête envoyée, statut :", response.status);

    if (!response.ok) {
      throw new Error(`Erreur HTTP LanguageTool: ${response.status} - ${response.statusText}`);
    }

    const data = (await response.json()) as LanguageToolResponse;

    console.log("📩 Réponse reçue de LanguageTool :", data);

    if (!data.matches || !Array.isArray(data.matches)) {
      console.warn("⚠️ Format inattendu :", data);
      return [];
    }

    const erreurs = data.matches
      .filter(match => match && typeof match.offset === 'number' && typeof match.length === 'number')
      .map(match => ({
        offset: match.offset,
        length: match.length,
        message: match.message || match.shortMessage || "Erreur détectée",
        type: categorizeError(match),
        suggestions: (match.replacements?.map(r => r.value).filter(Boolean) || []).slice(0, 5),
        severity: determineSeverity(match),
        context: match.context?.text,
        ruleId: match.rule?.id,
        ruleDescription: match.rule?.description
      }));

    console.log("✅ Erreurs filtrées et formatées :", erreurs);

    return erreurs;

  } catch (error) {
    console.error("❌ Erreur lors de la vérification grammaticale :", error);

    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn("🚫 Impossible de contacter LanguageTool - vérification désactivée temporairement");
    }

    return [];
  }
}


function categorizeError(match: LanguageToolMatch): GrammarErrorType {
  const categoryId = match.rule?.category?.id?.toUpperCase() || "";
  const ruleId = match.rule?.id?.toUpperCase() || "";
  const issueType = match.rule?.issueType?.toLowerCase() || "";

  if (
    categoryId.includes("TYPOS") ||
    categoryId.includes("SPELLING") ||
    ruleId.includes("MORFOLOGIK") ||
    ruleId.includes("HUNSPELL") ||
    issueType === "misspelling"
  ) {
    return "spelling";
  }

  // Détection d'erreurs de conjugaison
  if (
    categoryId.includes("VERB") ||
    categoryId.includes("CONJUGATION") ||
    categoryId.includes("CONJUGAISON") ||
    ruleId.includes("ACCORD") ||
    ruleId.includes("CONJUGAISON") ||
    issueType === "grammar"
  ) {
    return "conjugation";
  }

  return "grammar";
}

function determineSeverity(match: LanguageToolMatch): GrammarErrorSeverity {
  const categoryId = match.rule?.category?.id?.toUpperCase() || "";
  const issueType = match.rule?.issueType?.toLowerCase() || "";
  const ruleId = match.rule?.id?.toUpperCase() || "";

  if (
    categoryId.includes("TYPOS") ||
    issueType === "misspelling" ||
    ruleId.includes("MORFOLOGIK")
  ) {
    return "error";
  }

  if (
    categoryId.includes("STYLE") ||
    categoryId.includes("REDUNDANCY") ||
    issueType === "style"
  ) {
    return "suggestion";
  }

  return "warning";
}

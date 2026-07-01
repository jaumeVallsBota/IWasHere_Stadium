export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatVisitType(type: "matchday" | "tour"): string {
  return type === "matchday" ? "Partido" : "Tour";
}

export function formatImpression(
  impression: string | null | undefined,
): string {
  return impression ?? "—";
}

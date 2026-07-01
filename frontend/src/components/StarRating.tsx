"use client";

interface StarRatingProps {
  value: number | null | undefined;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md";
}

export function StarRating({ value, onChange, readOnly = false, size = "md" }: StarRatingProps) {
  const starSize = size === "sm" ? "text-base" : "text-xl";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && onChange?.(star)}
          disabled={readOnly}
          className={`${starSize} leading-none transition-colors ${
            readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
          } ${(value ?? 0) >= star ? "text-amber-400" : "text-gray-300"}`}
          aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

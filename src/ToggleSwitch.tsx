interface Props {
  on: boolean;
}

export function ToggleSwitch({ on }: Props) {
  return (
    <span
      className={[
        "relative inline-flex h-7 w-13 shrink-0 rounded-full transition-all duration-300",
        on ? "bg-amber-400" : "bg-zinc-300 dark:bg-zinc-600",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-300 my-1",
          on ? "translate-x-7" : "translate-x-1",
        ].join(" ")}
      />
    </span>
  );
}

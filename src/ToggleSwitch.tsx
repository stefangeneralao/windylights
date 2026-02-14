interface Props {
  on: boolean;
}

export function ToggleSwitch({ on }: Props) {
  return (
    <span
      className={[
        "relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors duration-200",
        on ? "bg-yellow-500" : "bg-zinc-400 dark:bg-zinc-500",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 my-1",
          on ? "translate-x-6" : "translate-x-1",
        ].join(" ")}
      />
    </span>
  );
}

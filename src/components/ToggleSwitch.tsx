interface Props {
  on: boolean;
  onClick?: () => void;
}

export function ToggleSwitch({ on, onClick }: Props) {
  return (
    <span
      onClick={onClick}
      className={[
        "relative inline-flex h-7 w-[52px] shrink-0 rounded-full transition-all duration-300",
        on ? "bg-amber-400" : "bg-zinc-300",
      ].join(" ")}
      style={
        on
          ? { boxShadow: "inset 0 1px 2px rgba(180,83,9,0.4), 0 0 16px rgba(253,224,71,0.5)" }
          : { boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15)" }
      }
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

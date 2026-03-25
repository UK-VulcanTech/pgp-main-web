const Button = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  const base =
    "px-8 py-3 font-semibold uppercase tracking-wide transition duration-300";

  const variants = {
    primary: "bg-yellow text-primary",
    outline: "border border-white text-white hover:bg-white hover:text-black",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
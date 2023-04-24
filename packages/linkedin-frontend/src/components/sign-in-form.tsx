import { useForm, SubmitHandler } from "react-hook-form";

import "./sign-in-form.css";

type Inputs = {
  name: string;
  email: string;
};

export function SignInForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  return (
    <form className="sign-in-form" onSubmit={handleSubmit(onSubmit)}>
      <label className="input-label" htmlFor="name">
        Name
      </label>
      <input
        className="text-input"
        placeholder="Name"
        {...register("name", { required: true })}
      />
      {errors.name && (
        <span className="alert-form">This field is required</span>
      )}

      <label className="input-label" htmlFor="email">
        Email
      </label>
      <input
        className="text-input"
        placeholder="Email"
        {...register("email", { required: true })}
      />
      {errors.email && (
        <span className="alert-form">This field is required</span>
      )}

      <a href="forgot_password">Forgot password?</a>
      <button className="button-primary button-medium" type="submit">
        Sign in
      </button>
    </form>
  );
}

import "./home-unauthenticated.css";
import { NavList } from "./nav-list";
import { SignInForm } from "./sign-in-form";

export function HomeUnauthenticated() {
  return (
    <div className="grid-container">
      <nav>
        <div className="wrap">
          <div id="logo-container">
            <a href="#" className="logo-link">
              <h1>LinkedIn... ish</h1>
            </a>
          </div>
          <NavList />

          <a href="#" className="button-like">
            Join now
          </a>
          <a href="#" className="button-like button-like-outline">
            Sign in
          </a>
        </div>
      </nav>
      <section>
        <SignInForm />
      </section>
      <section>Three</section>
      <section>Four</section>
      <section>Five</section>
      <section>Six</section>
      <section>Seven</section>
      <section>Eight</section>
      <section>Nine</section>
      <section>Ten</section>
    </div>
  );
}

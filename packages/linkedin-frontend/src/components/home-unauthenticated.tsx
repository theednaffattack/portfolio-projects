import { FooterBrowseLinkedIn } from "./footer-browse-linkedin";
import { FooterBusinessSolutions } from "./footer-business-solutions";
import { FooterDirectories } from "./footer-directories";
import { FooterGeneral } from "./footer-general";
import "./home-unauthenticated.css";
import { NavList } from "./nav-list";
import { SignInForm } from "./sign-in-form";

export function HomeUnauthenticated() {
  return (
    <>
      <nav>
        <div className="wrap">
          <div id="logo-container">
            <a href="#" className="logo-link">
              <h1>LinkedIn... ish</h1>
            </a>
          </div>
          <NavList />

          <a href="#" className="button-like no-decoration">
            Join now
          </a>
          <a href="#" className="button-like button-like-outline">
            Sign in
          </a>
        </div>
      </nav>
      <main>
        <section id="sign-in-section">
          <div className="hero-form">
            <h1 id="main-heading">Welcome to your professional community</h1>
            <SignInForm />
            <div className="hero-form-wrap">
              <div className="left-right-divider pb-3 pt-3">
                <p className="divider-text">or</p>
              </div>
              <button className="button-medium button-transparent width-full">
                New to LinkedIn... ish? Join now
              </button>
            </div>
          </div>
          <img src="https://placehold.co/700x560" alt="Placeholder image" />
        </section>
        <section>Three</section>
        <section>Four</section>
        <section>Five</section>
        <section>Six</section>
        <section>Seven</section>
        <section>Eight</section>
        <section>Nine</section>
        <section>Ten</section>
      </main>
      <footer className="home-footer footer-wrap">
        <div>
          <a href="#">LinkedIn... ish</a>
        </div>
        <FooterGeneral />
        <FooterBrowseLinkedIn />
        <FooterBusinessSolutions />
        <FooterDirectories />
      </footer>
    </>
  );
}

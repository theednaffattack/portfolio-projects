import "./home-unauthenticated.css";
import { NavList } from "./nav-list";

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
        </div>
      </nav>
      <section>Two</section>
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

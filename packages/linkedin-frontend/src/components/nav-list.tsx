import { Icon } from "@iconify/react";

import "./nav-list.css";

export function NavList() {
  return (
    <ul className="top-nav">
      <li>
        <a href="#">
          <Icon icon="ph:compass-duotone" fontSize="30px" />
          <span className="link-text-sm">Discover</span>
        </a>
      </li>
      <li>
        <a href="#">
          <Icon icon="ic:round-people-alt" fontSize="30px" />
          <span className="link-text-sm">People</span>
        </a>
      </li>
      <li>
        <a href="#">
          <Icon icon="dashicons:welcome-learn-more" fontSize="30px" />
          <span className="link-text-sm">Learning</span>
        </a>
      </li>
      <li>
        <a href="#">
          <Icon icon="ph:briefcase-duotone" fontSize="30px" />
          <span className="link-text-sm">Jobs</span>
        </a>
      </li>
    </ul>
  );
}

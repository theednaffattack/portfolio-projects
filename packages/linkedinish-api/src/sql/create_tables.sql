-- Specify Database to use
USE linkedinish_api_dev;

-- Users table
CREATE TABLE IF NOT EXISTS users
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    email character varying(320) NOT NULL,
    password character varying(255) NOT NULL,
    username character varying(80) NULL NULL,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email)
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    role_name character varying(60) NOT NULL,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_roles PRIMARY KEY (id),
    CONSTRAINT uq_roles_name UNIQUE (role_name)
);

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions
(
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
    permission_name character varying(60) NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_permissions PRIMARY KEY (id),
    CONSTRAINT uq_permissions_name UNIQUE (permission_name)
);

-- Roles / Permissions table
CREATE TABLE IF NOT EXISTS roles_permissions
(
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_role_permissions PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_roles_permissions_permission FOREIGN KEY (permission_id)
        REFERENCES permissions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fk_roles_permissions_role FOREIGN KEY (role_id)
        REFERENCES roles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name character varying(320) NOT NULL,
    phone character varying(32) NOT NULL,
    email character varying(320) NOT NULL,
    country character varying(2) NOT NULL,
    address character varying(255) NOT NULL,
    city character varying(255) NOT NULL,
    postal_code character varying(12) NOT NULL,
	updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_organizations PRIMARY KEY (id)
);

-- Users / Roles table

CREATE TABLE IF NOT EXISTS users_roles
(
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_users_roles PRIMARY KEY (user_id, role_id, organization_id),
    CONSTRAINT fk_users_roles_role FOREIGN KEY (role_id)
        REFERENCES roles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fk_users_roles_user FOREIGN KEY (user_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fk_users_roles_organization FOREIGN KEY (organization_id)
        REFERENCES organizations (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
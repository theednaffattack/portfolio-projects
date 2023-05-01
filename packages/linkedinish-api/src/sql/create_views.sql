CREATE VIEW vw_user_organization_permissions AS
	SELECT A.user_id, A.organization_id, C.slug as permission_slug
	FROM users_roles AS A
	LEFT JOIN roles_permissions AS B ON A.role_id = B.role_id
	LEFT JOIN permissions AS C on B.permission_id = C.id;
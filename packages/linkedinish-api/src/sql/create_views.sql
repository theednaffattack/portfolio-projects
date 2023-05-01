-- Specify Database to use
USE linkedinish_api_dev;

-- Create view to view permissions
CREATE VIEW vw_user_organization_permissions AS
	SELECT A.user_id, A.organization_id, C.permission_name
	FROM users_roles AS A
	LEFT JOIN roles_permissions AS B ON A.role_id = B.role_id
	LEFT JOIN permissions AS C on B.permission_id = C.id;
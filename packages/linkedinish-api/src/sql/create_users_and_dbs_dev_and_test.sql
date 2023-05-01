CREATE USER linkedInishApiUser;

CREATE DATABASE linkedinish_api_dev;
GRANT ALL PRIVILEGES ON DATABASE linkedinish_api_dev TO linkedInishApiUser;

CREATE DATABASE linkedinish_api_test;
GRANT ALL PRIVILEGES ON DATABASE linkedinish_api_test TO linkedInishApiUser;
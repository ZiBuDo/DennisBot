DROP TABLE Users;
DROP TABLE Triggers;
DROP TABLE Actions;

CREATE TABLE Users (name VARCHAR(200) not null primary key, source VARCHAR(200) not null) CHARACTER SET utf32;
CREATE TABLE Actions (name VARCHAR(200) not null primary key, type VARCHAR(20) not null, contents JSON, user VARCHAR(200) not null) CHARACTER SET utf32;
CREATE TABLE Triggers (name VARCHAR(200) not null primary key, type VARCHAR(20) not null, source VARCHAR(512), user VARCHAR(200) not null) CHARACTER SET utf32;

//TODO: get index to work with typeorm or use typeorm indices

CREATE INDEX user_names ON Users (name);
CREATE UNIQUE INDEX unique_source ON Users (source);


CREATE UNIQUE INDEX action_name_index ON Actions (name);
CREATE INDEX action_user_index ON Actions (user);
CREATE INDEX action_type_index ON Actions (type);


CREATE UNIQUE INDEX unique_type_source ON Triggers (type, source);
CREATE INDEX trigger_type_index ON Triggers (type);
CREATE INDEX trigger_user_index ON Triggers (user);

ALTER TABLE Triggers ADD CONSTRAINT triggers_user_foreign_key FOREIGN KEY (user) REFERENCES Users (name);
ALTER TABLE Actions ADD CONSTRAINT actions_user_foreign_key FOREIGN KEY (user) REFERENCES Users (name);

create database legal;
use legal;

create table roles(
	id				INT AUTO_INCREMENT,
	RoleName		varchar(30),
	PRIMARY KEY (id)
);
INSERT INTO roles (RoleName)
VALUES
('admin'),('customer'), ('lawyer');

create table usersTb(
	id			INT AUTO_INCREMENT,
	name        VARCHAR(80) NOT NULL,
	email		varchar(80) UNIQUE NOT NULL,
	password	varchar(250),
	role_id		INT NOT NULL,
	phone       VARCHAR(20) NULL,
	PRIMARY KEY (id),
	CONSTRAINT fk_roleid	FOREIGN KEY (role_id) REFERENCES roles(id)
)ENGINE=InnoDB;


CREATE TABLE cities(
    id INT AUTO_INCREMENT PRIMARY KEY,
    cityName varchar(255) NOT NULL
)ENGINE=InnoDB;

INSERT INTO cities (cityName) VALUES
('New York'),
('Los Angeles'),
('Chicago'),
('Houston'),
('Phoenix'),
('Philadelphia'),
('San Antonio'),
('San Diego'),
('Dallas'),
('San Jose'),
('Austin'),
('Jacksonville'),
('Fort Worth'),
('Columbus'),
('Charlotte'),
('San Francisco'),
('Indianapolis'),
('Seattle'),
('Denver'),
('Washington'),
('Boston'),
('El Paso'),
('Nashville'),
('Detroit'),
('Oklahoma City'),
('Portland'),
('Las Vegas'),
('Memphis'),
('Louisville'),
('Baltimore');


CREATE TABLE lawyersFiles (
    lawyer_id INT NOT NULL PRIMARY KEY,
	address		varchar(200) NOT NULL,
	yearExp		INT,
    cardNumber VARCHAR(20) NOT NULL,
    city        INT, 
    licenseNumber VARCHAR(50) NOT NULL,    
    documentImage VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approve', 'reject') NOT NULL,
    CONSTRAINT fk_lawyer_verification FOREIGN KEY (lawyer_id) REFERENCES usersTb(id) ON DELETE CASCADE,
    CONSTRAINT fk_lawyer_city FOREIGN KEY (city) REFERENCES cities(id)
)ENGINE=InnoDB;


 CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,        
    lawyer_id INT NOT NULL,      
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5), 
    comment LONGTEXT NULL,           
    created_at DATETIME(3) DEFAULT NOW(3),
    updated_at DATETIME(3) DEFAULT NOW(3),
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES usersTb(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_lawyer FOREIGN KEY (lawyer_id) REFERENCES lawyersFiles(lawyer_id) ON DELETE CASCADE
)ENGINE=InnoDB;

CREATE TABLE specializations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE
);

INSERT INTO specializations (name) VALUES
('Criminal Law'),
('Family Law'),
('Corporate Law'),
('Intellectual Property Law'),
('Tax Law'),
('Labor and Employment Law'),
('Environmental Law'),
('Immigration Law'),
('Real Estate Law'),
('Banking and Finance Law'),
('International Law'),
('Human Rights Law'),
('Cybersecurity and Data Privacy Law'),
('Health Care Law'),
('Insurance Law'),
('Maritime Law'),
('Sports and Entertainment Law'),
('Construction Law'),
('Consumer Protection Law'),
('Energy Law'),
('Telecommunications Law'),
('Competition / Antitrust Law'),
('Bankruptcy Law'),
('Elder Law'),
('Education Law'),
('Military Law'),
('Transportation Law'),
('Aviation Law'),
('Agricultural Law'),
('Mining and Natural Resources Law');

CREATE TABLE lawyer_spec(
    lawyer_id INT NOT NULL,
    specialization_id INT NOT NULL,
    PRIMARY KEY (lawyer_id, specialization_id),
    CONSTRAINT fk_ls_lawyer FOREIGN KEY (lawyer_id) REFERENCES lawyersFiles(lawyer_id) ON DELETE CASCADE, 
    CONSTRAINT fk_ls_specialization FOREIGN KEY (specialization_id) REFERENCES specializations(id)
) ENGINE=InnoDB;

CREATE TABLE availability_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lawyer_id INT NOT NULL,
    day_of_week ENUM('Mon','Tue','Wed','Thu','Fri','Sat','Sun') NOT NULL,
    start_time TIME(6) NOT NULL,
    end_time TIME(6) NOT NULL,
    is_booked TINYINT NOT NULL DEFAULT 0,
    CONSTRAINT FK_availability_slots_lawyer
        FOREIGN KEY (lawyer_id) REFERENCES lawyersFiles(lawyer_id) ON DELETE CASCADE
)ENGINE=InnoDB;

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    lawyer_id INT NOT NULL,
    slot_id INT NOT NULL,
    request_text LONGTEXT,
    response_text LONGTEXT,
    status ENUM('pending','completed') NOT NULL DEFAULT 'pending',

    created_at DATETIME(3) DEFAULT NOW(3),
    updated_at DATETIME(3) DEFAULT NOW(3),
    CONSTRAINT fk_customer_appointment FOREIGN KEY (customer_id) REFERENCES usersTb(id) ON DELETE CASCADE,
    CONSTRAINT fk_lawyer_appointment FOREIGN KEY (lawyer_id) REFERENCES lawyersFiles(lawyer_id),
    CONSTRAINT fk_slot FOREIGN KEY (slot_id) REFERENCES availability_slots(id)
)ENGINE=InnoDB;

CREATE TABLE rescheduled (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    customer_id INT NOT NULL, 
    old_slot_id INT NOT NULL,
    new_slot_id INT NULL,
    reason VARCHAR(255) NULL,
    status ENUM('canceled', 'rescheduled') NOT NULL,
    created_at DATETIME(3) DEFAULT NOW(3),
    updated_at DATETIME(3) DEFAULT NOW(3),

    CONSTRAINT fk_reschedule_user FOREIGN KEY (customer_id) REFERENCES usersTb(id),
    CONSTRAINT fk_reschedule_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
)ENGINE=InnoDB;
 

CREATE TABLE system_notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    author_ID INT NOT NULL,
    status ENUM('published', 'expired') NOT NULL,
    created_at DATETIME(3) DEFAULT NOW(3),
    expired_at DATETIME(3) DEFAULT NOW(3),
    type ENUM('system','reminder') NOT NULL,
	CONSTRAINT fk_authorID	FOREIGN KEY (author_ID) REFERENCES usersTb(id) ON DELETE CASCADE
)ENGINE=InnoDB;

CREATE TABLE pivot_notifications (
    notification_id INT NOT NULL,
    appointment_id INT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (notification_id, user_id),
    FOREIGN KEY (notification_id) REFERENCES system_notification(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES usersTb(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)) ENGINE=InnoDB;

CREATE TABLE FAQ (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_ID INT NOT NULL,
    question VARCHAR(255) NOT NULL,
    answer LONGTEXT NULL,
    type ENUM('system', 'customer', 'lawyer') NOT NULL,
	resolved_status TINYINT DEFAULT 0,
	resolved_at DATETIME(3) NULL,
    created_at DATETIME(3) DEFAULT NOW(3),
    updated_at DATETIME(3) DEFAULT NOW(3),
    CONSTRAINT fk_faq_author FOREIGN KEY (author_ID) REFERENCES usersTb(id) ON DELETE CASCADE
)ENGINE=InnoDB;
 

 
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTriggersForCheckDefaultWorker1779995179594 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // appointments
    await queryRunner.query(`
      CREATE TRIGGER prevent_fk_to_default_appointments
      BEFORE INSERT ON appointments
      FOR EACH ROW
      BEGIN
        -- Заборона використання базового працівника
        IF EXISTS (
          SELECT 1 FROM workers w
          WHERE w.id = NEW.worker_id AND w.name = 'DEFAULTNAME'
        ) THEN
          SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot reference default worker (DEFAULTNAME)';
        END IF;
      END;
    `);

    // workers
    await queryRunner.query(`CREATE TRIGGER prevent_invalid_default_workers
BEFORE INSERT ON workers
FOR EACH ROW
BEGIN
  -- Дозволяємо тільки точне ім’я DEFAULTNAME
  IF NEW.name LIKE 'DEFAULT%' AND NEW.name <> 'DEFAULTNAME' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only DEFAULTNAME worker is allowed, other DEFAULT* names are forbidden';
  END IF;

  -- Якщо це не базовий працівник, то він не може посилатися на базову клініку чи спеціальність
  IF NEW.name <> 'DEFAULTNAME' THEN
    IF EXISTS (
      SELECT 1 FROM dental_clinics dc WHERE dc.id = NEW.dentistry_id AND dc.city = 'DEFAULTCITY'
    ) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only default worker can reference default clinic';
    END IF;

    IF EXISTS (
      SELECT 1 FROM specialties s WHERE s.id = NEW.specialty_id AND s.name = 'DEFAULTNAME'
    ) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only default worker can reference default specialty';
    END IF;
  END IF;
END;
`);

    // specialty
    await queryRunner.query(`CREATE TRIGGER prevent_invalid_default_specialties
BEFORE INSERT ON specialties
FOR EACH ROW
BEGIN
  -- Дозволяємо тільки точне ім’я DEFAULTNAME
  IF NEW.name LIKE 'DEFAULT%' AND NEW.name <> 'DEFAULTNAME' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only DEFAULTNAME specialty is allowed, other DEFAULT* names are forbidden';
  END IF;
END;
`);

    // dental_clinics
    await queryRunner.query(`CREATE TRIGGER prevent_invalid_default_clinics
BEFORE INSERT ON dental_clinics
FOR EACH ROW
BEGIN
  -- Дозволяємо тільки точне місто DEFAULTCITY
  IF NEW.city LIKE 'DEFAULT%' AND NEW.city <> 'DEFAULTCITY' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only DEFAULTCITY clinic is allowed, other DEFAULT* cities are forbidden';
  END IF;
END;
`);

    // workers_shifts
    await queryRunner.query(`
      CREATE TRIGGER prevent_fk_to_default_workers_shifts
      BEFORE INSERT ON workers_shifts
      FOR EACH ROW
      BEGIN
        IF EXISTS (
          SELECT 1 FROM workers w
          WHERE w.id = NEW.worker_id AND w.name = 'DEFAULTNAME'
        ) THEN
          SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot reference default worker (DEFAULTNAME)';
        END IF;
      END;
    `);

    // licenses
    await queryRunner.query(`
      CREATE TRIGGER prevent_fk_to_default_licenses
      BEFORE INSERT ON licenses
      FOR EACH ROW
      BEGIN
        IF EXISTS (
          SELECT 1 FROM workers w
          WHERE w.id = NEW.worker_id AND w.name = 'DEFAULTNAME'
        ) THEN
          SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot reference default worker (DEFAULTNAME)';
        END IF;
      END;
    `);

    // appointments_actions
    await queryRunner.query(`
     CREATE TRIGGER prevent_fk_to_default_appointments_actions
BEFORE INSERT ON appointments_actions
FOR EACH ROW
BEGIN
  -- Заборона використання базової клініки через operation_id
  IF EXISTS (
    SELECT 1
    FROM dental_clinics dc
    JOIN operation_list o ON o.dental_clinic_id = dc.id
    WHERE o.id = NEW.operation_id AND dc.city = 'DEFAULTCITY'
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot reference default dentistry (DEFAULTCITY)';
  END IF;

  -- Заборона використання базового працівника через appointment_id
  IF EXISTS (
    SELECT 1
    FROM workers w
    JOIN appointments a ON a.worker_id = w.id
    WHERE a.id = NEW.appointment_id AND w.name = 'DEFAULTNAME'
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot reference default worker (DEFAULTNAME)';
  END IF;
END;

    `);

    // clients
    await queryRunner.query(`
      CREATE TRIGGER prevent_fk_to_default_clients
      BEFORE INSERT ON clients
      FOR EACH ROW
      BEGIN
        -- Заборона використання email = DEFAULTNAME у зв’язках
        IF NEW.email = 'DEFAULTNAME' THEN
          SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot use default client email in relations';
        END IF;
      END;
    `);

    // operation_list
    await queryRunner.query(`
      CREATE TRIGGER prevent_fk_to_default_operation_list
      BEFORE INSERT ON operation_list
      FOR EACH ROW
      BEGIN
        IF EXISTS (
          SELECT 1 FROM dental_clinics dc
          WHERE dc.id = NEW.dental_clinic_id AND dc.city = 'DEFAULTCITY'
        ) THEN
          SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot reference default dentistry (DEFAULTCITY)';
        END IF;
      END;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS prevent_fk_to_default_appointments;`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS prevent_fk_to_default_workers;`,
    );

    await queryRunner.query(
      `DROP TRIGGER IF EXISTS prevent_fk_to_default_appointments_actions;`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS prevent_fk_to_default_clients;`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS prevent_fk_to_default_dental_clinics;`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS prevent_fk_to_default_licenses;`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS prevent_fk_to_default_operation_list;`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS prevent_fk_to_default_specialties;`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS prevent_fk_to_default_workers_shifts;`,
    );
  }
}

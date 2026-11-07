-- ==============================================================================
-- PHASE 4B MIGRATION 09: ROW LEVEL SECURITY (RLS) POLICIES FOR 39 TABLES
-- Project: Bệnh viện Thú y Lê Sơn
-- Architecture: Phase 4A v1.6.9 Baseline (Section VI.4, Gate 3)
-- Invariants Enforced: P1-D (Strict Security Boundary), BYO-2, V-2, V-5
-- ==============================================================================

-- ==============================================================================
-- I. KÍCH HOẠT RLS TRÊN TOÀN BỘ 39 BẢNG (34 APP + 4 STAGING + 1 AUDIT)
-- ==============================================================================

-- Schema staging (4 bảng)
ALTER TABLE staging.import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE staging.import_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE staging.import_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE staging.import_mappings ENABLE ROW LEVEL SECURITY;

-- Schema audit (1 bảng)
ALTER TABLE audit.audit_logs ENABLE ROW LEVEL SECURITY;

-- Schema app (34 bảng)
ALTER TABLE app.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.staff_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.cage_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.shift_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.customer_user_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.user_link_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.pet_medical_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.medical_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.guest_booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.staff_device_sessions ENABLE ROW LEVEL SECURITY;

ALTER TABLE app.clinical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.clinical_record_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.clinical_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.treatment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.clinical_amendments ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.cages ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.inpatient_stays ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.inpatient_daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.pet_medical_bulletins ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.inpatient_daily_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.bulletin_approval_history ENABLE ROW LEVEL SECURITY;

ALTER TABLE app.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.inventory_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.invoice_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.historical_loyalty_points ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- II. CHÍNH SÁCH BẢO VỆ SCHEMA STAGING (ADMIN ONLY)
-- ==============================================================================

DROP POLICY IF EXISTS rls_staging_import_jobs_admin ON staging.import_jobs;
CREATE POLICY rls_staging_import_jobs_admin ON staging.import_jobs
FOR ALL TO authenticated
USING (app.is_admin())
WITH CHECK (app.is_admin());

DROP POLICY IF EXISTS rls_staging_import_rows_admin ON staging.import_rows;
CREATE POLICY rls_staging_import_rows_admin ON staging.import_rows
FOR ALL TO authenticated
USING (app.is_admin())
WITH CHECK (app.is_admin());

DROP POLICY IF EXISTS rls_staging_import_errors_admin ON staging.import_errors;
CREATE POLICY rls_staging_import_errors_admin ON staging.import_errors
FOR ALL TO authenticated
USING (app.is_admin())
WITH CHECK (app.is_admin());

DROP POLICY IF EXISTS rls_staging_import_mappings_admin ON staging.import_mappings;
CREATE POLICY rls_staging_import_mappings_admin ON staging.import_mappings
FOR ALL TO authenticated
USING (app.is_admin())
WITH CHECK (app.is_admin());

-- ==============================================================================
-- III. CHÍNH SÁCH BẢO VỆ SCHEMA AUDIT (ADMIN SELECT ONLY, CẤM INSERT/UPDATE/DELETE TỪ CLIENT)
-- ==============================================================================

DROP POLICY IF EXISTS rls_audit_logs_admin_select ON audit.audit_logs;
CREATE POLICY rls_audit_logs_admin_select ON audit.audit_logs
FOR SELECT TO authenticated
USING (app.is_admin());

-- ==============================================================================
-- IV. CHÍNH SÁCH BẢO VỆ ĐẶC BIỆT: BYO-2 & V-2 (ADMIN ONLY)
-- ==============================================================================

-- BYO-2 Invariant: CẤM tuyệt đối SELECT session_token_hash / device_fingerprint từ client nhân viên
DROP POLICY IF EXISTS rls_staff_device_sessions_admin ON app.staff_device_sessions;
CREATE POLICY rls_staff_device_sessions_admin ON app.staff_device_sessions
FOR ALL TO authenticated
USING (app.is_admin())
WITH CHECK (app.is_admin());

-- V-2 Invariant: Điểm tích lũy cũ GPet chỉ Admin truy cập qua endpoint quản trị
DROP POLICY IF EXISTS rls_historical_loyalty_points_admin ON app.historical_loyalty_points;
CREATE POLICY rls_historical_loyalty_points_admin ON app.historical_loyalty_points
FOR ALL TO authenticated
USING (app.is_admin())
WITH CHECK (app.is_admin());

-- ==============================================================================
-- V. CHÍNH SÁCH PHÂN HỆ NGƯỜI DÙNG & TỔ CHỨC (CORE ENTITIES)
-- ==============================================================================

-- app.users: Khách xem chính mình, Nhân viên xem danh sách, Admin toàn quyền
DROP POLICY IF EXISTS rls_users_select_self ON app.users;
CREATE POLICY rls_users_select_self ON app.users
FOR SELECT TO authenticated
USING (id = auth.uid() OR app.is_staff());

DROP POLICY IF EXISTS rls_users_update_self ON app.users;
CREATE POLICY rls_users_update_self ON app.users
FOR UPDATE TO authenticated
USING (id = auth.uid() OR app.is_admin())
WITH CHECK (id = auth.uid() OR app.is_admin());

DROP POLICY IF EXISTS rls_users_admin_insert ON app.users;
CREATE POLICY rls_users_admin_insert ON app.users
FOR INSERT TO authenticated
WITH CHECK (app.is_admin() OR id = auth.uid());

DROP POLICY IF EXISTS rls_users_admin_delete ON app.users;
CREATE POLICY rls_users_admin_delete ON app.users
FOR DELETE TO authenticated
USING (app.is_admin());

-- app.staff_role_assignments: Nhân viên xem, Admin toàn quyền
DROP POLICY IF EXISTS rls_staff_roles_select ON app.staff_role_assignments;
CREATE POLICY rls_staff_roles_select ON app.staff_role_assignments
FOR SELECT TO authenticated
USING (app.is_staff());

DROP POLICY IF EXISTS rls_staff_roles_admin_all ON app.staff_role_assignments;
CREATE POLICY rls_staff_roles_admin_all ON app.staff_role_assignments
FOR ALL TO authenticated
USING (app.is_admin())
WITH CHECK (app.is_admin());

-- app.shifts, app.shift_assignments, app.cage_zones: Nhân viên xem, Admin quản lý
DROP POLICY IF EXISTS rls_shifts_select ON app.shifts;
CREATE POLICY rls_shifts_select ON app.shifts
FOR SELECT TO authenticated
USING (app.is_staff());

DROP POLICY IF EXISTS rls_shifts_admin ON app.shifts;
CREATE POLICY rls_shifts_admin ON app.shifts
FOR ALL TO authenticated
USING (app.is_admin())
WITH CHECK (app.is_admin());

DROP POLICY IF EXISTS rls_shift_assignments_select ON app.shift_assignments;
CREATE POLICY rls_shift_assignments_select ON app.shift_assignments
FOR SELECT TO authenticated
USING (app.is_staff());

DROP POLICY IF EXISTS rls_shift_assignments_admin ON app.shift_assignments;
CREATE POLICY rls_shift_assignments_admin ON app.shift_assignments
FOR ALL TO authenticated
USING (app.is_admin())
WITH CHECK (app.is_admin());

DROP POLICY IF EXISTS rls_cage_zones_select ON app.cage_zones;
CREATE POLICY rls_cage_zones_select ON app.cage_zones
FOR SELECT TO authenticated
USING (app.is_staff());

DROP POLICY IF EXISTS rls_cage_zones_admin ON app.cage_zones;
CREATE POLICY rls_cage_zones_admin ON app.cage_zones
FOR ALL TO authenticated
USING (app.is_admin())
WITH CHECK (app.is_admin());

-- ==============================================================================
-- VI. CHÍNH SÁCH KHÁCH HÀNG & THÚ CƯNG (CUSTOMERS & PETS)
-- ==============================================================================

-- app.customers: Khách xem hồ sơ liên kết của mình, Nhân viên xem/thêm/sửa
DROP POLICY IF EXISTS rls_customers_select ON app.customers;
CREATE POLICY rls_customers_select ON app.customers
FOR SELECT TO authenticated
USING (
    app.is_staff() 
    OR id = app.get_customer_id_for_user()
);

DROP POLICY IF EXISTS rls_customers_staff_insert ON app.customers;
CREATE POLICY rls_customers_staff_insert ON app.customers
FOR INSERT TO authenticated
WITH CHECK (app.is_staff());

DROP POLICY IF EXISTS rls_customers_staff_update ON app.customers;
CREATE POLICY rls_customers_staff_update ON app.customers
FOR UPDATE TO authenticated
USING (app.is_staff())
WITH CHECK (app.is_staff());

DROP POLICY IF EXISTS rls_customers_admin_delete ON app.customers;
CREATE POLICY rls_customers_admin_delete ON app.customers
FOR DELETE TO authenticated
USING (app.is_admin());

-- app.pets: Khách xem thú cưng của mình, Nhân viên quản lý
DROP POLICY IF EXISTS rls_pets_select ON app.pets;
CREATE POLICY rls_pets_select ON app.pets
FOR SELECT TO authenticated
USING (
    app.is_staff()
    OR customer_id = app.get_customer_id_for_user()
);

DROP POLICY IF EXISTS rls_pets_staff_manage ON app.pets;
CREATE POLICY rls_pets_staff_manage ON app.pets
FOR ALL TO authenticated
USING (app.is_staff())
WITH CHECK (app.is_staff());

-- app.customer_user_links & user_link_requests: Khách xem/gửi yêu cầu của mình, Lễ tân/Admin xác minh
DROP POLICY IF EXISTS rls_links_customer_select ON app.customer_user_links;
CREATE POLICY rls_links_customer_select ON app.customer_user_links
FOR SELECT TO authenticated
USING (user_id = auth.uid() OR app.is_staff());

DROP POLICY IF EXISTS rls_links_customer_insert ON app.customer_user_links;
CREATE POLICY rls_links_customer_insert ON app.customer_user_links
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() OR app.is_staff());

DROP POLICY IF EXISTS rls_links_staff_update ON app.customer_user_links;
CREATE POLICY rls_links_staff_update ON app.customer_user_links
FOR UPDATE TO authenticated
USING (app.is_staff())
WITH CHECK (app.is_staff());

DROP POLICY IF EXISTS rls_link_requests_select ON app.user_link_requests;
CREATE POLICY rls_link_requests_select ON app.user_link_requests
FOR SELECT TO authenticated
USING (user_id = auth.uid() OR app.is_staff());

DROP POLICY IF EXISTS rls_link_requests_insert ON app.user_link_requests;
CREATE POLICY rls_link_requests_insert ON app.user_link_requests
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() OR app.is_staff());

DROP POLICY IF EXISTS rls_link_requests_staff_update ON app.user_link_requests;
CREATE POLICY rls_link_requests_staff_update ON app.user_link_requests
FOR UPDATE TO authenticated
USING (app.is_staff())
WITH CHECK (app.is_staff());

-- app.pet_medical_consents: Nhân viên xem, Bác sĩ/Admin tạo
DROP POLICY IF EXISTS rls_consents_staff_select ON app.pet_medical_consents;
CREATE POLICY rls_consents_staff_select ON app.pet_medical_consents
FOR SELECT TO authenticated
USING (app.is_staff());

DROP POLICY IF EXISTS rls_consents_doc_insert ON app.pet_medical_consents;
CREATE POLICY rls_consents_doc_insert ON app.pet_medical_consents
FOR INSERT TO authenticated
WITH CHECK (app.has_role('doctor') OR app.has_role('veterinarian') OR app.is_admin());

DROP POLICY IF EXISTS rls_consents_admin_manage ON app.pet_medical_consents;
CREATE POLICY rls_consents_admin_manage ON app.pet_medical_consents
FOR UPDATE TO authenticated
USING (app.is_admin())
WITH CHECK (app.is_admin());

-- app.appointments & medical_appointments: Khách xem/đặt cho mình, Nhân viên quản lý
DROP POLICY IF EXISTS rls_appointments_select ON app.appointments;
CREATE POLICY rls_appointments_select ON app.appointments
FOR SELECT TO authenticated
USING (
    app.is_staff()
    OR customer_id = app.get_customer_id_for_user()
);

DROP POLICY IF EXISTS rls_appointments_insert ON app.appointments;
CREATE POLICY rls_appointments_insert ON app.appointments
FOR INSERT TO authenticated
WITH CHECK (
    app.is_staff()
    OR customer_id = app.get_customer_id_for_user()
);

DROP POLICY IF EXISTS rls_appointments_staff_update ON app.appointments;
CREATE POLICY rls_appointments_staff_update ON app.appointments
FOR UPDATE TO authenticated
USING (app.is_staff())
WITH CHECK (app.is_staff());

DROP POLICY IF EXISTS rls_med_appointments_select ON app.medical_appointments;
CREATE POLICY rls_med_appointments_select ON app.medical_appointments
FOR SELECT TO authenticated
USING (
    app.is_staff()
    OR appointment_id IN (
        SELECT id FROM app.appointments WHERE customer_id = app.get_customer_id_for_user()
    )
);

DROP POLICY IF EXISTS rls_med_appointments_staff_manage ON app.medical_appointments;
CREATE POLICY rls_med_appointments_staff_manage ON app.medical_appointments
FOR ALL TO authenticated
USING (app.is_staff())
WITH CHECK (app.is_staff());

-- app.guest_booking_requests: Form web công khai được INSERT, Nhân viên xử lý
DROP POLICY IF EXISTS rls_guest_booking_anon_insert ON app.guest_booking_requests;
CREATE POLICY rls_guest_booking_anon_insert ON app.guest_booking_requests
FOR INSERT TO anon, authenticated
WITH CHECK (TRUE);

DROP POLICY IF EXISTS rls_guest_booking_staff_manage ON app.guest_booking_requests;
CREATE POLICY rls_guest_booking_staff_manage ON app.guest_booking_requests
FOR ALL TO authenticated
USING (app.is_staff())
WITH CHECK (app.is_staff());

-- ==============================================================================
-- VII. CHÍNH SÁCH BỆNH ÁN & NỘI TRÚ (CLINICAL & INPATIENT - CẤM KHÁCH XEM TRỰC TIẾP)
-- ==============================================================================

-- app.clinical_records, vitals, diagnoses: Nhân viên xem, Bác sĩ/Admin tạo/sửa
DROP POLICY IF EXISTS rls_clinical_records_staff_select ON app.clinical_records;
CREATE POLICY rls_clinical_records_staff_select ON app.clinical_records
FOR SELECT TO authenticated
USING (app.is_staff());

DROP POLICY IF EXISTS rls_clinical_records_doc_manage ON app.clinical_records;
CREATE POLICY rls_clinical_records_doc_manage ON app.clinical_records
FOR ALL TO authenticated
USING (app.has_role('doctor') OR app.has_role('veterinarian') OR app.is_admin())
WITH CHECK (app.has_role('doctor') OR app.has_role('veterinarian') OR app.is_admin());

DROP POLICY IF EXISTS rls_clinical_vitals_staff_select ON app.clinical_record_vitals;
CREATE POLICY rls_clinical_vitals_staff_select ON app.clinical_record_vitals
FOR SELECT TO authenticated
USING (app.is_staff());

DROP POLICY IF EXISTS rls_clinical_vitals_doc_manage ON app.clinical_record_vitals;
CREATE POLICY rls_clinical_vitals_doc_manage ON app.clinical_record_vitals
FOR ALL TO authenticated
USING (app.has_role('doctor') OR app.has_role('nurse') OR app.is_admin())
WITH CHECK (app.has_role('doctor') OR app.has_role('nurse') OR app.is_admin());

DROP POLICY IF EXISTS rls_clinical_diagnoses_staff_select ON app.clinical_diagnoses;
CREATE POLICY rls_clinical_diagnoses_staff_select ON app.clinical_diagnoses
FOR SELECT TO authenticated
USING (app.is_staff());

DROP POLICY IF EXISTS rls_clinical_diagnoses_doc_manage ON app.clinical_diagnoses;
CREATE POLICY rls_clinical_diagnoses_doc_manage ON app.clinical_diagnoses
FOR ALL TO authenticated
USING (app.has_role('doctor') OR app.has_role('veterinarian') OR app.is_admin())
WITH CHECK (app.has_role('doctor') OR app.has_role('veterinarian') OR app.is_admin());

-- app.treatment_orders & prescriptions: Nhân viên xem, Điều dưỡng checkoff, Bác sĩ kê đơn
DROP POLICY IF EXISTS rls_treatment_orders_staff_select ON app.treatment_orders;
CREATE POLICY rls_treatment_orders_staff_select ON app.treatment_orders
FOR SELECT TO authenticated
USING (app.is_staff());

DROP POLICY IF EXISTS rls_treatment_orders_staff_manage ON app.treatment_orders;
CREATE POLICY rls_treatment_orders_staff_manage ON app.treatment_orders
FOR ALL TO authenticated
USING (app.has_role('doctor') OR app.has_role('nurse') OR app.is_admin())
WITH CHECK (app.has_role('doctor') OR app.has_role('nurse') OR app.is_admin());

DROP POLICY IF EXISTS rls_prescriptions_staff_select ON app.prescriptions;
CREATE POLICY rls_prescriptions_staff_select ON app.prescriptions
FOR SELECT TO authenticated
USING (app.is_staff());

DROP POLICY IF EXISTS rls_prescriptions_doc_manage ON app.prescriptions;
CREATE POLICY rls_prescriptions_doc_manage ON app.prescriptions
FOR ALL TO authenticated
USING (app.has_role('doctor') OR app.has_role('veterinarian') OR app.is_admin())
WITH CHECK (app.has_role('doctor') OR app.has_role('veterinarian') OR app.is_admin());

DROP POLICY IF EXISTS rls_clinical_amendments_doc ON app.clinical_amendments;
CREATE POLICY rls_clinical_amendments_doc ON app.clinical_amendments
FOR ALL TO authenticated
USING (app.has_role('doctor') OR app.has_role('veterinarian') OR app.is_admin())
WITH CHECK (app.has_role('doctor') OR app.has_role('veterinarian') OR app.is_admin());

-- app.cages, inpatient_stays, daily_logs, inpatient_daily_media: Nhân viên nội trú
DROP POLICY IF EXISTS rls_cages_staff ON app.cages;
CREATE POLICY rls_cages_staff ON app.cages
FOR ALL TO authenticated
USING (app.is_staff())
WITH CHECK (app.is_staff());

DROP POLICY IF EXISTS rls_inpatient_stays_staff ON app.inpatient_stays;
CREATE POLICY rls_inpatient_stays_staff ON app.inpatient_stays
FOR ALL TO authenticated
USING (app.is_staff())
WITH CHECK (app.is_staff());

DROP POLICY IF EXISTS rls_inpatient_daily_logs_staff ON app.inpatient_daily_logs;
CREATE POLICY rls_inpatient_daily_logs_staff ON app.inpatient_daily_logs
FOR ALL TO authenticated
USING (app.is_staff())
WITH CHECK (app.is_staff());

DROP POLICY IF EXISTS rls_inpatient_media_staff ON app.inpatient_daily_media;
CREATE POLICY rls_inpatient_media_staff ON app.inpatient_daily_media
FOR ALL TO authenticated
USING (app.is_staff())
WITH CHECK (app.is_staff());

-- app.pet_medical_bulletins: Khách xem bản tin đã publish của thú cưng mình, Bác sĩ/Admin biên tập
DROP POLICY IF EXISTS rls_bulletins_customer_select ON app.pet_medical_bulletins;
CREATE POLICY rls_bulletins_customer_select ON app.pet_medical_bulletins
FOR SELECT TO authenticated
USING (
    app.is_staff()
    OR (
        status = 'published'
        AND app.owns_pet(pet_id)
    )
);

DROP POLICY IF EXISTS rls_bulletins_staff_manage ON app.pet_medical_bulletins;
CREATE POLICY rls_bulletins_staff_manage ON app.pet_medical_bulletins
FOR ALL TO authenticated
USING (app.has_role('doctor') OR app.has_role('veterinarian') OR app.is_admin())
WITH CHECK (app.has_role('doctor') OR app.has_role('veterinarian') OR app.is_admin());

DROP POLICY IF EXISTS rls_bulletin_history_staff ON app.bulletin_approval_history;
CREATE POLICY rls_bulletin_history_staff ON app.bulletin_approval_history
FOR ALL TO authenticated
USING (app.is_staff())
WITH CHECK (app.is_staff());

-- ==============================================================================
-- VIII. CHÍNH SÁCH BÁN HÀNG, DỊCH VỤ & HÓA ĐƠN (INVENTORY & BILLING)
-- ==============================================================================

-- app.products & services: Khách xem sản phẩm/dịch vụ đang hoạt động, Nhân viên quản lý
DROP POLICY IF EXISTS rls_products_select ON app.products;
CREATE POLICY rls_products_select ON app.products
FOR SELECT TO authenticated
USING (
    app.is_staff()
    OR is_active = TRUE
);

DROP POLICY IF EXISTS rls_products_admin_manage ON app.products;
CREATE POLICY rls_products_admin_manage ON app.products
FOR ALL TO authenticated
USING (app.is_admin())
WITH CHECK (app.is_admin());

DROP POLICY IF EXISTS rls_services_select ON app.services;
CREATE POLICY rls_services_select ON app.services
FOR SELECT TO authenticated
USING (
    app.is_staff()
    OR is_active = TRUE
);

DROP POLICY IF EXISTS rls_services_admin_manage ON app.services;
CREATE POLICY rls_services_admin_manage ON app.services
FOR ALL TO authenticated
USING (app.is_admin())
WITH CHECK (app.is_admin());

-- app.inventory_batches & transactions: Nhân viên xem, Thu ngân/Admin quản lý
DROP POLICY IF EXISTS rls_inventory_batches_staff ON app.inventory_batches;
CREATE POLICY rls_inventory_batches_staff ON app.inventory_batches
FOR ALL TO authenticated
USING (app.is_staff())
WITH CHECK (app.is_staff());

DROP POLICY IF EXISTS rls_inventory_trans_staff ON app.inventory_transactions;
CREATE POLICY rls_inventory_trans_staff ON app.inventory_transactions
FOR ALL TO authenticated
USING (app.is_staff())
WITH CHECK (app.is_staff());

-- app.invoices: Khách xem hóa đơn của mình, Thu ngân/Lễ tân/Admin quản lý
DROP POLICY IF EXISTS rls_invoices_select ON app.invoices;
CREATE POLICY rls_invoices_select ON app.invoices
FOR SELECT TO authenticated
USING (
    app.is_staff()
    OR customer_id = app.get_customer_id_for_user()
);

DROP POLICY IF EXISTS rls_invoices_staff_manage ON app.invoices;
CREATE POLICY rls_invoices_staff_manage ON app.invoices
FOR ALL TO authenticated
USING (app.has_role('cashier') OR app.has_role('receptionist') OR app.is_admin())
WITH CHECK (app.has_role('cashier') OR app.has_role('receptionist') OR app.is_admin());

-- app.invoice_items: Khách xem dòng không ẩn lâm sàng (V-5 Invariant), Thu ngân quản lý
DROP POLICY IF EXISTS rls_invoice_items_select ON app.invoice_items;
CREATE POLICY rls_invoice_items_select ON app.invoice_items
FOR SELECT TO authenticated
USING (
    app.is_staff()
    OR (
        is_clinical_hidden = FALSE
        AND invoice_id IN (
            SELECT id FROM app.invoices WHERE customer_id = app.get_customer_id_for_user()
        )
    )
);

DROP POLICY IF EXISTS rls_invoice_items_staff_manage ON app.invoice_items;
CREATE POLICY rls_invoice_items_staff_manage ON app.invoice_items
FOR ALL TO authenticated
USING (app.has_role('cashier') OR app.has_role('receptionist') OR app.is_admin())
WITH CHECK (app.has_role('cashier') OR app.has_role('receptionist') OR app.is_admin());

-- app.invoice_payments: Khách xem phiếu thanh toán của mình, Thu ngân quản lý
DROP POLICY IF EXISTS rls_invoice_payments_select ON app.invoice_payments;
CREATE POLICY rls_invoice_payments_select ON app.invoice_payments
FOR SELECT TO authenticated
USING (
    app.is_staff()
    OR invoice_id IN (
        SELECT id FROM app.invoices WHERE customer_id = app.get_customer_id_for_user()
    )
);

DROP POLICY IF EXISTS rls_invoice_payments_staff_manage ON app.invoice_payments;
CREATE POLICY rls_invoice_payments_staff_manage ON app.invoice_payments
FOR ALL TO authenticated
USING (app.has_role('cashier') OR app.has_role('receptionist') OR app.is_admin())
WITH CHECK (app.has_role('cashier') OR app.has_role('receptionist') OR app.is_admin());

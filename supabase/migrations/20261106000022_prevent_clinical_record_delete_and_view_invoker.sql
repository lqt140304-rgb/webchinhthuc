-- ==============================================================================
-- MIGRATION: 20261106000022_prevent_clinical_record_delete_and_view_invoker.sql
-- Project: Bệnh viện Thú y Lê Sơn
-- Phase 4B: Stage 9 Priority Remediation - Medical Immutability & View Security Invoker
-- ==============================================================================

-- 1. Trigger chặn triệt để thao tác DELETE trực tiếp trên app.clinical_records (P1-C Invariant & SEC-09)
CREATE OR REPLACE FUNCTION app.fn_prevent_clinical_record_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RAISE EXCEPTION 'APP_ERROR_CLINICAL_RECORD_IMMUTABLE: Hồ sơ bệnh án là bất biến, không được phép xóa (P1-C Invariant)'
        USING ERRCODE = 'P0001';
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_clinical_record_delete ON app.clinical_records;
CREATE TRIGGER trg_prevent_clinical_record_delete
BEFORE DELETE ON app.clinical_records
FOR EACH ROW EXECUTE FUNCTION app.fn_prevent_clinical_record_delete();

-- 2. Cấu hình security_invoker = true và security_barrier = true trên toàn bộ public views
ALTER VIEW public.customer_bulletins_view SET (security_barrier = true, security_invoker = true);
ALTER VIEW public.customer_pets_view SET (security_barrier = true, security_invoker = true);
ALTER VIEW public.customer_invoices_view SET (security_barrier = true, security_invoker = true);
ALTER VIEW public.customer_invoice_items_view SET (security_barrier = true, security_invoker = true);

-- 3. Tạo View Danh mục Dịch vụ Công khai (SEC-35)
CREATE OR REPLACE VIEW public.customer_available_services_view
WITH (security_barrier = true, security_invoker = true) AS
SELECT 
    id,
    service_code,
    service_name,
    category,
    base_price
FROM app.services
WHERE is_active = TRUE;

-- Cấp quyền SELECT trên view công khai cho anon và authenticated
GRANT SELECT ON public.customer_available_services_view TO anon, authenticated;

-- Cho phép SELECT trên các bảng nguồn để view có security_invoker = true đánh giá đúng RLS policy
GRANT SELECT ON app.services TO anon, authenticated;
GRANT SELECT ON app.pets TO authenticated;
GRANT SELECT ON app.pet_medical_bulletins TO authenticated;
GRANT SELECT ON app.invoices TO authenticated;
GRANT SELECT ON app.invoice_items TO authenticated;

-- Bổ sung RLS policy cho anon xem dịch vụ công khai
DROP POLICY IF EXISTS rls_services_anon_select ON app.services;
CREATE POLICY rls_services_anon_select ON app.services
FOR SELECT TO anon
USING (is_active = true);

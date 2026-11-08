-- ==============================================================================
-- PHASE 4B MIGRATION 12: RATE LIMITER & ANTI-ABUSE FOR BOOKINGS (GATE 4)
-- Project: Bệnh viện Thú y Lê Sơn
-- Architecture: Phase 4A v1.6.9 Baseline (Section VIII.2, POL-BOOKING, Gate 4)
-- Invariants Enforced: POL-BOOKING (Max 3 Pending Appointments per Customer/Phone)
-- ==============================================================================

-- 1. Helper Kiểm Tra Giới Hạn Tần Suất Đặt Lịch (POL-BOOKING)
CREATE OR REPLACE FUNCTION app.check_booking_rate_limit(p_customer_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_pending_count INT;
BEGIN
    SELECT count(*) INTO v_pending_count
    FROM app.appointments
    WHERE customer_id = p_customer_id
      AND status IN ('pending', 'confirmed');

    IF v_pending_count >= 3 THEN
        RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Mỗi khách hàng chỉ được có tối đa 3 lịch hẹn đang chờ xử lý.';
    END IF;

    RETURN TRUE;
END;
$$;

-- 2. Trigger Kiểm Soát Tần Suất Đặt Lịch Cho Khách Vãng Lai (Guest Booking Form Anti-Spam)
CREATE OR REPLACE FUNCTION app.fn_enforce_guest_booking_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_recent_guest_count INT;
BEGIN
    -- Kiểm tra tối đa 3 yêu cầu đặt lịch vãng lai trong vòng 24 giờ cho cùng một SĐT
    SELECT count(*) INTO v_recent_guest_count
    FROM app.guest_booking_requests
    WHERE phone_number = NEW.phone_number
      AND created_at >= CLOCK_TIMESTAMP() - INTERVAL '24 hours'
      AND status = 'pending';

    IF v_recent_guest_count >= 3 THEN
        RAISE EXCEPTION 'GUEST_RATE_LIMIT_EXCEEDED: Số điện thoại này đã có 3 yêu cầu đặt lịch đang chờ tiếp nhận. Xin vui lòng liên hệ hotline trực tiếp.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guest_booking_rate_limit ON app.guest_booking_requests;
CREATE TRIGGER trg_guest_booking_rate_limit
BEFORE INSERT ON app.guest_booking_requests
FOR EACH ROW EXECUTE FUNCTION app.fn_enforce_guest_booking_rate_limit();

-- 3. Phân quyền thực thi
REVOKE ALL ON FUNCTION app.check_booking_rate_limit(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION app.check_booking_rate_limit(UUID) TO authenticated;

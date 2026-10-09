-- ============================================================
-- Новые локации + самостоятельная подача объявлений партнёрами
-- ============================================================

-- 1) Расширяем список посёлков
ALTER TABLE public.apartments DROP CONSTRAINT IF EXISTS apartments_location_key_check;
ALTER TABLE public.apartments ADD CONSTRAINT apartments_location_key_check
  CHECK (location_key IN ('terskol','cheget','azau','baidaevo','tyrnyauz','elbrus','bylym'));

-- 2) Владелец объявления + статус модерации
ALTER TABLE public.apartments
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved'
    CHECK (status IN ('pending', 'approved', 'rejected'));

-- 2b) Тип жилья — нужен для калькулятора бюджета (отель/апартаменты/гостевой дом)
ALTER TABLE public.apartments
  ADD COLUMN IF NOT EXISTS level TEXT NOT NULL DEFAULT 'apartments'
    CHECK (level IN ('hotel', 'apartments', 'guesthouse'));

ALTER TABLE public.cafes
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved'
    CHECK (status IN ('pending', 'approved', 'rejected'));

ALTER TABLE public.taxi_services
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved'
    CHECK (status IN ('pending', 'approved', 'rejected'));

-- 3) Публичное чтение — теперь требует ещё и статус 'approved'
DROP POLICY IF EXISTS "Public can view active apartments" ON public.apartments;
CREATE POLICY "Public can view approved apartments"
  ON public.apartments FOR SELECT
  USING (is_active = true AND status = 'approved');

DROP POLICY IF EXISTS "Public can view active cafes" ON public.cafes;
CREATE POLICY "Public can view approved cafes"
  ON public.cafes FOR SELECT
  USING (is_active = true AND status = 'approved');

DROP POLICY IF EXISTS "Public can view active taxi services" ON public.taxi_services;
CREATE POLICY "Public can view approved taxi services"
  ON public.taxi_services FOR SELECT
  USING (is_active = true AND status = 'approved');

-- 4) Владелец видит свои объявления даже на модерации
CREATE POLICY "Owners can view own apartments"
  ON public.apartments FOR SELECT TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can view own cafes"
  ON public.cafes FOR SELECT TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can view own taxi services"
  ON public.taxi_services FOR SELECT TO authenticated
  USING (auth.uid() = owner_id);

-- 5) Любой вошедший пользователь может подать своё объявление
CREATE POLICY "Users can submit own apartment"
  ON public.apartments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can submit own cafe"
  ON public.cafes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can submit own taxi service"
  ON public.taxi_services FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- 6) Владелец может редактировать своё объявление
CREATE POLICY "Owners can update own apartment"
  ON public.apartments FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own cafe"
  ON public.cafes FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own taxi service"
  ON public.taxi_services FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- 7) Защита от самоодобрения: любая вставка/правка не-админом всегда уходит в 'pending'
CREATE OR REPLACE FUNCTION public.enforce_pending_on_self_edit()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.status := 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER apartments_enforce_pending
  BEFORE INSERT OR UPDATE ON public.apartments
  FOR EACH ROW EXECUTE FUNCTION public.enforce_pending_on_self_edit();

CREATE TRIGGER cafes_enforce_pending
  BEFORE INSERT OR UPDATE ON public.cafes
  FOR EACH ROW EXECUTE FUNCTION public.enforce_pending_on_self_edit();

CREATE TRIGGER taxi_enforce_pending
  BEFORE INSERT OR UPDATE ON public.taxi_services
  FOR EACH ROW EXECUTE FUNCTION public.enforce_pending_on_self_edit();

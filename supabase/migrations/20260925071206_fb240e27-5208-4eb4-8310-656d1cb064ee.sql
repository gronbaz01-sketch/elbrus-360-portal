-- ============ Этап 2: новые локации и объявления партнёров ============

-- 1. Поля владельца и статуса модерации
ALTER TABLE public.apartments ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.apartments ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved';

ALTER TABLE public.cafes ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.cafes ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved';

ALTER TABLE public.taxi_services ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.taxi_services ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved';

-- 2. Справочник 7 посёлков
ALTER TABLE public.apartments DROP CONSTRAINT IF EXISTS apartments_location_key_check;
ALTER TABLE public.apartments ADD CONSTRAINT apartments_location_key_check
  CHECK (location_key IN ('terskol','azau','baidaevo','cheget','tyrnyauz','elbrus','bylym'));

-- Кафе: добавляем посёлок и заполняем по адресу
ALTER TABLE public.cafes ADD COLUMN IF NOT EXISTS location_key text;
UPDATE public.cafes SET location_key = CASE
  WHEN location ILIKE '%терскол%' THEN 'terskol'
  WHEN location ILIKE '%азау%' THEN 'azau'
  WHEN location ILIKE '%байдаево%' THEN 'baidaevo'
  WHEN location ILIKE '%чегет%' THEN 'cheget'
  WHEN location ILIKE '%тырныауз%' THEN 'tyrnyauz'
  WHEN location ILIKE '%эльбрус%' THEN 'elbrus'
  WHEN location ILIKE '%былым%' THEN 'bylym'
  ELSE 'terskol' END;
ALTER TABLE public.cafes ALTER COLUMN location_key SET DEFAULT 'terskol';
ALTER TABLE public.cafes ALTER COLUMN location_key SET NOT NULL;
ALTER TABLE public.cafes ADD CONSTRAINT cafes_location_key_check
  CHECK (location_key IN ('terskol','azau','baidaevo','cheget','tyrnyauz','elbrus','bylym'));

-- Такси: посёлок базирования
ALTER TABLE public.taxi_services ADD COLUMN IF NOT EXISTS location_key text NOT NULL DEFAULT 'terskol';
ALTER TABLE public.taxi_services ADD CONSTRAINT taxi_services_location_key_check
  CHECK (location_key IN ('terskol','azau','baidaevo','cheget','tyrnyauz','elbrus','bylym'));

-- 3. Триггер: партнёр всегда владелец своей записи, новая/изменённая запись уходит в ожидание
CREATE OR REPLACE FUNCTION public.enforce_listing_moderation()
RETURNS TRIGGER AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  NEW.owner_id := auth.uid();
  NEW.status := 'pending';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS enforce_apartments_moderation ON public.apartments;
CREATE TRIGGER enforce_apartments_moderation
  BEFORE INSERT OR UPDATE ON public.apartments
  FOR EACH ROW EXECUTE FUNCTION public.enforce_listing_moderation();

DROP TRIGGER IF EXISTS enforce_cafes_moderation ON public.cafes;
CREATE TRIGGER enforce_cafes_moderation
  BEFORE INSERT OR UPDATE ON public.cafes
  FOR EACH ROW EXECUTE FUNCTION public.enforce_listing_moderation();

DROP TRIGGER IF EXISTS enforce_taxi_moderation ON public.taxi_services;
CREATE TRIGGER enforce_taxi_moderation
  BEFORE INSERT OR UPDATE ON public.taxi_services
  FOR EACH ROW EXECUTE FUNCTION public.enforce_listing_moderation();

-- 4. Правила доступа (замена прежних)
DROP POLICY IF EXISTS "Public can view active apartments" ON public.apartments;
DROP POLICY IF EXISTS "Admins can manage apartments" ON public.apartments;
DROP POLICY IF EXISTS "Public can view active cafes" ON public.cafes;
DROP POLICY IF EXISTS "Admins can manage cafes" ON public.cafes;
DROP POLICY IF EXISTS "Public can view active taxi services" ON public.taxi_services;
DROP POLICY IF EXISTS "Admins can manage taxi services" ON public.taxi_services;

-- Жильё
CREATE POLICY "Public can view approved active apartments"
  ON public.apartments FOR SELECT
  USING (is_active = true AND status = 'approved');
CREATE POLICY "Partners can view own apartments"
  ON public.apartments FOR SELECT TO authenticated
  USING (owner_id = auth.uid());
CREATE POLICY "Partners can insert own apartments"
  ON public.apartments FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Partners can update own apartments"
  ON public.apartments FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Partners can delete own apartments"
  ON public.apartments FOR DELETE TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage apartments"
  ON public.apartments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Кафе
CREATE POLICY "Public can view approved active cafes"
  ON public.cafes FOR SELECT
  USING (is_active = true AND status = 'approved');
CREATE POLICY "Partners can view own cafes"
  ON public.cafes FOR SELECT TO authenticated
  USING (owner_id = auth.uid());
CREATE POLICY "Partners can insert own cafes"
  ON public.cafes FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Partners can update own cafes"
  ON public.cafes FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Partners can delete own cafes"
  ON public.cafes FOR DELETE TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage cafes"
  ON public.cafes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Такси
CREATE POLICY "Public can view approved active taxi services"
  ON public.taxi_services FOR SELECT
  USING (is_active = true AND status = 'approved');
CREATE POLICY "Partners can view own taxi services"
  ON public.taxi_services FOR SELECT TO authenticated
  USING (owner_id = auth.uid());
CREATE POLICY "Partners can insert own taxi services"
  ON public.taxi_services FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Partners can update own taxi services"
  ON public.taxi_services FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Partners can delete own taxi services"
  ON public.taxi_services FOR DELETE TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage taxi services"
  ON public.taxi_services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Доступ Data API и индексы
GRANT SELECT, INSERT, UPDATE, DELETE ON public.apartments TO authenticated;
GRANT SELECT ON public.apartments TO anon;
GRANT ALL ON public.apartments TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cafes TO authenticated;
GRANT SELECT ON public.cafes TO anon;
GRANT ALL ON public.cafes TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.taxi_services TO authenticated;
GRANT SELECT ON public.taxi_services TO anon;
GRANT ALL ON public.taxi_services TO service_role;

CREATE INDEX IF NOT EXISTS idx_apartments_moderation ON public.apartments (status, is_active);
CREATE INDEX IF NOT EXISTS idx_cafes_moderation ON public.cafes (status, is_active);
CREATE INDEX IF NOT EXISTS idx_taxi_moderation ON public.taxi_services (status, is_active);
CREATE INDEX IF NOT EXISTS idx_apartments_owner ON public.apartments (owner_id);
CREATE INDEX IF NOT EXISTS idx_cafes_owner ON public.cafes (owner_id);
CREATE INDEX IF NOT EXISTS idx_taxi_owner ON public.taxi_services (owner_id);
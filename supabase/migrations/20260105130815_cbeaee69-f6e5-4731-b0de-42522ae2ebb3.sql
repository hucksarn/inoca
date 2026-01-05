-- Remove the hardcoded category check constraint since categories are now managed dynamically
ALTER TABLE public.material_request_items DROP CONSTRAINT material_request_items_category_check;
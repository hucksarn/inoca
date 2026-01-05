-- Allow admins to delete material requests
CREATE POLICY "Admins can delete requests"
ON public.material_requests
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete request items (cascade behavior)
CREATE POLICY "Admins can delete request items"
ON public.material_request_items
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
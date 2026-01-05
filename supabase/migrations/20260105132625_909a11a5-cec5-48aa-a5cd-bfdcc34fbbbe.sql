-- Fix: Allow users to update their own requests (not just draft) to change status to submitted
DROP POLICY IF EXISTS "Users can update their draft requests" ON public.material_requests;

CREATE POLICY "Users can update their own requests" 
ON public.material_requests 
FOR UPDATE 
TO authenticated
USING (requester_id = auth.uid())
WITH CHECK (requester_id = auth.uid());

-- Also update the material_request_items INSERT policy to allow inserting items to own requests (any status during creation)
DROP POLICY IF EXISTS "Users can insert items to their requests" ON public.material_request_items;

CREATE POLICY "Users can insert items to their requests" 
ON public.material_request_items 
FOR INSERT 
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM material_requests mr 
  WHERE mr.id = material_request_items.request_id 
  AND mr.requester_id = auth.uid()
));
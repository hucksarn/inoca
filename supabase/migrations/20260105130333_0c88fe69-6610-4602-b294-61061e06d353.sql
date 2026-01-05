-- Allow admins to also create requests on behalf of users (if needed)
-- But more importantly, ensure the existing policy works correctly
-- Drop and recreate the insert policy to be clearer
DROP POLICY IF EXISTS "Users can create their own requests" ON public.material_requests;

CREATE POLICY "Users can create their own requests" 
ON public.material_requests 
FOR INSERT 
TO authenticated
WITH CHECK (requester_id = auth.uid());